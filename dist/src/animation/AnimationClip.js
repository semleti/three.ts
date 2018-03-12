var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { VectorKeyframeTrack } from './tracks/VectorKeyframeTrack';
import { QuaternionKeyframeTrack } from './tracks/QuaternionKeyframeTrack';
import { NumberKeyframeTrack } from './tracks/NumberKeyframeTrack';
import { AnimationUtils } from './AnimationUtils';
import { KeyframeTrack } from './KeyframeTrack';
import { _Math } from '../math/Math';
/**
 *
 * Reusable set of Tracks that represent an animation.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */
var AnimationClip = /** @class */ (function () {
    function AnimationClip(name, duration, tracks) {
        if (duration === void 0) { duration = -1; }
        this.name = name;
        this.tracks = tracks;
        this.duration = (duration !== undefined) ? duration : -1;
        this.uuid = _Math.generateUUID();
        // this means it should figure out its duration by scanning the tracks
        if (this.duration < 0) {
            this.resetDuration();
        }
        this.optimize();
    }
    AnimationClip.parse = function (json) {
        var tracks = [], jsonTracks = json.tracks, frameTime = 1.0 / (json.fps || 1.0);
        for (var i = 0, n = jsonTracks.length; i !== n; ++i) {
            tracks.push(KeyframeTrack.parse(jsonTracks[i]).scale(frameTime));
        }
        return new AnimationClip(json.name, json.duration, tracks);
    };
    AnimationClip.toJSON = function (clip) {
        var tracks = [], clipTracks = clip.tracks;
        for (var i = 0, n = clipTracks.length; i !== n; ++i) {
            tracks.push(KeyframeTrack.toJSON(clipTracks[i]));
        }
        var json = new AnimationClip.Data();
        json.name = clip.name;
        json.duration = clip.duration;
        json.tracks = tracks;
        return json;
    };
    AnimationClip.CreateFromMorphTargetSequence = function (name, morphTargetSequence, fps, noLoop) {
        var numMorphTargets = morphTargetSequence.length;
        var tracks = [];
        for (var i = 0; i < numMorphTargets; i++) {
            var times = [];
            var values = [];
            times.push((i + numMorphTargets - 1) % numMorphTargets, i, (i + 1) % numMorphTargets);
            values.push(0, 1, 0);
            var order = AnimationUtils.getKeyframeOrder(times);
            times = AnimationUtils.sortedArray(times, 1, order);
            values = AnimationUtils.sortedArray(values, 1, order);
            // if there is a key at the first frame, duplicate it as the
            // last frame as well for perfect loop.
            if (!noLoop && times[0] === 0) {
                times.push(numMorphTargets);
                values.push(values[0]);
            }
            tracks.push(new NumberKeyframeTrack('.morphTargetInfluences[' + morphTargetSequence[i].name + ']', times, values, null).scale(1.0 / fps));
        }
        return new AnimationClip(name, -1, tracks);
    };
    AnimationClip.findByName = function (objectOrClipArray, name) {
        var clipArray = objectOrClipArray;
        if (!Array.isArray(objectOrClipArray)) {
            var o = objectOrClipArray;
            clipArray = o.geometry && o.geometry.animations || o.animations;
        }
        for (var i = 0; i < clipArray.length; i++) {
            if (clipArray[i].name === name) {
                return clipArray[i];
            }
        }
        return null;
    };
    AnimationClip.CreateClipsFromMorphTargetSequences = function (morphTargets, fps, noLoop) {
        var animationToMorphTargets = {};
        // tested with https://regex101.com/ on trick sequences
        // such flamingo_flyA_003, flamingo_run1_003, crdeath0059
        var pattern = /^([\w-]*?)([\d]+)$/;
        // sort morph target names into animation groups based
        // patterns like Walk_001, Walk_002, Run_001, Run_002
        for (var i = 0, il = morphTargets.length; i < il; i++) {
            var morphTarget = morphTargets[i];
            var parts = morphTarget.name.match(pattern);
            if (parts && parts.length > 1) {
                var name_1 = parts[1];
                var animationMorphTargets = animationToMorphTargets[name_1];
                if (!animationMorphTargets) {
                    animationToMorphTargets[name_1] = animationMorphTargets = [];
                }
                animationMorphTargets.push(morphTarget);
            }
        }
        var clips = [];
        for (var name_2 in animationToMorphTargets) {
            clips.push(AnimationClip.CreateFromMorphTargetSequence(name_2, animationToMorphTargets[name_2], fps, noLoop));
        }
        return clips;
    };
    // parse the animation.hierarchy format
    AnimationClip.parseAnimation = function (animation, bones) {
        if (!animation) {
            console.error('THREE.AnimationClip: No animation in JSONLoader data.');
            return null;
        }
        function addNonemptyTrack(trackType, trackName, animationKeys, propertyName, destTracks) {
            // only return track if there are actually keys.
            if (animationKeys.length !== 0) {
                var times = [];
                var values = [];
                AnimationUtils.flattenJSON(animationKeys, times, values, propertyName);
                // empty keys are filtered out, so check again
                if (times.length !== 0) {
                    destTracks.push(new trackType(trackName, times, values));
                }
            }
        }
        var tracks = [];
        var clipName = animation.name || 'default';
        // automatic length determination in AnimationClip.
        var duration = animation.length || -1;
        var fps = animation.fps || 30;
        var hierarchyTracks = animation.hierarchy || [];
        for (var h = 0; h < hierarchyTracks.length; h++) {
            var animationKeys = hierarchyTracks[h].keys;
            // skip empty tracks
            if (!animationKeys || animationKeys.length === 0)
                continue;
            // process morph targets
            if (animationKeys[0].morphTargets) {
                // figure out all morph targets used in this track
                //TODO: check if noat = {} as initially
                var morphTargetNames = [];
                var k = 0;
                for (k = 0; k < animationKeys.length; k++) {
                    if (animationKeys[k].morphTargets) {
                        for (var m = 0; m < animationKeys[k].morphTargets.length; m++) {
                            morphTargetNames[animationKeys[k].morphTargets[m]] = -1;
                        }
                    }
                }
                // create a track for each morph target with all zero
                // morphTargetInfluences except for the keys in which
                // the morphTarget is named.
                for (var morphTargetName in morphTargetNames) {
                    var times = [];
                    var values = [];
                    for (var m = 0; m !== animationKeys[k].morphTargets.length; ++m) {
                        var animationKey = animationKeys[k];
                        times.push(animationKey.time);
                        values.push((animationKey.morphTarget === morphTargetName) ? 1 : 0);
                    }
                    tracks.push(new NumberKeyframeTrack('.morphTargetInfluence[' + morphTargetName + ']', times, values, null));
                }
                duration = morphTargetNames.length * (fps || 1.0);
            }
            else {
                // ...assume skeletal animation
                var boneName = '.bones[' + bones[h].name + ']';
                addNonemptyTrack(VectorKeyframeTrack, boneName + '.position', animationKeys, 'pos', tracks);
                addNonemptyTrack(QuaternionKeyframeTrack, boneName + '.quaternion', animationKeys, 'rot', tracks);
                addNonemptyTrack(VectorKeyframeTrack, boneName + '.scale', animationKeys, 'scl', tracks);
            }
        }
        if (tracks.length === 0) {
            return null;
        }
        var clip = new AnimationClip(clipName, duration, tracks);
        return clip;
    };
    AnimationClip.prototype.resetDuration = function () {
        var tracks = this.tracks, duration = 0;
        for (var i = 0, n = tracks.length; i !== n; ++i) {
            var track = this.tracks[i];
            duration = Math.max(duration, track.times[track.times.length - 1]);
        }
        this.duration = duration;
    };
    AnimationClip.prototype.trim = function () {
        for (var i = 0; i < this.tracks.length; i++) {
            this.tracks[i].trim(0, this.duration);
        }
        return this;
    };
    AnimationClip.prototype.optimize = function () {
        for (var i = 0; i < this.tracks.length; i++) {
            this.tracks[i].optimize();
        }
        return this;
    };
    return AnimationClip;
}());
export { AnimationClip };
(function (AnimationClip) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(KeyframeTrack.Data));
    AnimationClip.Data = Data;
})(AnimationClip || (AnimationClip = {}));

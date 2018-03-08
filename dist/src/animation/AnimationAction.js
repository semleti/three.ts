import { WrapAroundEnding, ZeroCurvatureEnding, ZeroSlopeEnding, LoopPingPong, LoopOnce, LoopRepeat } from '../constants';
/**
 *
 * Action provided by AnimationMixer for scheduling clip playback on specific
 * objects.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 *
 */
var AnimationAction = /** @class */ (function () {
    function AnimationAction(mixer, clip, localRoot) {
        this._cacheIndex = null; // for the memory manager
        this._byClipCacheIndex = null; // for the memory manager
        this._timeScaleInterpolant = null;
        this._weightInterpolant = null;
        this.loop = LoopRepeat;
        this._loopCount = -1;
        // global mixer time when the action is to be started
        // it's set back to 'null' upon start of the action
        this._startTime = null;
        // scaled local time of the action
        // gets clamped or wrapped to 0..clip.duration according to loop
        this.time = 0;
        this.timeScale = 1;
        this._effectiveTimeScale = 1;
        this.weight = 1;
        this._effectiveWeight = 1;
        this.repetitions = Infinity; // no. of repetitions when looping
        this.paused = false; // true -> zero effective time scale
        this.enabled = true; // false -> zero effective weight
        this.clampWhenFinished = false; // keep feeding the last frame?
        this.zeroSlopeAtStart = true; // for smooth interpolation w/o separate
        this.zeroSlopeAtEnd = true; // clips for start, loop and end
        this._mixer = mixer;
        this._clip = clip;
        this._localRoot = localRoot || null;
        var tracks = clip.tracks, nTracks = tracks.length, interpolants = new Array(nTracks);
        var interpolantSettings = {
            endingStart: ZeroCurvatureEnding,
            endingEnd: ZeroCurvatureEnding
        };
        for (var i = 0; i !== nTracks; ++i) {
            var interpolant = tracks[i].createInterpolant(null);
            interpolants[i] = interpolant;
            interpolant.settings = interpolantSettings;
        }
        this._interpolantSettings = interpolantSettings;
        this._interpolants = interpolants; // bound by the mixer
        // inside: PropertyMixer (managed by the mixer)
        this._propertyBindings = new Array(nTracks);
    }
    // State & Scheduling
    AnimationAction.prototype.play = function () {
        this._mixer._activateAction(this);
        return this;
    };
    AnimationAction.prototype.stop = function () {
        this._mixer._deactivateAction(this);
        return this.reset();
    };
    AnimationAction.prototype.reset = function () {
        this.paused = false;
        this.enabled = true;
        this.time = 0; // restart clip
        this._loopCount = -1; // forget previous loops
        this._startTime = null; // forget scheduling
        return this.stopFading().stopWarping();
    };
    AnimationAction.prototype.isRunning = function () {
        return this.enabled && !this.paused && this.timeScale !== 0 &&
            this._startTime === null && this._mixer._isActiveAction(this);
    };
    // return true when play has been called
    AnimationAction.prototype.isScheduled = function () {
        return this._mixer._isActiveAction(this);
    };
    AnimationAction.prototype.startAt = function (time) {
        this._startTime = time;
        return this;
    };
    AnimationAction.prototype.setLoop = function (mode, repetitions) {
        this.loop = mode;
        this.repetitions = repetitions;
        return this;
    };
    // Weight
    // set the weight stopping any scheduled fading
    // although .enabled = false yields an effective weight of zero, this
    // method does *not* change .enabled, because it would be confusing
    AnimationAction.prototype.setEffectiveWeight = function (weight) {
        this.weight = weight;
        // note: same logic as when updated at runtime
        this._effectiveWeight = this.enabled ? weight : 0;
        return this.stopFading();
    };
    // return the weight considering fading and .enabled
    AnimationAction.prototype.getEffectiveWeight = function () {
        return this._effectiveWeight;
    };
    AnimationAction.prototype.fadeIn = function (duration) {
        return this._scheduleFading(duration, 0, 1);
    };
    AnimationAction.prototype.fadeOut = function (duration) {
        return this._scheduleFading(duration, 1, 0);
    };
    AnimationAction.prototype.crossFadeFrom = function (fadeOutAction, duration, warp) {
        fadeOutAction.fadeOut(duration);
        this.fadeIn(duration);
        if (warp) {
            var fadeInDuration = this._clip.duration, fadeOutDuration = fadeOutAction._clip.duration, startEndRatio = fadeOutDuration / fadeInDuration, endStartRatio = fadeInDuration / fadeOutDuration;
            fadeOutAction.warp(1.0, startEndRatio, duration);
            this.warp(endStartRatio, 1.0, duration);
        }
        return this;
    };
    AnimationAction.prototype.crossFadeTo = function (fadeInAction, duration, warp) {
        return fadeInAction.crossFadeFrom(this, duration, warp);
    };
    AnimationAction.prototype.stopFading = function () {
        var weightInterpolant = this._weightInterpolant;
        if (weightInterpolant !== null) {
            this._weightInterpolant = null;
            this._mixer._takeBackControlInterpolant(weightInterpolant);
        }
        return this;
    };
    // Time Scale Control
    // set the time scale stopping any scheduled warping
    // although .paused = true yields an effective time scale of zero, this
    // method does *not* change .paused, because it would be confusing
    AnimationAction.prototype.setEffectiveTimeScale = function (timeScale) {
        this.timeScale = timeScale;
        this._effectiveTimeScale = this.paused ? 0 : timeScale;
        return this.stopWarping();
    };
    // return the time scale considering warping and .paused
    AnimationAction.prototype.getEffectiveTimeScale = function () {
        return this._effectiveTimeScale;
    };
    AnimationAction.prototype.setDuration = function (duration) {
        this.timeScale = this._clip.duration / duration;
        return this.stopWarping();
    };
    AnimationAction.prototype.syncWith = function (action) {
        this.time = action.time;
        this.timeScale = action.timeScale;
        return this.stopWarping();
    };
    AnimationAction.prototype.halt = function (duration) {
        return this.warp(this._effectiveTimeScale, 0, duration);
    };
    AnimationAction.prototype.warp = function (startTimeScale, endTimeScale, duration) {
        var mixer = this._mixer, now = mixer.time, interpolant = this._timeScaleInterpolant, timeScale = this.timeScale;
        if (interpolant === null) {
            interpolant = mixer._lendControlInterpolant();
            this._timeScaleInterpolant = interpolant;
        }
        var times = interpolant.parameterPositions, values = interpolant.sampleValues;
        times[0] = now;
        times[1] = now + duration;
        values[0] = startTimeScale / timeScale;
        values[1] = endTimeScale / timeScale;
        return this;
    };
    AnimationAction.prototype.stopWarping = function () {
        var timeScaleInterpolant = this._timeScaleInterpolant;
        if (timeScaleInterpolant !== null) {
            this._timeScaleInterpolant = null;
            this._mixer._takeBackControlInterpolant(timeScaleInterpolant);
        }
        return this;
    };
    // Object Accessors
    AnimationAction.prototype.getMixer = function () {
        return this._mixer;
    };
    AnimationAction.prototype.getClip = function () {
        return this._clip;
    };
    AnimationAction.prototype.getRoot = function () {
        return this._localRoot || this._mixer._root;
    };
    // Interna
    AnimationAction.prototype._update = function (time, deltaTime, timeDirection, accuIndex) {
        // called by the mixer
        if (!this.enabled) {
            // call ._updateWeight() to update ._effectiveWeight
            this._updateWeight(time);
            return;
        }
        var startTime = this._startTime;
        if (startTime !== null) {
            // check for scheduled start of action
            var timeRunning = (time - startTime) * timeDirection;
            if (timeRunning < 0 || timeDirection === 0) {
                return; // yet to come / don't decide when delta = 0
            }
            // start
            this._startTime = null; // unschedule
            deltaTime = timeDirection * timeRunning;
        }
        // apply time scale and advance time
        deltaTime *= this._updateTimeScale(time);
        var clipTime = this._updateTime(deltaTime);
        // note: _updateTime may disable the action resulting in
        // an effective weight of 0
        var weight = this._updateWeight(time);
        if (weight > 0) {
            var interpolants = this._interpolants;
            var propertyMixers = this._propertyBindings;
            for (var j = 0, m = interpolants.length; j !== m; ++j) {
                interpolants[j].evaluate(clipTime);
                propertyMixers[j].accumulate(accuIndex, weight);
            }
        }
    };
    AnimationAction.prototype._updateWeight = function (time) {
        var weight = 0;
        if (this.enabled) {
            weight = this.weight;
            var interpolant = this._weightInterpolant;
            if (interpolant !== null) {
                var interpolantValue = interpolant.evaluate(time)[0];
                weight *= interpolantValue;
                if (time > interpolant.parameterPositions[1]) {
                    this.stopFading();
                    if (interpolantValue === 0) {
                        // faded out, disable
                        this.enabled = false;
                    }
                }
            }
        }
        this._effectiveWeight = weight;
        return weight;
    };
    AnimationAction.prototype._updateTimeScale = function (time) {
        var timeScale = 0;
        if (!this.paused) {
            timeScale = this.timeScale;
            var interpolant = this._timeScaleInterpolant;
            if (interpolant !== null) {
                var interpolantValue = interpolant.evaluate(time)[0];
                timeScale *= interpolantValue;
                if (time > interpolant.parameterPositions[1]) {
                    this.stopWarping();
                    if (timeScale === 0) {
                        // motion has halted, pause
                        this.paused = true;
                    }
                    else {
                        // warp done - apply final time scale
                        this.timeScale = timeScale;
                    }
                }
            }
        }
        this._effectiveTimeScale = timeScale;
        return timeScale;
    };
    AnimationAction.prototype._updateTime = function (deltaTime) {
        var time = this.time + deltaTime;
        if (deltaTime === 0)
            return time;
        var duration = this._clip.duration, loop = this.loop, loopCount = this._loopCount;
        if (loop === LoopOnce) {
            if (loopCount === -1) {
                // just started
                this._loopCount = 0;
                this._setEndings(true, true, false);
            }
            handle_stop: {
                if (time >= duration) {
                    time = duration;
                }
                else if (time < 0) {
                    time = 0;
                }
                else
                    break handle_stop;
                if (this.clampWhenFinished)
                    this.paused = true;
                else
                    this.enabled = false;
                this._mixer.dispatchEvent({
                    type: 'finished', action: this,
                    direction: deltaTime < 0 ? -1 : 1
                });
            }
        }
        else {
            var pingPong = (loop === LoopPingPong);
            if (loopCount === -1) {
                // just started
                if (deltaTime >= 0) {
                    loopCount = 0;
                    this._setEndings(true, this.repetitions === 0, pingPong);
                }
                else {
                    // when looping in reverse direction, the initial
                    // transition through zero counts as a repetition,
                    // so leave loopCount at -1
                    this._setEndings(this.repetitions === 0, true, pingPong);
                }
            }
            if (time >= duration || time < 0) {
                // wrap around
                var loopDelta = Math.floor(time / duration); // signed
                time -= duration * loopDelta;
                loopCount += Math.abs(loopDelta);
                var pending = this.repetitions - loopCount;
                if (pending < 0) {
                    // have to stop (switch state, clamp time, fire event)
                    if (this.clampWhenFinished)
                        this.paused = true;
                    else
                        this.enabled = false;
                    time = deltaTime > 0 ? duration : 0;
                    this._mixer.dispatchEvent({
                        type: 'finished', action: this,
                        direction: deltaTime > 0 ? 1 : -1
                    });
                }
                else {
                    // keep running
                    if (pending === 0) {
                        // entering the last round
                        var atStart = deltaTime < 0;
                        this._setEndings(atStart, !atStart, pingPong);
                    }
                    else {
                        this._setEndings(false, false, pingPong);
                    }
                    this._loopCount = loopCount;
                    this._mixer.dispatchEvent({
                        type: 'loop', action: this, loopDelta: loopDelta
                    });
                }
            }
            if (pingPong && (loopCount & 1) === 1) {
                // invert time for the "pong round"
                this.time = time;
                return duration - time;
            }
        }
        this.time = time;
        return time;
    };
    AnimationAction.prototype._setEndings = function (atStart, atEnd, pingPong) {
        var settings = this._interpolantSettings;
        if (pingPong) {
            settings.endingStart = ZeroSlopeEnding;
            settings.endingEnd = ZeroSlopeEnding;
        }
        else {
            // assuming for LoopOnce atStart == atEnd == true
            if (atStart) {
                settings.endingStart = this.zeroSlopeAtStart ? ZeroSlopeEnding : ZeroCurvatureEnding;
            }
            else {
                settings.endingStart = WrapAroundEnding;
            }
            if (atEnd) {
                settings.endingEnd = this.zeroSlopeAtEnd ? ZeroSlopeEnding : ZeroCurvatureEnding;
            }
            else {
                settings.endingEnd = WrapAroundEnding;
            }
        }
    };
    AnimationAction.prototype._scheduleFading = function (duration, weightNow, weightThen) {
        var mixer = this._mixer, now = mixer.time, interpolant = this._weightInterpolant;
        if (interpolant === null) {
            interpolant = mixer._lendControlInterpolant();
            this._weightInterpolant = interpolant;
        }
        var times = interpolant.parameterPositions, values = interpolant.sampleValues;
        times[0] = now;
        values[0] = weightNow;
        times[1] = now + duration;
        values[1] = weightThen;
        return this;
    };
    return AnimationAction;
}());
export { AnimationAction };
(function (AnimationAction) {
    var InterpolantSettings = /** @class */ (function () {
        function InterpolantSettings() {
        }
        return InterpolantSettings;
    }());
    AnimationAction.InterpolantSettings = InterpolantSettings;
})(AnimationAction || (AnimationAction = {}));

/**
 * @author mrdoob / http://mrdoob.com/
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */
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
import { Object3D } from '../core/Object3D';
var Audio = /** @class */ (function (_super) {
    __extends(Audio, _super);
    function Audio(listener) {
        var _this = _super.call(this) || this;
        _this.type = 'Audio';
        _this.autoplay = false;
        _this.buffer = null;
        _this.loop = false;
        _this.startTime = 0;
        _this.offset = 0;
        _this.playbackRate = 1;
        _this.isPlaying = false;
        _this.hasPlaybackControl = true;
        _this.sourceType = 'empty';
        _this.filters = [];
        _this.context = listener.context;
        _this.gain = _this.context.createGain();
        _this.gain.connect(listener.getInput());
        return _this;
    }
    Audio.prototype.getOutput = function () {
        return this.gain;
    };
    Audio.prototype.setNodeSource = function (audioNode) {
        this.hasPlaybackControl = false;
        this.sourceType = 'audioNode';
        this.source = audioNode;
        this.connect();
        return this;
    };
    Audio.prototype.setBuffer = function (audioBuffer) {
        this.buffer = audioBuffer;
        this.sourceType = 'buffer';
        if (this.autoplay)
            this.play();
        return this;
    };
    Audio.prototype.play = function () {
        if (this.isPlaying === true) {
            console.warn('THREE.Audio: Audio is already playing.');
            return;
        }
        if (this.hasPlaybackControl === false) {
            console.warn('THREE.Audio: this Audio has no playback control.');
            return;
        }
        var source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.loop = this.loop;
        source.onended = this.onEnded.bind(this);
        source.playbackRate.setValueAtTime(this.playbackRate, this.startTime);
        this.startTime = this.context.currentTime;
        source.start(this.startTime, this.offset);
        this.isPlaying = true;
        this.source = source;
        return this.connect();
    };
    Audio.prototype.pause = function () {
        if (this.hasPlaybackControl === false) {
            console.warn('THREE.Audio: this Audio has no playback control.');
            return;
        }
        if (this.isPlaying === true) {
            this.source.stop();
            this.offset += (this.context.currentTime - this.startTime) * this.playbackRate;
            this.isPlaying = false;
        }
        return this;
    };
    Audio.prototype.stop = function () {
        if (this.hasPlaybackControl === false) {
            console.warn('THREE.Audio: this Audio has no playback control.');
            return;
        }
        this.source.stop();
        this.offset = 0;
        this.isPlaying = false;
        return this;
    };
    Audio.prototype.connect = function () {
        if (this.filters.length > 0) {
            this.source.connect(this.filters[0]);
            for (var i = 1, l = this.filters.length; i < l; i++) {
                this.filters[i - 1].connect(this.filters[i]);
            }
            this.filters[this.filters.length - 1].connect(this.getOutput());
        }
        else {
            this.source.connect(this.getOutput());
        }
        return this;
    };
    Audio.prototype.disconnect = function () {
        if (this.filters.length > 0) {
            this.source.disconnect(this.filters[0]);
            for (var i = 1, l = this.filters.length; i < l; i++) {
                this.filters[i - 1].disconnect(this.filters[i]);
            }
            this.filters[this.filters.length - 1].disconnect(this.getOutput());
        }
        else {
            this.source.disconnect(this.getOutput());
        }
        return this;
    };
    Audio.prototype.getFilters = function () {
        return this.filters;
    };
    Audio.prototype.setFilters = function (value) {
        if (!value)
            value = [];
        if (this.isPlaying === true) {
            this.disconnect();
            this.filters = value;
            this.connect();
        }
        else {
            this.filters = value;
        }
        return this;
    };
    Audio.prototype.getFilter = function () {
        return this.getFilters()[0];
    };
    Audio.prototype.setFilter = function (filter) {
        return this.setFilters(filter ? [filter] : []);
    };
    Audio.prototype.setPlaybackRate = function (value) {
        if (this.hasPlaybackControl === false) {
            console.warn('THREE.Audio: this Audio has no playback control.');
            return;
        }
        this.playbackRate = value;
        if (this.isPlaying === true) {
            this.source.playbackRate.setValueAtTime(this.playbackRate, this.context.currentTime);
        }
        return this;
    };
    Audio.prototype.getPlaybackRate = function () {
        return this.playbackRate;
    };
    Audio.prototype.onEnded = function () {
        this.isPlaying = false;
    };
    Audio.prototype.getLoop = function () {
        if (this.hasPlaybackControl === false) {
            console.warn('THREE.Audio: this Audio has no playback control.');
            return false;
        }
        return this.loop;
    };
    Audio.prototype.setLoop = function (value) {
        if (this.hasPlaybackControl === false) {
            console.warn('THREE.Audio: this Audio has no playback control.');
            return;
        }
        this.loop = value;
        if (this.isPlaying === true) {
            this.source.loop = this.loop;
        }
        return this;
    };
    Audio.prototype.getVolume = function () {
        return this.gain.gain.value;
    };
    Audio.prototype.setVolume = function (value) {
        this.gain.gain.value = value;
        return this;
    };
    return Audio;
}(Object3D));
export { Audio };

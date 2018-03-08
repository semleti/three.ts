/**
 * @author mrdoob / http://mrdoob.com/
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
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Object3D } from '../core/Object3D';
import { AudioContext } from './AudioContext';
var AudioListener = /** @class */ (function (_super) {
    __extends(AudioListener, _super);
    function AudioListener() {
        var _this = _super.call(this) || this;
        _this.type = 'AudioListener';
        _this.filter = null;
        _this.context = AudioContext.getContext();
        _this.gain = _this.context.createGain();
        _this.gain.connect(_this.context.destination);
        return _this;
    }
    AudioListener.prototype.getInput = function () {
        return this.gain;
    };
    AudioListener.prototype.removeFilter = function () {
        if (this.filter !== null) {
            this.gain.disconnect(this.filter);
            this.filter.disconnect(this.context.destination);
            this.gain.connect(this.context.destination);
            this.filter = null;
        }
    };
    AudioListener.prototype.getFilter = function () {
        return this.filter;
    };
    AudioListener.prototype.setFilter = function (value) {
        if (this.filter !== null) {
            this.gain.disconnect(this.filter);
            this.filter.disconnect(this.context.destination);
        }
        else {
            this.gain.disconnect(this.context.destination);
        }
        this.filter = value;
        this.gain.connect(this.filter);
        this.filter.connect(this.context.destination);
    };
    AudioListener.prototype.getMasterVolume = function () {
        return this.gain.gain.value;
    };
    AudioListener.prototype.setMasterVolume = function (value) {
        this.gain.gain.value = value;
    };
    AudioListener.prototype.updateMatrixWorld = function (force) {
        var position = new Vector3();
        var quaternion = new Quaternion();
        var scale = new Vector3();
        var orientation = new Vector3();
        Object3D.prototype.updateMatrixWorld.call(this, force);
        var listener = this.context.listener;
        var up = this.up;
        this.matrixWorld.decompose(position, quaternion, scale);
        orientation.set(0, 0, -1).applyQuaternion(quaternion);
        if (listener.positionX) {
            listener.positionX.setValueAtTime(position.x, this.context.currentTime);
            listener.positionY.setValueAtTime(position.y, this.context.currentTime);
            listener.positionZ.setValueAtTime(position.z, this.context.currentTime);
            listener.forwardX.setValueAtTime(orientation.x, this.context.currentTime);
            listener.forwardY.setValueAtTime(orientation.y, this.context.currentTime);
            listener.forwardZ.setValueAtTime(orientation.z, this.context.currentTime);
            listener.upX.setValueAtTime(up.x, this.context.currentTime);
            listener.upY.setValueAtTime(up.y, this.context.currentTime);
            listener.upZ.setValueAtTime(up.z, this.context.currentTime);
        }
        else {
            listener.setPosition(position.x, position.y, position.z);
            listener.setOrientation(orientation.x, orientation.y, orientation.z, up.x, up.y, up.z);
        }
    };
    return AudioListener;
}(Object3D));
export { AudioListener };

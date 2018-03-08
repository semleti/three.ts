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
import { Audio } from './Audio';
var PositionalAudio = /** @class */ (function (_super) {
    __extends(PositionalAudio, _super);
    function PositionalAudio(listener) {
        var _this = _super.call(this, listener) || this;
        _this.panner = _this.context.createPanner();
        _this.panner.connect(_this.gain);
        return _this;
    }
    PositionalAudio.prototype.getOutput = function () {
        return this.panner;
    };
    PositionalAudio.prototype.getRefDistance = function () {
        return this.panner.refDistance;
    };
    PositionalAudio.prototype.setRefDistance = function (value) {
        this.panner.refDistance = value;
    };
    PositionalAudio.prototype.getRolloffFactor = function () {
        return this.panner.rolloffFactor;
    };
    PositionalAudio.prototype.setRolloffFactor = function (value) {
        this.panner.rolloffFactor = value;
    };
    PositionalAudio.prototype.getDistanceModel = function () {
        return this.panner.distanceModel;
    };
    PositionalAudio.prototype.setDistanceModel = function (value) {
        this.panner.distanceModel = value;
    };
    PositionalAudio.prototype.getMaxDistance = function () {
        return this.panner.maxDistance;
    };
    PositionalAudio.prototype.setMaxDistance = function (value) {
        this.panner.maxDistance = value;
    };
    PositionalAudio.prototype.updateMatrixWorld = function (force) {
        var position = new Vector3();
        _super.prototype.updateMatrixWorld.call(this, force);
        position.setFromMatrixPosition(this.matrixWorld);
        this.panner.setPosition(position.x, position.y, position.z);
    };
    return PositionalAudio;
}(Audio));
export { PositionalAudio };

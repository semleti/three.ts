/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author WestLangley / http://github.com/WestLangley
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
import { Matrix4 } from '../math/Matrix4';
import { Quaternion } from '../math/Quaternion';
import { Object3D } from '../core/Object3D';
import { Vector3 } from '../math/Vector3';
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super.call(this) || this;
        _this.matrixWorldInverse = new Matrix4();
        _this.projectionMatrix = new Matrix4();
        _this.type = 'Camera';
        _this.isCamera = true;
        return _this;
    }
    Camera.prototype.copy = function (source, recursive) {
        _super.prototype.copy.call(this, source, recursive);
        this.matrixWorldInverse.copy(source.matrixWorldInverse);
        this.projectionMatrix.copy(source.projectionMatrix);
        return this;
    };
    Camera.prototype.getWorldDirection = function (optionalTarget) {
        var quaternion = new Quaternion();
        var result = optionalTarget || new Vector3();
        this.getWorldQuaternion(quaternion);
        return result.set(0, 0, -1).applyQuaternion(quaternion);
    };
    Camera.prototype.updateMatrixWorld = function (force) {
        _super.prototype.updateMatrixWorld.call(this, force);
        this.matrixWorldInverse.getInverse(this.matrixWorld);
    };
    Camera.prototype.clone = function () {
        return new Camera().copy(this);
    };
    return Camera;
}(Object3D));
export { Camera };
(function (Camera) {
    var Obj = /** @class */ (function (_super) {
        __extends(Obj, _super);
        function Obj() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Obj;
    }(Object3D.Obj));
    Camera.Obj = Obj;
})(Camera || (Camera = {}));

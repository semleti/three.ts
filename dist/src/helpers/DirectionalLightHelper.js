/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
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
import { Vector3 } from '../math/Vector3';
import { Object3D } from '../core/Object3D';
import { Line } from '../objects/Line';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
var DirectionalLightHelper = /** @class */ (function (_super) {
    __extends(DirectionalLightHelper, _super);
    function DirectionalLightHelper(light, size, color) {
        if (size === void 0) { size = 1; }
        var _this = _super.call(this) || this;
        _this.size = size;
        _this.light = light;
        _this.light.updateMatrixWorld();
        _this.matrix = light.matrixWorld;
        _this.matrixAutoUpdate = false;
        _this.color = color;
        var geometry = new BufferGeometry();
        geometry.addAttribute('position', new Float32BufferAttribute([
            -size, size, 0,
            size, size, 0,
            size, -size, 0,
            -size, -size, 0,
            -size, size, 0
        ], 3));
        var material = new LineBasicMaterial({ fog: false });
        _this.lightPlane = new Line(geometry, material);
        _this.add(_this.lightPlane);
        geometry = new BufferGeometry();
        geometry.addAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 0, 1], 3));
        _this.targetLine = new Line(geometry, material);
        _this.add(_this.targetLine);
        _this.update();
        return _this;
    }
    DirectionalLightHelper.prototype.clone = function () {
        return new DirectionalLightHelper(this.light, this.size, this.color).copy(this);
    };
    DirectionalLightHelper.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    DirectionalLightHelper.prototype.dispose = function () {
        this.lightPlane.geometry.dispose();
        this.lightPlane.material.dispose();
        this.targetLine.geometry.dispose();
        this.targetLine.material.dispose();
    };
    DirectionalLightHelper.prototype.update = function () {
        var v1 = new Vector3();
        var v2 = new Vector3();
        var v3 = new Vector3();
        v1.setFromMatrixPosition(this.light.matrixWorld);
        v2.setFromMatrixPosition(this.light.target.matrixWorld);
        v3.subVectors(v2, v1);
        this.lightPlane.lookAt(v3);
        if (this.color !== undefined) {
            this.lightPlane.material.color.set(this.color);
            this.targetLine.material.color.set(this.color);
        }
        else {
            this.lightPlane.material.color.copy(this.light.color);
            this.targetLine.material.color.copy(this.light.color);
        }
        this.targetLine.lookAt(v3);
        this.targetLine.scale.z = v3.length();
    };
    return DirectionalLightHelper;
}(Object3D));
export { DirectionalLightHelper };

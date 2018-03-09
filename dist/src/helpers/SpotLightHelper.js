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
import { LineSegments } from '../objects/LineSegments';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
var SpotLightHelper = /** @class */ (function (_super) {
    __extends(SpotLightHelper, _super);
    function SpotLightHelper(light, color) {
        var _this = _super.call(this) || this;
        _this.light = light;
        _this.light.updateMatrixWorld();
        _this.matrix = light.matrixWorld;
        _this.matrixAutoUpdate = false;
        _this.color = color;
        var geometry = new BufferGeometry();
        var positions = [
            0, 0, 0, 0, 0, 1,
            0, 0, 0, 1, 0, 1,
            0, 0, 0, -1, 0, 1,
            0, 0, 0, 0, 1, 1,
            0, 0, 0, 0, -1, 1
        ];
        for (var i = 0, j = 1, l = 32; i < l; i++, j++) {
            var p1 = (i / l) * Math.PI * 2;
            var p2 = (j / l) * Math.PI * 2;
            positions.push(Math.cos(p1), Math.sin(p1), 1, Math.cos(p2), Math.sin(p2), 1);
        }
        geometry.addAttribute('position', new Float32BufferAttribute(positions, 3));
        var material = new LineBasicMaterial({ fog: false });
        _this.cone = new LineSegments(geometry, material);
        _this.add(_this.cone);
        _this.update();
        return _this;
    }
    SpotLightHelper.prototype.clone = function () {
        return new SpotLightHelper(this.light, this.color).copy(this);
    };
    SpotLightHelper.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    SpotLightHelper.prototype.dispose = function () {
        this.cone.geometry.dispose();
        this.cone.material.dispose();
    };
    SpotLightHelper.prototype.update = function () {
        var vector = new Vector3();
        var vector2 = new Vector3();
        this.light.updateMatrixWorld();
        var coneLength = this.light.distance ? this.light.distance : 1000;
        var coneWidth = coneLength * Math.tan(this.light.angle);
        this.cone.scale.set(coneWidth, coneWidth, coneLength);
        vector.setFromMatrixPosition(this.light.matrixWorld);
        vector2.setFromMatrixPosition(this.light.target.matrixWorld);
        this.cone.lookAt(vector2.sub(vector));
        if (this.color !== undefined) {
            this.cone.material.color.set(this.color);
        }
        else {
            this.cone.material.color.copy(this.light.color);
        }
    };
    return SpotLightHelper;
}(Object3D));
export { SpotLightHelper };

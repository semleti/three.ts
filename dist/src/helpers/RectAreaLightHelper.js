/**
 * @author abelnation / http://github.com/abelnation
 * @author Mugen87 / http://github.com/Mugen87
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
import { Object3D } from '../core/Object3D';
import { Line } from '../objects/Line';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';
var RectAreaLightHelper = /** @class */ (function (_super) {
    __extends(RectAreaLightHelper, _super);
    function RectAreaLightHelper(light, color) {
        var _this = _super.call(this) || this;
        _this.light = light;
        _this.light.updateMatrixWorld();
        _this.matrix = light.matrixWorld;
        _this.matrixAutoUpdate = false;
        _this.color = color;
        var material = new LineBasicMaterial({ fog: false });
        var geometry = new BufferGeometry();
        geometry.addAttribute('position', new BufferAttribute(new Float32Array(5 * 3), 3));
        _this.line = new Line(geometry, material);
        _this.add(_this.line);
        _this.update();
        return _this;
    }
    RectAreaLightHelper.prototype.clone = function () {
        return new RectAreaLightHelper(this.light, this.color).copy(this);
    };
    RectAreaLightHelper.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    RectAreaLightHelper.prototype.dispose = function () {
        this.children[0].geometry.dispose();
        this.children[0].material.dispose();
    };
    RectAreaLightHelper.prototype.update = function () {
        // calculate new dimensions of the helper
        var hx = this.light.width * 0.5;
        var hy = this.light.height * 0.5;
        var position = this.line.geometry.attributes.position;
        var array = position.array;
        // update vertices
        array[0] = hx;
        array[1] = -hy;
        array[2] = 0;
        array[3] = hx;
        array[4] = hy;
        array[5] = 0;
        array[6] = -hx;
        array[7] = hy;
        array[8] = 0;
        array[9] = -hx;
        array[10] = -hy;
        array[11] = 0;
        array[12] = hx;
        array[13] = -hy;
        array[14] = 0;
        position.needsUpdate = true;
        if (this.color !== undefined) {
            this.line.material.color.set(this.color);
        }
        else {
            this.line.material.color.copy(this.light.color);
        }
    };
    return RectAreaLightHelper;
}(Object3D));
export { RectAreaLightHelper };

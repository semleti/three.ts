/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
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
import { Color } from '../math/Color';
import { Object3D } from '../core/Object3D';
import { Mesh } from '../objects/Mesh';
import { VertexColors } from '../constants';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { OctahedronBufferGeometry } from '../geometries/OctahedronGeometry';
import { BufferAttribute } from '../core/BufferAttribute';
var HemisphereLightHelper = /** @class */ (function (_super) {
    __extends(HemisphereLightHelper, _super);
    function HemisphereLightHelper(light, size, color) {
        var _this = _super.call(this) || this;
        _this.size = size;
        _this.light = light;
        _this.light.updateMatrixWorld();
        _this.matrix = light.matrixWorld;
        _this.matrixAutoUpdate = false;
        _this.color = color;
        var geometry = new OctahedronBufferGeometry(size);
        geometry.rotateY(Math.PI * 0.5);
        _this.material = new MeshBasicMaterial({ wireframe: true, fog: false });
        if (_this.color === undefined)
            _this.material.vertexColors = VertexColors;
        var position = geometry.getAttribute('position');
        var colors = new Float32Array(position.count * 3);
        geometry.addAttribute('color', new BufferAttribute(colors, 3));
        _this.add(new Mesh(geometry, _this.material));
        _this.update();
        return _this;
    }
    HemisphereLightHelper.prototype.clone = function () {
        return new HemisphereLightHelper(this.light, this.size, this.color).copy(this);
    };
    HemisphereLightHelper.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    HemisphereLightHelper.prototype.dispose = function () {
        this.children[0].geometry.dispose();
        this.children[0].material.dispose();
    };
    HemisphereLightHelper.prototype.update = function () {
        var vector = new Vector3();
        var color1 = new Color();
        var color2 = new Color();
        var mesh = this.children[0];
        if (this.color !== undefined) {
            this.material.color.set(this.color);
        }
        else {
            var colors = mesh.geometry.getAttribute('color');
            color1.copy(this.light.color);
            color2.copy(this.light.groundColor);
            for (var i = 0, l = colors.count; i < l; i++) {
                var color = (i < (l / 2)) ? color1 : color2;
                colors.setXYZ(i, color.r, color.g, color.b);
            }
            colors.needsUpdate = true;
        }
        mesh.lookAt(vector.setFromMatrixPosition(this.light.matrixWorld).negate());
    };
    return HemisphereLightHelper;
}(Object3D));
export { HemisphereLightHelper };

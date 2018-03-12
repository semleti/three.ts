import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
var Face3 = /** @class */ (function () {
    function Face3(a, b, c, normal, color, materialIndex) {
        if (materialIndex === void 0) { materialIndex = 0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.normal = (normal && normal.isVector3) ? normal : new Vector3();
        this.vertexNormals = Array.isArray(normal) ? normal : [];
        this.color = (color && color.isColor) ? color : new Color();
        this.vertexColors = Array.isArray(color) ? color : [];
        this.materialIndex = materialIndex;
    }
    Face3.prototype.clone = function () {
        return new Face3().copy(this);
    };
    Face3.prototype.copy = function (source) {
        this.a = source.a;
        this.b = source.b;
        this.c = source.c;
        this.normal.copy(source.normal);
        this.color.copy(source.color);
        this.materialIndex = source.materialIndex;
        for (var i = 0, il = source.vertexNormals.length; i < il; i++) {
            this.vertexNormals[i] = source.vertexNormals[i].clone();
        }
        for (var i = 0, il = source.vertexColors.length; i < il; i++) {
            this.vertexColors[i] = source.vertexColors[i].clone();
        }
        return this;
    };
    return Face3;
}());
export { Face3 };

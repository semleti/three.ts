import { Color } from '../math/Color';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
var Fog = /** @class */ (function () {
    function Fog(color, near, far) {
        if (near === void 0) { near = 1; }
        if (far === void 0) { far = 1000; }
        this.name = '';
        this.isFog = true;
        this.color = new Color(color);
        this.near = near;
        this.far = far;
    }
    Fog.prototype.clone = function () {
        return new Fog(this.color.getHex(), this.near, this.far);
    };
    ;
    Fog.prototype.toJSON = function () {
        return {
            type: 'Fog',
            color: this.color.getHex(),
            near: this.near,
            far: this.far
        };
    };
    return Fog;
}());
export { Fog };

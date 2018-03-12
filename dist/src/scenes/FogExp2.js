import { Color } from '../math/Color';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
var FogExp2 = /** @class */ (function () {
    function FogExp2(color, density) {
        if (density === void 0) { density = 0.00025; }
        this.name = '';
        this.isFogExp2 = true;
        this.color = new Color(color);
        this.density = density;
    }
    FogExp2.prototype.clone = function () {
        return new FogExp2(this.color.getHex(), this.density);
    };
    FogExp2.prototype.toJSON = function () {
        return {
            type: 'FogExp2',
            color: this.color.getHex(),
            density: this.density
        };
    };
    return FogExp2;
}());
export { FogExp2 };

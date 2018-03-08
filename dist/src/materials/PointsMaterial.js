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
import { Material } from './Material';
import { Color } from '../math/Color';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  size: <float>,
 *  sizeAttenuation: <bool>
 * }
 */
var PointsMaterial = /** @class */ (function (_super) {
    __extends(PointsMaterial, _super);
    function PointsMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'PointsMaterial';
        _this.isPointsMaterial = true;
        _this.color = new Color(0xffffff);
        _this.map = null;
        _this.size = 1;
        _this.sizeAttenuation = true;
        _this.lights = false;
        _this.setValues(parameters);
        return _this;
    }
    PointsMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.size = source.size;
        this.sizeAttenuation = source.sizeAttenuation;
        return this;
    };
    return PointsMaterial;
}(Material));
export { PointsMaterial };

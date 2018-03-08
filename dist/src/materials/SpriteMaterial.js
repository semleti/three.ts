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
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *	uvOffset: new THREE.Vector2(),
 *	uvScale: new THREE.Vector2()
 * }
 */
var SpriteMaterial = /** @class */ (function (_super) {
    __extends(SpriteMaterial, _super);
    function SpriteMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'SpriteMaterial';
        _this.isSpriteMaterial = true;
        _this.color = new Color(0xffffff);
        _this.map = null;
        _this.rotation = 0;
        _this.fog = false;
        _this.lights = false;
        _this.setValues(parameters);
        return _this;
    }
    SpriteMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.rotation = source.rotation;
        return this;
    };
    return SpriteMaterial;
}(Material));
export { SpriteMaterial };

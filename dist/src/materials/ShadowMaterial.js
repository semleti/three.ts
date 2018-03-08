/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  color: <THREE.Color>,
 *  opacity: <float>
 * }
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
import { Material } from './Material';
import { Color } from '../math/Color';
var ShadowMaterial = /** @class */ (function (_super) {
    __extends(ShadowMaterial, _super);
    function ShadowMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'ShadowMaterial';
        _this.isShadowMaterial = true;
        _this.color = new Color(0x000000);
        _this.opacity = 1.0;
        _this.lights = true;
        _this.transparent = true;
        _this.setValues(parameters);
        return _this;
    }
    return ShadowMaterial;
}(Material));
export { ShadowMaterial };

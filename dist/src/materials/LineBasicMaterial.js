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
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round"
 * }
 */
var LineBasicMaterial = /** @class */ (function (_super) {
    __extends(LineBasicMaterial, _super);
    function LineBasicMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'LineBasicMaterial';
        _this.color = new Color(0xffffff);
        _this.linewidth = 1;
        _this.linecap = 'round';
        _this.linejoin = 'round';
        _this.lights = false;
        _this.isLineBasicMaterial = true;
        _this.setValues(parameters);
        return _this;
    }
    LineBasicMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.linewidth = source.linewidth;
        this.linecap = source.linecap;
        this.linejoin = source.linejoin;
        return this;
    };
    return LineBasicMaterial;
}(Material));
export { LineBasicMaterial };

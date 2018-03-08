/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *
 *  scale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>
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
import { LineBasicMaterial } from './LineBasicMaterial';
var LineDashedMaterial = /** @class */ (function (_super) {
    __extends(LineDashedMaterial, _super);
    function LineDashedMaterial(parameters) {
        var _this = _super.call(this, parameters) || this;
        _this.type = 'LineDashedMaterial';
        _this.isLineDashedMaterial = true;
        _this.scale = 1;
        _this.dashSize = 3;
        _this.gapSize = 1;
        _this.setValues(parameters);
        return _this;
    }
    LineDashedMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.scale = source.scale;
        this.dashSize = source.dashSize;
        this.gapSize = source.gapSize;
        return this;
    };
    return LineDashedMaterial;
}(LineBasicMaterial));
export { LineDashedMaterial };

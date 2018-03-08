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
import { ShaderMaterial } from './ShaderMaterial';
/**
 * @author mrdoob / http://mrdoob.com/
 */
var RawShaderMaterial = /** @class */ (function (_super) {
    __extends(RawShaderMaterial, _super);
    function RawShaderMaterial(parameters) {
        var _this = _super.call(this, parameters) || this;
        _this.type = 'RawShaderMaterial';
        _this.isRawShaderMaterial = true;
        return _this;
    }
    return RawShaderMaterial;
}(ShaderMaterial));
export { RawShaderMaterial };

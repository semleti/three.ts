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
import { MeshStandardMaterial } from './MeshStandardMaterial';
/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  reflectivity: <float>
 * }
 */
var MeshPhysicalMaterial = /** @class */ (function (_super) {
    __extends(MeshPhysicalMaterial, _super);
    function MeshPhysicalMaterial(parameters) {
        var _this = _super.call(this, parameters) || this;
        _this.isMeshPhysicalMaterial = true;
        _this.defines = { 'PHYSICAL': '' };
        _this.type = 'MeshPhysicalMaterial';
        _this.reflectivity = 0.5; // maps to F0 = 0.04
        _this.clearCoat = 0.0;
        _this.clearCoatRoughness = 0.0;
        _this.setValues(parameters);
        return _this;
    }
    MeshPhysicalMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.defines = { 'PHYSICAL': '' };
        this.reflectivity = source.reflectivity;
        this.clearCoat = source.clearCoat;
        this.clearCoatRoughness = source.clearCoatRoughness;
        return this;
    };
    return MeshPhysicalMaterial;
}(MeshStandardMaterial));
export { MeshPhysicalMaterial };

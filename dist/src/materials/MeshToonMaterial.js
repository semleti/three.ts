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
import { MeshPhongMaterial } from './MeshPhongMaterial';
/**
 * @author takahirox / http://github.com/takahirox
 *
 * parameters = {
 *  gradientMap: new THREE.Texture( <Image> )
 * }
 */
var MeshToonMaterial = /** @class */ (function (_super) {
    __extends(MeshToonMaterial, _super);
    function MeshToonMaterial(parameters) {
        var _this = _super.call(this, parameters) || this;
        _this.isMeshToonMaterial = true;
        _this.defines = { 'TOON': '' };
        _this.type = 'MeshToonMaterial';
        _this.gradientMap = null;
        _this.setValues(parameters);
        return _this;
    }
    MeshToonMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.gradientMap = source.gradientMap;
        return this;
    };
    return MeshToonMaterial;
}(MeshPhongMaterial));
export { MeshToonMaterial };

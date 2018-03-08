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
import { Vector2 } from '../math/Vector2';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  bumpMap: new THREE.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new THREE.Texture( <Image> ),
 *  normalScale: <Vector2>,
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */
var MeshNormalMaterial = /** @class */ (function (_super) {
    __extends(MeshNormalMaterial, _super);
    function MeshNormalMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'MeshNormalMaterial';
        _this.isMeshNormalMaterial = true;
        _this.bumpMap = null;
        _this.bumpScale = 1;
        _this.normalMap = null;
        _this.normalScale = new Vector2(1, 1);
        _this.displacementMap = null;
        _this.displacementScale = 1;
        _this.displacementBias = 0;
        _this.wireframe = false;
        _this.wireframeLinewidth = 1;
        _this.fog = false;
        _this.lights = false;
        _this.skinning = false;
        _this.morphTargets = false;
        _this.morphNormals = false;
        _this.setValues(parameters);
        return _this;
    }
    MeshNormalMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.bumpMap = source.bumpMap;
        this.bumpScale = source.bumpScale;
        this.normalMap = source.normalMap;
        this.normalScale.copy(source.normalScale);
        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;
        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.morphNormals = source.morphNormals;
        return this;
    };
    return MeshNormalMaterial;
}(Material));
export { MeshNormalMaterial };

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
import { BasicDepthPacking } from '../constants';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / https://clara.io
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */
var MeshDepthMaterial = /** @class */ (function (_super) {
    __extends(MeshDepthMaterial, _super);
    function MeshDepthMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'MeshDepthMaterial';
        _this.isMeshDepthMaterial = true;
        _this.depthPacking = BasicDepthPacking;
        _this.skinning = false;
        _this.morphTargets = false;
        _this.map = null;
        _this.alphaMap = null;
        _this.displacementMap = null;
        _this.displacementScale = 1;
        _this.displacementBias = 0;
        _this.wireframe = false;
        _this.wireframeLinewidth = 1;
        _this.fog = false;
        _this.lights = false;
        _this.setValues(parameters);
        return _this;
    }
    MeshDepthMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.depthPacking = source.depthPacking;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.map = source.map;
        this.alphaMap = source.alphaMap;
        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;
        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        return this;
    };
    return MeshDepthMaterial;
}(Material));
export { MeshDepthMaterial };

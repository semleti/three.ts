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
import { Vector3 } from '../math/Vector3';
/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *
 *  referencePosition: <float>,
 *  nearDistance: <float>,
 *  farDistance: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>
 *
 * }
 */
var MeshDistanceMaterial = /** @class */ (function (_super) {
    __extends(MeshDistanceMaterial, _super);
    function MeshDistanceMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'MeshDistanceMaterial';
        _this.isMeshDistanceMaterial = true;
        _this.referencePosition = new Vector3();
        _this.nearDistance = 1;
        _this.farDistance = 1000;
        _this.skinning = false;
        _this.morphTargets = false;
        _this.map = null;
        _this.alphaMap = null;
        _this.displacementMap = null;
        _this.displacementScale = 1;
        _this.displacementBias = 0;
        _this.fog = false;
        _this.lights = false;
        _this.setValues(parameters);
        return _this;
    }
    MeshDistanceMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.referencePosition.copy(source.referencePosition);
        this.nearDistance = source.nearDistance;
        this.farDistance = source.farDistance;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.map = source.map;
        this.alphaMap = source.alphaMap;
        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;
        return this;
    };
    return MeshDistanceMaterial;
}(Material));
export { MeshDistanceMaterial };

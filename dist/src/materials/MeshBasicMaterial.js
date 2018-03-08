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
import { MultiplyOperation } from '../constants';
import { Color } from '../math/Color';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>
 * }
 */
var MeshBasicMaterial = /** @class */ (function (_super) {
    __extends(MeshBasicMaterial, _super);
    function MeshBasicMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'MeshBasicMaterial';
        _this.color = new Color(0xffffff); // emissive
        _this.map = null;
        _this.lightMap = null;
        _this.lightMapIntensity = 1.0;
        _this.aoMap = null;
        _this.aoMapIntensity = 1.0;
        _this.specularMap = null;
        _this.alphaMap = null;
        _this.envMap = null;
        _this.combine = MultiplyOperation;
        _this.reflectivity = 1;
        _this.refractionRatio = 0.98;
        _this.wireframe = false;
        _this.wireframeLinewidth = 1;
        _this.wireframeLinecap = 'round';
        _this.wireframeLinejoin = 'round';
        _this.skinning = false;
        _this.morphTargets = false;
        _this.lights = false;
        _this.isMeshBasicMaterial = true;
        _this.setValues(parameters);
        return _this;
    }
    MeshBasicMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.lightMap = source.lightMap;
        this.lightMapIntensity = source.lightMapIntensity;
        this.aoMap = source.aoMap;
        this.aoMapIntensity = source.aoMapIntensity;
        this.specularMap = source.specularMap;
        this.alphaMap = source.alphaMap;
        this.envMap = source.envMap;
        this.combine = source.combine;
        this.reflectivity = source.reflectivity;
        this.refractionRatio = source.refractionRatio;
        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        this.wireframeLinecap = source.wireframeLinecap;
        this.wireframeLinejoin = source.wireframeLinejoin;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        return this;
    };
    return MeshBasicMaterial;
}(Material));
export { MeshBasicMaterial };

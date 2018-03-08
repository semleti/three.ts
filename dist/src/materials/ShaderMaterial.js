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
import { UniformsUtils } from '../renderers/shaders/UniformsUtils';
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  defines: { "label" : "value" },
 *  uniforms: { "parameter1": { value: 1.0 }, "parameter2": { value2: 2 } },
 *
 *  fragmentShader: <string>,
 *  vertexShader: <string>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  lights: <bool>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */
var ShaderMaterial = /** @class */ (function (_super) {
    __extends(ShaderMaterial, _super);
    function ShaderMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'ShaderMaterial';
        _this.isShaderMaterial = true;
        _this.defines = {};
        _this.uniforms = {};
        _this.vertexShader = 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';
        _this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';
        _this.linewidth = 1;
        _this.wireframe = false;
        _this.wireframeLinewidth = 1;
        _this.fog = false; // set to use scene fog
        _this.lights = false; // set to use scene lights
        _this.clipping = false; // set to use user-defined clipping planes
        _this.skinning = false; // set to use skinning attribute streams
        _this.morphTargets = false; // set to use morph targets
        _this.morphNormals = false; // set to use morph normals
        _this.extensions = {
            derivatives: false,
            fragDepth: false,
            drawBuffers: false,
            shaderTextureLOD: false // set to use shader texture LOD
        };
        // When rendered geometry doesn't include these attributes but the material does,
        // use these default values in WebGL. This avoids errors when buffer data is missing.
        _this.defaultAttributeValues = {
            'color': [1, 1, 1],
            'uv': [0, 0],
            'uv2': [0, 0]
        };
        _this.index0AttributeName = undefined;
        _this.uniformsNeedUpdate = false;
        if (parameters !== undefined) {
            if (parameters.attributes !== undefined) {
                console.error('THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead.');
            }
            _this.setValues(parameters);
        }
        return _this;
    }
    ShaderMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.fragmentShader = source.fragmentShader;
        this.vertexShader = source.vertexShader;
        this.uniforms = UniformsUtils.clone(source.uniforms);
        this.defines = source.defines;
        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        this.lights = source.lights;
        this.clipping = source.clipping;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.morphNormals = source.morphNormals;
        this.extensions = source.extensions;
        return this;
    };
    ShaderMaterial.prototype.toJSON = function (meta) {
        var data = _super.prototype.toJSON.call(this, meta);
        data.uniforms = this.uniforms;
        data.vertexShader = this.vertexShader;
        data.fragmentShader = this.fragmentShader;
        return data;
    };
    return ShaderMaterial;
}(Material));
export { ShaderMaterial };
(function (ShaderMaterial) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Material.Data));
    ShaderMaterial.Data = Data;
})(ShaderMaterial || (ShaderMaterial = {}));

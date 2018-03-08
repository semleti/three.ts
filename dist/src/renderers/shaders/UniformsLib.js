import { Color } from '../../math/Color';
import { Vector2 } from '../../math/Vector2';
import { Matrix3 } from '../../math/Matrix3';
/**
 * Uniforms library for shared webgl shaders
 */
var UniformsLib = /** @class */ (function () {
    function UniformsLib() {
    }
    UniformsLib.common = {
        diffuse: { value: new Color(0xeeeeee) },
        opacity: { value: 1.0 },
        map: { value: null },
        uvTransform: { value: new Matrix3() },
        alphaMap: { value: null },
    };
    UniformsLib.specularmap = {
        specularMap: { value: null },
    };
    UniformsLib.envmap = {
        envMap: { value: null },
        flipEnvMap: { value: -1 },
        reflectivity: { value: 1.0 },
        refractionRatio: { value: 0.98 }
    };
    UniformsLib.aomap = {
        aoMap: { value: null },
        aoMapIntensity: { value: 1 }
    };
    UniformsLib.lightmap = {
        lightMap: { value: null },
        lightMapIntensity: { value: 1 }
    };
    UniformsLib.emissivemap = {
        emissiveMap: { value: null }
    };
    UniformsLib.bumpmap = {
        bumpMap: { value: null },
        bumpScale: { value: 1 }
    };
    UniformsLib.normalmap = {
        normalMap: { value: null },
        normalScale: { value: new Vector2(1, 1) }
    };
    UniformsLib.displacementmap = {
        displacementMap: { value: null },
        displacementScale: { value: 1 },
        displacementBias: { value: 0 }
    };
    UniformsLib.roughnessmap = {
        roughnessMap: { value: null }
    };
    UniformsLib.metalnessmap = {
        metalnessMap: { value: null }
    };
    UniformsLib.gradientmap = {
        gradientMap: { value: null }
    };
    UniformsLib.fog = {
        fogDensity: { value: 0.00025 },
        fogNear: { value: 1 },
        fogFar: { value: 2000 },
        fogColor: { value: new Color(0xffffff) }
    };
    UniformsLib.lights = {
        ambientLightColor: { value: [] },
        directionalLights: { value: [], properties: {
                direction: {},
                color: {},
                shadow: {},
                shadowBias: {},
                shadowRadius: {},
                shadowMapSize: {}
            } },
        directionalShadowMap: { value: [] },
        directionalShadowMatrix: { value: [] },
        spotLights: { value: [], properties: {
                color: {},
                position: {},
                direction: {},
                distance: {},
                coneCos: {},
                penumbraCos: {},
                decay: {},
                shadow: {},
                shadowBias: {},
                shadowRadius: {},
                shadowMapSize: {}
            } },
        spotShadowMap: { value: [] },
        spotShadowMatrix: { value: [] },
        pointLights: { value: [], properties: {
                color: {},
                position: {},
                decay: {},
                distance: {},
                shadow: {},
                shadowBias: {},
                shadowRadius: {},
                shadowMapSize: {},
                shadowCameraNear: {},
                shadowCameraFar: {}
            } },
        pointShadowMap: { value: [] },
        pointShadowMatrix: { value: [] },
        hemisphereLights: { value: [], properties: {
                direction: {},
                skyColor: {},
                groundColor: {}
            } },
        // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
        rectAreaLights: { value: [], properties: {
                color: {},
                position: {},
                width: {},
                height: {}
            } }
    };
    UniformsLib.points = {
        diffuse: { value: new Color(0xeeeeee) },
        opacity: { value: 1.0 },
        size: { value: 1.0 },
        scale: { value: 1.0 },
        map: { value: null },
        uvTransform: { value: new Matrix3() }
    };
    return UniformsLib;
}());
export { UniformsLib };

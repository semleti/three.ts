import { Color } from '../../math/Color';
import { Vector2 } from '../../math/Vector2';
import { Matrix3 } from '../../math/Matrix3';

/**
 * Uniforms library for shared webgl shaders
 */

export abstract class UniformsLib{

	static common = {

		diffuse: { value: new Color( 0xeeeeee ) },
		opacity: { value: 1.0 },

		map: { value: null },
		uvTransform: { value: new Matrix3() },

		alphaMap: { value: null },

	};

	static specularmap = {

		specularMap: { value: null },

	};

	static envmap = {

		envMap: { value: null },
		flipEnvMap: { value: - 1 },
		reflectivity: { value: 1.0 },
		refractionRatio: { value: 0.98 }

	};

	static aomap = {

		aoMap: { value: null },
		aoMapIntensity: { value: 1 }

	};

	static lightmap = {

		lightMap: { value: null },
		lightMapIntensity: { value: 1 }

	};

	static emissivemap = {

		emissiveMap: { value: null }

	};

	static bumpmap = {

		bumpMap: { value: null },
		bumpScale: { value: 1 }

	};

	static normalmap = {

		normalMap: { value: null },
		normalScale: { value: new Vector2( 1, 1 ) }

	};

	static displacementmap = {

		displacementMap: { value: null },
		displacementScale: { value: 1 },
		displacementBias: { value: 0 }

	};

	static roughnessmap = {

		roughnessMap: { value: null }

	};

	static metalnessmap = {

		metalnessMap: { value: null }

	};

	static gradientmap = {

		gradientMap: { value: null }

	};

	static fog = {

		fogDensity: { value: 0.00025 },
		fogNear: { value: 1 },
		fogFar: { value: 2000 },
		fogColor: { value: new Color( 0xffffff ) }

	};

	static lights = {

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

	static points = {

		diffuse: { value: new Color( 0xeeeeee ) },
		opacity: { value: 1.0 },
		size: { value: 1.0 },
		scale: { value: 1.0 },
		map: { value: null },
		uvTransform: { value: new Matrix3() }

	};

}
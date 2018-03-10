/**
 * @author mrdoob / http://mrdoob.com/
 */

import { WebGLUniforms } from './WebGLUniforms';
import { WebGLShader } from './WebGLShader';
import { ShaderChunk } from '../shaders/ShaderChunk';
import { NoToneMapping, AddOperation, MixOperation, MultiplyOperation, EquirectangularRefractionMapping, CubeRefractionMapping, SphericalReflectionMapping, EquirectangularReflectionMapping, CubeUVRefractionMapping, CubeUVReflectionMapping, CubeReflectionMapping, PCFSoftShadowMap, PCFShadowMap, CineonToneMapping, Uncharted2ToneMapping, ReinhardToneMapping, LinearToneMapping, GammaEncoding, RGBDEncoding, RGBM16Encoding, RGBM7Encoding, RGBEEncoding, sRGBEncoding, LinearEncoding } from '../../constants';
import { WebGLRenderer } from '../../Three';

function getEncodingComponents( encoding : number ) : Array<string> {

	switch ( encoding ) {

		case LinearEncoding:
			return [ 'Linear', '( value )' ];
		case sRGBEncoding:
			return [ 'sRGB', '( value )' ];
		case RGBEEncoding:
			return [ 'RGBE', '( value )' ];
		case RGBM7Encoding:
			return [ 'RGBM', '( value, 7.0 )' ];
		case RGBM16Encoding:
			return [ 'RGBM', '( value, 16.0 )' ];
		case RGBDEncoding:
			return [ 'RGBD', '( value, 256.0 )' ];
		case GammaEncoding:
			return [ 'Gamma', '( value, float( GAMMA_FACTOR ) )' ];
		default:
			throw new Error( 'unsupported encoding: ' + encoding );

	}

}

function getTexelDecodingFunction( functionName : string, encoding : number ) : string {

	let components = getEncodingComponents( encoding );
	return 'vec4 ' + functionName + '( vec4 value ) { return ' + components[ 0 ] + 'ToLinear' + components[ 1 ] + '; }';

}

function getTexelEncodingFunction( functionName : string, encoding : number ) : string {

	let components = getEncodingComponents( encoding );
	return 'vec4 ' + functionName + '( vec4 value ) { return LinearTo' + components[ 0 ] + components[ 1 ] + '; }';

}

function getToneMappingFunction( functionName : string, toneMapping : number ) : string {

	let toneMappingName;

	switch ( toneMapping ) {

		case LinearToneMapping:
			toneMappingName = 'Linear';
			break;

		case ReinhardToneMapping:
			toneMappingName = 'Reinhard';
			break;

		case Uncharted2ToneMapping:
			toneMappingName = 'Uncharted2';
			break;

		case CineonToneMapping:
			toneMappingName = 'OptimizedCineon';
			break;

		default:
			throw new Error( 'unsupported toneMapping: ' + toneMapping );

	}

	return 'vec3 ' + functionName + '( vec3 color ) { return ' + toneMappingName + 'ToneMapping( color ); }';

}

function generateExtensions( extensions : any, parameters : any, rendererExtensions : any ) : any {

	extensions = extensions || {};

	let chunks = [
		( extensions.derivatives || parameters.envMapCubeUV || parameters.bumpMap || parameters.normalMap || parameters.flatShading ) ? '#extension GL_OES_standard_derivatives : enable' : '',
		( extensions.fragDepth || parameters.logarithmicDepthBuffer ) && rendererExtensions.get( 'EXT_frag_depth' ) ? '#extension GL_EXT_frag_depth : enable' : '',
		( extensions.drawBuffers ) && rendererExtensions.get( 'WEBGL_draw_buffers' ) ? '#extension GL_EXT_draw_buffers : require' : '',
		( extensions.shaderTextureLOD || parameters.envMap ) && rendererExtensions.get( 'EXT_shader_texture_lod' ) ? '#extension GL_EXT_shader_texture_lod : enable' : ''
	];

	return chunks.filter( filterEmptyLine ).join( '\n' );

}

function generateDefines( defines : Array<any> ) : string {

	let chunks = [];

	for ( let name in defines ) {

		let value = defines[ name ];

		if ( value === false ) continue;

		chunks.push( '#define ' + name + ' ' + value );

	}

	return chunks.join( '\n' );

}

function fetchAttributeLocations( gl : any, program : WebGLProgram ) {

	let attributes = {};

	let n = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );

	for ( let i = 0; i < n; i ++ ) {

		let info = gl.getActiveAttrib( program, i );
		let name = info.name;

		// console.log( 'THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:', name, i );

		attributes[ name ] = gl.getAttribLocation( program, name );

	}

	return attributes;

}

function filterEmptyLine( string : string ) : boolean {

	return string !== '';

}

function replaceLightNums( string : string, parameters : any ) : string {

	return string
		.replace( /NUM_DIR_LIGHTS/g, parameters.numDirLights )
		.replace( /NUM_SPOT_LIGHTS/g, parameters.numSpotLights )
		.replace( /NUM_RECT_AREA_LIGHTS/g, parameters.numRectAreaLights )
		.replace( /NUM_POINT_LIGHTS/g, parameters.numPointLights )
		.replace( /NUM_HEMI_LIGHTS/g, parameters.numHemiLights );

}

function replaceClippingPlaneNums( string : string, parameters : any ) : string {

	return string
		.replace( /NUM_CLIPPING_PLANES/g, parameters.numClippingPlanes )
		.replace( /UNION_CLIPPING_PLANES/g, ( parameters.numClippingPlanes - parameters.numClipIntersection ) + '' );

}

function parseIncludes( string : string ) : string {

	let pattern = /^[ \t]*#include +<([\w\d.]+)>/gm;

	function replace( match, include ) {

		let replace = ShaderChunk[ include ];

		if ( replace === undefined ) {

			throw new Error( 'Can not resolve #include <' + include + '>' );

		}

		return parseIncludes( replace );

	}

	return string.replace( pattern, replace );

}

function unrollLoops( string : string ) : string {

	let pattern = /#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;

	function replace( match, start, end, snippet ) {

		let unroll = '';

		for ( let i = parseInt( start ); i < parseInt( end ); i ++ ) {

			unroll += snippet.replace( /\[ i \]/g, '[ ' + i + ' ]' );

		}

		return unroll;

	}

	return string.replace( pattern, replace );

}

export class WebGLProgram {

	static programIdCount : number = 0;
	diagnostics;
	gl;program;renderer;
	id;usedTimes;vertexShader;fragmentShader;
	constructor( renderer : WebGLRenderer, extensions : any, code : any, material : any, shader : any, parameters : any ){

		this.gl = renderer.context;
		this.renderer = renderer;
	
		let defines = material.defines;
		let vertexShader = shader.vertexShader;
		let fragmentShader = shader.fragmentShader;
	
		let shadowMapTypeDefine = 'SHADOWMAP_TYPE_BASIC';
	
		if ( parameters.shadowMapType === PCFShadowMap ) {
	
			shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF';
	
		} else if ( parameters.shadowMapType === PCFSoftShadowMap ) {
	
			shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF_SOFT';
	
		}
	
		let envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
		let envMapModeDefine = 'ENVMAP_MODE_REFLECTION';
		let envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';
	
		if ( parameters.envMap ) {
	
			switch ( material.envMap.mapping ) {
	
				case CubeReflectionMapping:
				case CubeRefractionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
					break;
	
				case CubeUVReflectionMapping:
				case CubeUVRefractionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_CUBE_UV';
					break;
	
				case EquirectangularReflectionMapping:
				case EquirectangularRefractionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_EQUIREC';
					break;
	
				case SphericalReflectionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_SPHERE';
					break;
	
			}
	
			switch ( material.envMap.mapping ) {
	
				case CubeRefractionMapping:
				case EquirectangularRefractionMapping:
					envMapModeDefine = 'ENVMAP_MODE_REFRACTION';
					break;
	
			}
	
			switch ( material.combine ) {
	
				case MultiplyOperation:
					envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';
					break;
	
				case MixOperation:
					envMapBlendingDefine = 'ENVMAP_BLENDING_MIX';
					break;
	
				case AddOperation:
					envMapBlendingDefine = 'ENVMAP_BLENDING_ADD';
					break;
	
			}
	
		}
	
		let gammaFactorDefine = ( renderer.gammaFactor > 0 ) ? renderer.gammaFactor : 1.0;
	
		// console.log( 'building new this.program ' );
	
		//
	
		let customExtensions = generateExtensions( material.extensions, parameters, extensions );
	
		let customDefines = generateDefines( defines );
	
		//
	
		this.program = this.gl.createProgram();
	
		let prefixVertex, prefixFragment;
	
		if ( material.isRawShaderMaterial ) {
	
			prefixVertex = [
	
				customDefines
	
			].filter( filterEmptyLine ).join( '\n' );
	
			if ( prefixVertex.length > 0 ) {
	
				prefixVertex += '\n';
	
			}
	
			prefixFragment = [
	
				customExtensions,
				customDefines
	
			].filter( filterEmptyLine ).join( '\n' );
	
			if ( prefixFragment.length > 0 ) {
	
				prefixFragment += '\n';
	
			}
	
		} else {
	
			prefixVertex = [
	
				'precision ' + parameters.precision + ' float;',
				'precision ' + parameters.precision + ' int;',
	
				'#define SHADER_NAME ' + shader.name,
	
				customDefines,
	
				parameters.supportsVertexTextures ? '#define VERTEX_TEXTURES' : '',
	
				'#define GAMMA_FACTOR ' + gammaFactorDefine,
	
				'#define MAX_BONES ' + parameters.maxBones,
				( parameters.useFog && parameters.fog ) ? '#define USE_FOG' : '',
				( parameters.useFog && parameters.fogExp ) ? '#define FOG_EXP2' : '',
	
				parameters.map ? '#define USE_MAP' : '',
				parameters.envMap ? '#define USE_ENVMAP' : '',
				parameters.envMap ? '#define ' + envMapModeDefine : '',
				parameters.lightMap ? '#define USE_LIGHTMAP' : '',
				parameters.aoMap ? '#define USE_AOMAP' : '',
				parameters.emissiveMap ? '#define USE_EMISSIVEMAP' : '',
				parameters.bumpMap ? '#define USE_BUMPMAP' : '',
				parameters.normalMap ? '#define USE_NORMALMAP' : '',
				parameters.displacementMap && parameters.supportsVertexTextures ? '#define USE_DISPLACEMENTMAP' : '',
				parameters.specularMap ? '#define USE_SPECULARMAP' : '',
				parameters.roughnessMap ? '#define USE_ROUGHNESSMAP' : '',
				parameters.metalnessMap ? '#define USE_METALNESSMAP' : '',
				parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
				parameters.vertexColors ? '#define USE_COLOR' : '',
	
				parameters.flatShading ? '#define FLAT_SHADED' : '',
	
				parameters.skinning ? '#define USE_SKINNING' : '',
				parameters.useVertexTexture ? '#define BONE_TEXTURE' : '',
	
				parameters.morphTargets ? '#define USE_MORPHTARGETS' : '',
				parameters.morphNormals && parameters.flatShading === false ? '#define USE_MORPHNORMALS' : '',
				parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
				parameters.flipSided ? '#define FLIP_SIDED' : '',
	
				parameters.shadowMapEnabled ? '#define USE_SHADOWMAP' : '',
				parameters.shadowMapEnabled ? '#define ' + shadowMapTypeDefine : '',
	
				parameters.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '',
	
				parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
				parameters.logarithmicDepthBuffer && extensions.get( 'EXT_frag_depth' ) ? '#define USE_LOGDEPTHBUF_EXT' : '',
	
				'uniform mat4 modelMatrix;',
				'uniform mat4 modelViewMatrix;',
				'uniform mat4 projectionMatrix;',
				'uniform mat4 viewMatrix;',
				'uniform mat3 normalMatrix;',
				'uniform vec3 cameraPosition;',
	
				'attribute vec3 position;',
				'attribute vec3 normal;',
				'attribute vec2 uv;',
	
				'#ifdef USE_COLOR',
	
				'	attribute vec3 color;',
	
				'#endif',
	
				'#ifdef USE_MORPHTARGETS',
	
				'	attribute vec3 morphTarget0;',
				'	attribute vec3 morphTarget1;',
				'	attribute vec3 morphTarget2;',
				'	attribute vec3 morphTarget3;',
	
				'	#ifdef USE_MORPHNORMALS',
	
				'		attribute vec3 morphNormal0;',
				'		attribute vec3 morphNormal1;',
				'		attribute vec3 morphNormal2;',
				'		attribute vec3 morphNormal3;',
	
				'	#else',
	
				'		attribute vec3 morphTarget4;',
				'		attribute vec3 morphTarget5;',
				'		attribute vec3 morphTarget6;',
				'		attribute vec3 morphTarget7;',
	
				'	#endif',
	
				'#endif',
	
				'#ifdef USE_SKINNING',
	
				'	attribute vec4 skinIndex;',
				'	attribute vec4 skinWeight;',
	
				'#endif',
	
				'\n'
	
			].filter( filterEmptyLine ).join( '\n' );
	
			prefixFragment = [
	
				customExtensions,
	
				'precision ' + parameters.precision + ' float;',
				'precision ' + parameters.precision + ' int;',
	
				'#define SHADER_NAME ' + shader.name,
	
				customDefines,
	
				parameters.alphaTest ? '#define ALPHATEST ' + parameters.alphaTest : '',
	
				'#define GAMMA_FACTOR ' + gammaFactorDefine,
	
				( parameters.useFog && parameters.fog ) ? '#define USE_FOG' : '',
				( parameters.useFog && parameters.fogExp ) ? '#define FOG_EXP2' : '',
	
				parameters.map ? '#define USE_MAP' : '',
				parameters.envMap ? '#define USE_ENVMAP' : '',
				parameters.envMap ? '#define ' + envMapTypeDefine : '',
				parameters.envMap ? '#define ' + envMapModeDefine : '',
				parameters.envMap ? '#define ' + envMapBlendingDefine : '',
				parameters.lightMap ? '#define USE_LIGHTMAP' : '',
				parameters.aoMap ? '#define USE_AOMAP' : '',
				parameters.emissiveMap ? '#define USE_EMISSIVEMAP' : '',
				parameters.bumpMap ? '#define USE_BUMPMAP' : '',
				parameters.normalMap ? '#define USE_NORMALMAP' : '',
				parameters.specularMap ? '#define USE_SPECULARMAP' : '',
				parameters.roughnessMap ? '#define USE_ROUGHNESSMAP' : '',
				parameters.metalnessMap ? '#define USE_METALNESSMAP' : '',
				parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
				parameters.vertexColors ? '#define USE_COLOR' : '',
	
				parameters.gradientMap ? '#define USE_GRADIENTMAP' : '',
	
				parameters.flatShading ? '#define FLAT_SHADED' : '',
	
				parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
				parameters.flipSided ? '#define FLIP_SIDED' : '',
	
				parameters.shadowMapEnabled ? '#define USE_SHADOWMAP' : '',
				parameters.shadowMapEnabled ? '#define ' + shadowMapTypeDefine : '',
	
				parameters.premultipliedAlpha ? '#define PREMULTIPLIED_ALPHA' : '',
	
				parameters.physicallyCorrectLights ? '#define PHYSICALLY_CORRECT_LIGHTS' : '',
	
				parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
				parameters.logarithmicDepthBuffer && extensions.get( 'EXT_frag_depth' ) ? '#define USE_LOGDEPTHBUF_EXT' : '',
	
				parameters.envMap && extensions.get( 'EXT_shader_texture_lod' ) ? '#define TEXTURE_LOD_EXT' : '',
	
				'uniform mat4 viewMatrix;',
				'uniform vec3 cameraPosition;',
	
				( parameters.toneMapping !== NoToneMapping ) ? '#define TONE_MAPPING' : '',
				( parameters.toneMapping !== NoToneMapping ) ? ShaderChunk[ 'tonemapping_pars_fragment' ] : '', // this code is required here because it is used by the toneMapping() function defined below
				( parameters.toneMapping !== NoToneMapping ) ? getToneMappingFunction( 'toneMapping', parameters.toneMapping ) : '',
	
				parameters.dithering ? '#define DITHERING' : '',
	
				( parameters.outputEncoding || parameters.mapEncoding || parameters.envMapEncoding || parameters.emissiveMapEncoding ) ? ShaderChunk[ 'encodings_pars_fragment' ] : '', // this code is required here because it is used by the various encoding/decoding function defined below
				parameters.mapEncoding ? getTexelDecodingFunction( 'mapTexelToLinear', parameters.mapEncoding ) : '',
				parameters.envMapEncoding ? getTexelDecodingFunction( 'envMapTexelToLinear', parameters.envMapEncoding ) : '',
				parameters.emissiveMapEncoding ? getTexelDecodingFunction( 'emissiveMapTexelToLinear', parameters.emissiveMapEncoding ) : '',
				parameters.outputEncoding ? getTexelEncodingFunction( 'linearToOutputTexel', parameters.outputEncoding ) : '',
	
				parameters.depthPacking ? '#define DEPTH_PACKING ' + material.depthPacking : '',
	
				'\n'
	
			].filter( filterEmptyLine ).join( '\n' );
	
		}
	
		vertexShader = parseIncludes( vertexShader );
		vertexShader = replaceLightNums( vertexShader, parameters );
		vertexShader = replaceClippingPlaneNums( vertexShader, parameters );
	
		fragmentShader = parseIncludes( fragmentShader );
		fragmentShader = replaceLightNums( fragmentShader, parameters );
		fragmentShader = replaceClippingPlaneNums( fragmentShader, parameters );
	
		vertexShader = unrollLoops( vertexShader );
		fragmentShader = unrollLoops( fragmentShader );
	
		let vertexGlsl = prefixVertex + vertexShader;
		let fragmentGlsl = prefixFragment + fragmentShader;
	
		// console.log( '*VERTEX*', vertexGlsl );
		// console.log( '*FRAGMENT*', fragmentGlsl );
	
		let glVertexShader = WebGLShader( this.gl, this.gl.VERTEX_SHADER, vertexGlsl );
		let glFragmentShader = WebGLShader( this.gl, this.gl.FRAGMENT_SHADER, fragmentGlsl );
	
		this.gl.attachShader( this.program, glVertexShader );
		this.gl.attachShader( this.program, glFragmentShader );
	
		// Force a particular attribute to index 0.
	
		if ( material.index0AttributeName !== undefined ) {
	
			this.gl.bindAttribLocation( this.program, 0, material.index0AttributeName );
	
		} else if ( parameters.morphTargets === true ) {
	
			// this.programs with morphTargets displace position out of attribute 0
			this.gl.bindAttribLocation( this.program, 0, 'position' );
	
		}
	
		this.gl.linkProgram( this.program );
	
		let programLog = this.gl.getProgramInfoLog( this.program ).trim();
		let vertexLog = this.gl.getShaderInfoLog( glVertexShader ).trim();
		let fragmentLog = this.gl.getShaderInfoLog( glFragmentShader ).trim();
	
		let runnable = true;
		let haveDiagnostics = true;
	
		// console.log( '**VERTEX**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( glVertexShader ) );
		// console.log( '**FRAGMENT**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( glFragmentShader ) );
	
		if ( this.gl.getProgramParameter( this.program, this.gl.LINK_STATUS ) === false ) {
	
			runnable = false;
	
			console.error( 'THREE.WebGLProgram: shader error: ', this.gl.getError(), 'gl.VALIDATE_STATUS', this.gl.getProgramParameter( this.program, this.gl.VALIDATE_STATUS ), 'gl.getProgramInfoLog', programLog, vertexLog, fragmentLog );
	
		} else if ( programLog !== '' ) {
	
			console.warn( 'THREE.WebGLProgram: gl.getProgramInfoLog()', programLog );
	
		} else if ( vertexLog === '' || fragmentLog === '' ) {
	
			haveDiagnostics = false;
	
		}
	
		if ( haveDiagnostics ) {
	
			this.diagnostics = {
	
				runnable: runnable,
				material: material,
	
				programLog: programLog,
	
				vertexShader: {
	
					log: vertexLog,
					prefix: prefixVertex
	
				},
	
				fragmentShader: {
	
					log: fragmentLog,
					prefix: prefixFragment
	
				}
	
			};
	
		}
	
		// clean up
	
		this.gl.deleteShader( glVertexShader );
		this.gl.deleteShader( glFragmentShader );

		this.id = WebGLProgram.programIdCount ++;
		this.usedTimes = 1;
		this.vertexShader = glVertexShader;
		this.fragmentShader = glFragmentShader;
	}


	// set up caching for uniform locations

	cachedUniforms;

	getUniforms () : WebGLUniforms {

		if ( this.cachedUniforms === undefined ) {

			this.cachedUniforms = new WebGLUniforms( this.gl, this.program, this.renderer );

		}

		return this.cachedUniforms;

	}

	// set up caching for attribute locations

	cachedAttributes;

	getAttributes () : any {

		if ( this.cachedAttributes === undefined ) {

			this.cachedAttributes = fetchAttributeLocations( this.gl, this.program );

		}

		return this.cachedAttributes;

	}

	// free resource

	destroy () : void {

		this.gl.deleteProgram( this.program );
		this.program = undefined;

	}

	// DEPRECATED

	get uniforms () : WebGLUniforms {
		console.warn( 'THREE.WebGLProgram: .uniforms is now .getUniforms().' );
		return this.getUniforms();
	}
	get attributes () : Array<any> {
		console.warn( 'THREE.WebGLProgram: .attributes is now .getAttributes().' );
		return this.getAttributes();
	}



}


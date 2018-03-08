/**
 * @author mrdoob / http://mrdoob.com/
 */

export class WebGLCapabilities {

	gl : any;
	extensions : any;
	parameters : any;
	constructor( gl : any, extensions : any, parameters : any ){
		this.gl = gl;
		this.extensions = extensions;
		this.parameters = parameters;

		if ( this.maxPrecision !== this.precision ) {

			console.warn( 'THREE.WebGLRenderer:', this.precision, 'not supported, using', this.maxPrecision, 'instead.' );
			this.precision = this.maxPrecision;
	
		}
		this.precision = this.parameters.precision !== undefined ? this.parameters.precision : 'highp';
		this.maxPrecision = this.getMaxPrecision( this.precision );

		this.logarithmicDepthBuffer = this.parameters.logarithmicDepthBuffer === true;

		this.maxTextures = this.gl.getParameter( this.gl.MAX_TEXTURE_IMAGE_UNITS );
		this.maxVertexTextures = this.gl.getParameter( this.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
		this.maxTextureSize = this.gl.getParameter( this.gl.MAX_TEXTURE_SIZE );
		this.maxCubemapSize = this.gl.getParameter( this.gl.MAX_CUBE_MAP_TEXTURE_SIZE );

		this.maxAttributes = this.gl.getParameter( this.gl.MAX_VERTEX_ATTRIBS );
		this.maxVertexUniforms = this.gl.getParameter( this.gl.MAX_VERTEX_UNIFORM_VECTORS );
		this.maxVaryings = this.gl.getParameter( this.gl.MAX_VARYING_VECTORS );
		this.maxFragmentUniforms = this.gl.getParameter( this.gl.MAX_FRAGMENT_UNIFORM_VECTORS );

		this.vertexTextures = this.maxVertexTextures > 0;
		this.floatFragmentTextures = !! this.extensions.get( 'OES_texture_float' );
		this.floatVertexTextures = this.vertexTextures && this.floatFragmentTextures;
	}

	maxAnisotropy : number;

	getMaxAnisotropy() : number {

		if ( this.maxAnisotropy !== undefined ) return this.maxAnisotropy;

		let extension = this.extensions.get( 'EXT_texture_filter_anisotropic' );

		if ( extension !== null ) {

			this.maxAnisotropy = this.gl.getParameter( extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT );

		} else {

			this.maxAnisotropy = 0;

		}

		return this.maxAnisotropy;

	}

	getMaxPrecision( precision : string ) : string {

		if ( precision === 'highp' ) {

			if ( this.gl.getShaderPrecisionFormat( this.gl.VERTEX_SHADER, this.gl.HIGH_FLOAT ).precision > 0 &&
			     this.gl.getShaderPrecisionFormat( this.gl.FRAGMENT_SHADER, this.gl.HIGH_FLOAT ).precision > 0 ) {

				return 'highp';

			}

			precision = 'mediump';

		}

		if ( precision === 'mediump' ) {

			if ( this.gl.getShaderPrecisionFormat( this.gl.VERTEX_SHADER, this.gl.MEDIUM_FLOAT ).precision > 0 &&
			     this.gl.getShaderPrecisionFormat( this.gl.FRAGMENT_SHADER, this.gl.MEDIUM_FLOAT ).precision > 0 ) {

				return 'mediump';

			}

		}

		return 'lowp';

	}

	precision : string;
	maxPrecision : string;

	logarithmicDepthBuffer : boolean;

	maxTextures : number;
	maxVertexTextures : number;
	maxTextureSize : number;
	maxCubemapSize : number;

	maxAttributes : number;
	maxVertexUniforms : number;
	maxVaryings : number;
	maxFragmentUniforms : number;

	vertexTextures : boolean;
	floatFragmentTextures : boolean;
	floatVertexTextures : boolean;

}

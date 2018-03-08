/**
 * @author mrdoob / http://mrdoob.com/
 */

import { NotEqualDepth, GreaterDepth, GreaterEqualDepth, EqualDepth, LessEqualDepth, LessDepth, AlwaysDepth, NeverDepth, CullFaceFront, CullFaceBack, CullFaceNone, CustomBlending, MultiplyBlending, SubtractiveBlending, AdditiveBlending, NoBlending, NormalBlending, DoubleSide, BackSide } from '../../constants';
import { Vector4 } from '../../math/Vector4';
import { Material } from '../../materials/Material';

export class WebGLState {

	gl;extensions;utils;
	newAttributes;enabledAttributes;attributeDivisors;capabilities;compressedTextureFormats;
	currentProgram;currentBlending;currentBlendEquation;currentBlendSrc;currentBlendDst;currentBlendEquationAlpha;
	currentBlendSrcAlpha;currentBlendDstAlpha;currentPremultipledAlpha;
	depthBuffer;colorBuffer;stencilBuffer;
	currentFlipSided;currentCullFace;
	currentLineWidth;lineWidthAvailable;
	currentPolygonOffsetFactor;currentPolygonOffsetUnits;
	currentTextureSlot;maxTextures;
	currentBoundTextures;emptyTextures;
	currentScissor;currentViewport;
	buffers : any;
	constructor( gl : any, extensions : any, utils : any ){
		this.gl = gl;
		this.extensions = extensions;
		this.utils = utils;
		this.colorBuffer = new WebGLState.ColorBuffer(gl);
		this.depthBuffer = new WebGLState.DepthBuffer(gl);
		this.stencilBuffer = new WebGLState.StencilBuffer(gl);
	
		let maxVertexAttributes = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );
		this.newAttributes = new Uint8Array( maxVertexAttributes );
		this.enabledAttributes = new Uint8Array( maxVertexAttributes );
		this.attributeDivisors = new Uint8Array( maxVertexAttributes );
	
		this.capabilities = {};
	
		this.compressedTextureFormats = null;
	
		this.currentProgram = null;
	
		this.currentBlending = null;
		this.currentBlendEquation = null;
		this.currentBlendSrc = null;
		this.currentBlendDst = null;
		this.currentBlendEquationAlpha = null;
		this.currentBlendSrcAlpha = null;
		this.currentBlendDstAlpha = null;
		this.currentPremultipledAlpha = false;
	
		this.currentFlipSided = null;
		this.currentCullFace = null;
	
		this.currentLineWidth = null;
	
		this.currentPolygonOffsetFactor = null;
		this.currentPolygonOffsetUnits = null;
	
		this.maxTextures = gl.getParameter( gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS );
	
		this.lineWidthAvailable = false;
		let version = 0;
		let glVersion = gl.getParameter( gl.VERSION );
	
		if ( glVersion.indexOf( 'WebGL' ) !== - 1 ) {
	
		   version = parseFloat( /^WebGL\ ([0-9])/.exec( glVersion )[ 1 ] );
		   this.lineWidthAvailable = ( version >= 1.0 );
	
		} else if ( glVersion.indexOf( 'OpenGL ES' ) !== - 1 ) {
	
		   version = parseFloat( /^OpenGL\ ES\ ([0-9])/.exec( glVersion )[ 1 ] );
		   this.lineWidthAvailable = ( version >= 2.0 );
	
		}
	
		this.currentTextureSlot = null;
		this.currentBoundTextures = {};
	
		this.currentScissor = new Vector4();
		this.currentViewport = new Vector4();

		this.emptyTextures = {};
		this.emptyTextures[ gl.TEXTURE_2D ] = this.createTexture( gl.TEXTURE_2D, gl.TEXTURE_2D, 1 );
		this.emptyTextures[ gl.TEXTURE_CUBE_MAP ] = this.createTexture( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6 );

		// init

		this.colorBuffer.setClear( 0, 0, 0, 1 );
		this.depthBuffer.setClear( 1 );
		this.stencilBuffer.setClear( 0 );

		//enable( gl.DEPTH_TEST );
		this.depthBuffer.setFunc( LessEqualDepth );

		//setFlipSided( false );
		//setCullFace( CullFaceBack );
		//enable( gl.CULL_FACE );

		//enable( gl.BLEND );
		//setBlending( NormalBlending );
		this.buffers = {
			color: this.colorBuffer,
			depth: this.depthBuffer,
			stencil: this.stencilBuffer
		};
	}

	//

	createTexture( type : any, target : any, count : number ) : any {

		let data = new Uint8Array( 4 ); // 4 is required to match default unpack alignment of 4.
		let texture = this.gl.createTexture();

		this.gl.bindTexture( type, texture );
		this.gl.texParameteri( type, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST );
		this.gl.texParameteri( type, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST );

		for ( let i = 0; i < count; i ++ ) {

			this.gl.texImage2D( target + i, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data );

		}

		return texture;

	}

	//

	initAttributes() : void {

		for ( let i = 0, l = this.newAttributes.length; i < l; i ++ ) {

			this.newAttributes[ i ] = 0;

		}

	}

	enableAttribute( attribute : string ) : void {

		this.newAttributes[ attribute ] = 1;

		if ( this.enabledAttributes[ attribute ] === 0 ) {

			this.gl.enableVertexAttribArray( attribute );
			this.enabledAttributes[ attribute ] = 1;

		}

		if ( this.attributeDivisors[ attribute ] !== 0 ) {

			let extension = this.extensions.get( 'ANGLE_instanced_arrays' );

			extension.vertexAttribDivisorANGLE( attribute, 0 );
			this.attributeDivisors[ attribute ] = 0;

		}

	}

	enableAttributeAndDivisor( attribute : string, meshPerAttribute : number ) : void {

		this.newAttributes[ attribute ] = 1;

		if ( this.enabledAttributes[ attribute ] === 0 ) {

			this.gl.enableVertexAttribArray( attribute );
			this.enabledAttributes[ attribute ] = 1;

		}

		if ( this.attributeDivisors[ attribute ] !== meshPerAttribute ) {

			let extension = this.extensions.get( 'ANGLE_instanced_arrays' );

			extension.vertexAttribDivisorANGLE( attribute, meshPerAttribute );
			this.attributeDivisors[ attribute ] = meshPerAttribute;

		}

	}

	disableUnusedAttributes() : void {

		for ( let i = 0, l = this.enabledAttributes.length; i !== l; ++ i ) {

			if ( this.enabledAttributes[ i ] !== this.newAttributes[ i ] ) {

				this.gl.disableVertexAttribArray( i );
				this.enabledAttributes[ i ] = 0;

			}

		}

	}

	enable( id : string ) : void {

		if ( this.capabilities[ id ] !== true ) {

			this.gl.enable( id );
			this.capabilities[ id ] = true;

		}

	}

	disable( id : string ) : void {

		if ( this.capabilities[ id ] !== false ) {

			this.gl.disable( id );
			this.capabilities[ id ] = false;

		}

	}

	getCompressedTextureFormats() : Array<any> {

		if ( this.compressedTextureFormats === null ) {

			this.compressedTextureFormats = [];

			if ( this.extensions.get( 'WEBGL_compressed_texture_pvrtc' ) ||
			     this.extensions.get( 'WEBGL_compressed_texture_s3tc' ) ||
			     this.extensions.get( 'WEBGL_compressed_texture_etc1' ) ||
			     this.extensions.get( 'WEBGL_compressed_texture_astc' ) ) {

				let formats = this.gl.getParameter( this.gl.COMPRESSED_TEXTURE_FORMATS );

				for ( let i = 0; i < formats.length; i ++ ) {

					this.compressedTextureFormats.push( formats[ i ] );

				}

			}

		}

		return this.compressedTextureFormats;

	}

	useProgram( program : any ) : boolean {

		if ( this.currentProgram !== program ) {

			this.gl.useProgram( program );

			this.currentProgram = program;

			return true;

		}

		return false;

	}

	setBlending( blending : number, blendEquation? : number, blendSrc? : any, blendDst? : any, blendEquationAlpha? : number,
		 blendSrcAlpha? : any, blendDstAlpha? : any, premultipliedAlpha? : boolean ) : void {

		if ( blending !== NoBlending ) {

			this.enable( this.gl.BLEND );

		} else {

			this.disable( this.gl.BLEND );

		}

		if ( blending !== CustomBlending ) {

			if ( blending !== this.currentBlending || premultipliedAlpha !== this.currentPremultipledAlpha ) {

				switch ( blending ) {

					case AdditiveBlending:

						if ( premultipliedAlpha ) {

							this.gl.blendEquationSeparate( this.gl.FUNC_ADD, this.gl.FUNC_ADD );
							this.gl.blendFuncSeparate( this.gl.ONE, this.gl.ONE, this.gl.ONE, this.gl.ONE );

						} else {

							this.gl.blendEquation( this.gl.FUNC_ADD );
							this.gl.blendFunc( this.gl.SRC_ALPHA, this.gl.ONE );

						}
						break;

					case SubtractiveBlending:

						if ( premultipliedAlpha ) {

							this.gl.blendEquationSeparate( this.gl.FUNC_ADD, this.gl.FUNC_ADD );
							this.gl.blendFuncSeparate( this.gl.ZERO, this.gl.ZERO, this.gl.ONE_MINUS_SRC_COLOR, this.gl.ONE_MINUS_SRC_ALPHA );

						} else {

							this.gl.blendEquation( this.gl.FUNC_ADD );
							this.gl.blendFunc( this.gl.ZERO, this.gl.ONE_MINUS_SRC_COLOR );

						}
						break;

					case MultiplyBlending:

						if ( premultipliedAlpha ) {

							this.gl.blendEquationSeparate( this.gl.FUNC_ADD, this.gl.FUNC_ADD );
							this.gl.blendFuncSeparate( this.gl.ZERO, this.gl.SRC_COLOR, this.gl.ZERO, this.gl.SRC_ALPHA );

						} else {

							this.gl.blendEquation( this.gl.FUNC_ADD );
							this.gl.blendFunc( this.gl.ZERO, this.gl.SRC_COLOR );

						}
						break;

					default:

						if ( premultipliedAlpha ) {

							this.gl.blendEquationSeparate( this.gl.FUNC_ADD, this.gl.FUNC_ADD );
							this.gl.blendFuncSeparate( this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA );

						} else {

							this.gl.blendEquationSeparate( this.gl.FUNC_ADD, this.gl.FUNC_ADD );
							this.gl.blendFuncSeparate( this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA );

						}

				}

			}

			this.currentBlendEquation = null;
			this.currentBlendSrc = null;
			this.currentBlendDst = null;
			this.currentBlendEquationAlpha = null;
			this.currentBlendSrcAlpha = null;
			this.currentBlendDstAlpha = null;

		} else {

			blendEquationAlpha = blendEquationAlpha || blendEquation;
			blendSrcAlpha = blendSrcAlpha || blendSrc;
			blendDstAlpha = blendDstAlpha || blendDst;

			if ( blendEquation !== this.currentBlendEquation || blendEquationAlpha !== this.currentBlendEquationAlpha ) {

				this.gl.blendEquationSeparate( this.utils.convert( blendEquation ), this.utils.convert( blendEquationAlpha ) );

				this.currentBlendEquation = blendEquation;
				this.currentBlendEquationAlpha = blendEquationAlpha;

			}

			if ( blendSrc !== this.currentBlendSrc || blendDst !== this.currentBlendDst || blendSrcAlpha !== this.currentBlendSrcAlpha || blendDstAlpha !== this.currentBlendDstAlpha ) {

				this.gl.blendFuncSeparate( this.utils.convert( blendSrc ), this.utils.convert( blendDst ), this.utils.convert( blendSrcAlpha ), this.utils.convert( blendDstAlpha ) );

				this.currentBlendSrc = blendSrc;
				this.currentBlendDst = blendDst;
				this.currentBlendSrcAlpha = blendSrcAlpha;
				this.currentBlendDstAlpha = blendDstAlpha;

			}

		}

		this.currentBlending = blending;
		this.currentPremultipledAlpha = premultipliedAlpha;

	}

	setMaterial( material : Material, frontFaceCW : boolean ) : void {

		material.side === DoubleSide
			? this.disable( this.gl.CULL_FACE )
			: this.enable( this.gl.CULL_FACE );

		let flipSided = ( material.side === BackSide );
		if ( frontFaceCW ) flipSided = ! flipSided;

		this.setFlipSided( flipSided );

		material.transparent === true
			? this.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha )
			: this.setBlending( NoBlending );

		this.depthBuffer.setFunc( material.depthFunc );
		this.depthBuffer.setTest( material.depthTest );
		this.depthBuffer.setMask( material.depthWrite );
		this.colorBuffer.setMask( material.colorWrite );

		this.setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

	}

	//

	setFlipSided( flipSided : boolean ) : void {

		if ( this.currentFlipSided !== flipSided ) {

			if ( flipSided ) {

				this.gl.frontFace( this.gl.CW );

			} else {

				this.gl.frontFace( this.gl.CCW );

			}

			this.currentFlipSided = flipSided;

		}

	}

	setCullFace( cullFace : number ) : void {

		if ( cullFace !== CullFaceNone ) {

			this.enable( this.gl.CULL_FACE );

			if ( cullFace !== this.currentCullFace ) {

				if ( cullFace === CullFaceBack ) {

					this.gl.cullFace( this.gl.BACK );

				} else if ( cullFace === CullFaceFront ) {

					this.gl.cullFace( this.gl.FRONT );

				} else {

					this.gl.cullFace( this.gl.FRONT_AND_BACK );

				}

			}

		} else {

			this.disable( this.gl.CULL_FACE );

		}

		this.currentCullFace = cullFace;

	}

	setLineWidth( width : number ) : void {

		if ( width !== this.currentLineWidth ) {

			if ( this.lineWidthAvailable ) this.gl.lineWidth( width );

			this.currentLineWidth = width;

		}

	}

	setPolygonOffset( polygonOffset : boolean, factor? : number, units? : number ) : void {

		if ( polygonOffset ) {

			this.enable( this.gl.POLYGON_OFFSET_FILL );

			if ( this.currentPolygonOffsetFactor !== factor || this.currentPolygonOffsetUnits !== units ) {

				this.gl.polygonOffset( factor, units );

				this.currentPolygonOffsetFactor = factor;
				this.currentPolygonOffsetUnits = units;

			}

		} else {

			this.disable( this.gl.POLYGON_OFFSET_FILL );

		}

	}

	setScissorTest( scissorTest : boolean ) : void {

		if ( scissorTest ) {

			this.enable( this.gl.SCISSOR_TEST );

		} else {

			this.disable( this.gl.SCISSOR_TEST );

		}

	}

	// texture

	activeTexture( webglSlot? : number ) : void {

		if ( webglSlot === undefined ) webglSlot = this.gl.TEXTURE0 + this.maxTextures - 1;

		if ( this.currentTextureSlot !== webglSlot ) {

			this.gl.activeTexture( webglSlot );
			this.currentTextureSlot = webglSlot;

		}

	}

	bindTexture( webglType : any, webglTexture : WebGLTexture ) : void {

		if ( this.currentTextureSlot === null ) {

			this.activeTexture();

		}

		let boundTexture = this.currentBoundTextures[ this.currentTextureSlot ];

		if ( boundTexture === undefined ) {

			boundTexture = { type: undefined, texture: undefined };
			this.currentBoundTextures[ this.currentTextureSlot ] = boundTexture;

		}

		if ( boundTexture.type !== webglType || boundTexture.texture !== webglTexture ) {

			this.gl.bindTexture( webglType, webglTexture || this.emptyTextures[ webglType ] );

			boundTexture.type = webglType;
			boundTexture.texture = webglTexture;

		}

	}

	compressedTexImage2D() : void {

		try {

			this.gl.compressedTexImage2D.apply( this.gl, arguments );

		} catch ( error ) {

			console.error( 'THREE.WebGLState:', error );

		}

	}

	texImage2D() : void {

		try {

			this.gl.texImage2D.apply( this.gl, arguments );

		} catch ( error ) {

			console.error( 'THREE.WebGLState:', error );

		}

	}

	//

	scissor( scissor : Vector4 ) : void {

		if ( this.currentScissor.equals( scissor ) === false ) {

			this.gl.scissor( scissor.x, scissor.y, scissor.z, scissor.w );
			this.currentScissor.copy( scissor );

		}

	}

	viewport( viewport : Vector4 ) : void {

		if ( this.currentViewport.equals( viewport ) === false ) {

			this.gl.viewport( viewport.x, viewport.y, viewport.z, viewport.w );
			this.currentViewport.copy( viewport );

		}

	}

	//

	reset() : void {

		for ( let i = 0; i < this.enabledAttributes.length; i ++ ) {

			if ( this.enabledAttributes[ i ] === 1 ) {

				this.gl.disableVertexAttribArray( i );
				this.enabledAttributes[ i ] = 0;

			}

		}

		this.capabilities = {};

		this.compressedTextureFormats = null;

		this.currentTextureSlot = null;
		this.currentBoundTextures = {};

		this.currentProgram = null;

		this.currentBlending = null;

		this.currentFlipSided = null;
		this.currentCullFace = null;

		this.colorBuffer.reset();
		this.depthBuffer.reset();
		this.stencilBuffer.reset();

	}


	



}

export module WebGLState{
	export class ColorBuffer {

		locked : boolean;
		color : Vector4;
		currentColorMask : number;
		currentColorClear : Vector4;
		gl;
		constructor(gl : any){
			this.gl = gl;
			this.locked = false;

			this.color = new Vector4();
			this.currentColorMask = null;
			this.currentColorClear = new Vector4( 0, 0, 0, 0 );
		}

		setMask ( colorMask : number ) : void {

			if ( this.currentColorMask !== colorMask && ! this.locked ) {

				this.gl.colorMask( colorMask, colorMask, colorMask, colorMask );
				this.currentColorMask = colorMask;

			}

		}

		setLocked ( lock : boolean ) : void {

			this.locked = lock;

		}

		setClear ( r : number, g : number, b : number, a : number, premultipliedAlpha? : boolean ) : void {

			if ( premultipliedAlpha === true ) {

				r *= a; g *= a; b *= a;

			}

			this.color.set( r, g, b, a );

			if ( this.currentColorClear.equals( this.color ) === false ) {

				this.gl.clearColor( r, g, b, a );
				this.currentColorClear.copy( this.color );

			}

		}

		reset () : void {

			this.locked = false;

			this.currentColorMask = null;
			this.currentColorClear.set( - 1, 0, 0, 0 ); // set to invalid state

		}

		

	}

	export class DepthBuffer {
		locked = false;

		currentDepthMask = null;
		currentDepthFunc = null;
		currentDepthClear = null;
		gl;
		constructor(gl : any){
			this.gl = gl;
		}

		//TODO:
		setTest ( depthTest : any ) : void {

			if ( depthTest ) {

				//enable( this.gl.DEPTH_TEST );

			} else {

				//disable( this.gl.DEPTH_TEST );

			}

		}

		setMask ( depthMask : number ) : void {

			if ( this.currentDepthMask !== depthMask && ! this.locked ) {

				this.gl.depthMask( depthMask );
				this.currentDepthMask = depthMask;

			}

		}

		setFunc ( depthFunc : number ) : void {

			if ( this.currentDepthFunc !== depthFunc ) {

				if ( depthFunc ) {

					switch ( depthFunc ) {

						case NeverDepth:

							this.gl.depthFunc( this.gl.NEVER );
							break;

						case AlwaysDepth:

							this.gl.depthFunc( this.gl.ALWAYS );
							break;

						case LessDepth:

							this.gl.depthFunc( this.gl.LESS );
							break;

						case LessEqualDepth:

							this.gl.depthFunc( this.gl.LEQUAL );
							break;

						case EqualDepth:

							this.gl.depthFunc( this.gl.EQUAL );
							break;

						case GreaterEqualDepth:

							this.gl.depthFunc( this.gl.GEQUAL );
							break;

						case GreaterDepth:

							this.gl.depthFunc( this.gl.GREATER );
							break;

						case NotEqualDepth:

							this.gl.depthFunc( this.gl.NOTEQUAL );
							break;

						default:

							this.gl.depthFunc( this.gl.LEQUAL );

					}

				} else {

					this.gl.depthFunc( this.gl.LEQUAL );

				}

				this.currentDepthFunc = depthFunc;

			}

		}

		setLocked ( lock : boolean ) : void {

			this.locked = lock;

		}

		setClear ( depth : number ) : void {

			if ( this.currentDepthClear !== depth ) {

				this.gl.clearDepth( depth );
				this.currentDepthClear = depth;

			}

		}

		reset () : void {

			this.locked = false;

			this.currentDepthMask = null;
			this.currentDepthFunc = null;
			this.currentDepthClear = null;

		}


	}

	export class StencilBuffer {

		locked = false;

		currentStencilMask = null;
		currentStencilFunc = null;
		currentStencilRef = null;
		currentStencilFuncMask = null;
		currentStencilFail = null;
		currentStencilZFail = null;
		currentStencilZPass = null;
		currentStencilClear = null;
		gl;
		constructor(gl : any){
			this.gl = gl;
		}

		//TODO:
		setTest ( stencilTest : boolean ) : void {

			if ( stencilTest ) {

				//enable( this.gl.STENCIL_TEST );

			} else {

				//disable( this.gl.STENCIL_TEST );

			}

		}

		setMask ( stencilMask : number ) : void {

			if ( this.currentStencilMask !== stencilMask && ! this.locked ) {

				this.gl.stencilMask( stencilMask );
				this.currentStencilMask = stencilMask;

			}

		}

		setFunc ( stencilFunc : number, stencilRef : number, stencilMask : number ) : void {

			if ( this.currentStencilFunc !== stencilFunc ||
					this.currentStencilRef 	!== stencilRef 	||
					this.currentStencilFuncMask !== stencilMask ) {

				this.gl.stencilFunc( stencilFunc, stencilRef, stencilMask );

				this.currentStencilFunc = stencilFunc;
				this.currentStencilRef = stencilRef;
				this.currentStencilFuncMask = stencilMask;

			}

		}

		setOp ( stencilFail : number, stencilZFail : number, stencilZPass : number ) : void {

			if ( this.currentStencilFail	 !== stencilFail 	||
					this.currentStencilZFail !== stencilZFail ||
					this.currentStencilZPass !== stencilZPass ) {

				this.gl.stencilOp( stencilFail, stencilZFail, stencilZPass );

				this.currentStencilFail = stencilFail;
				this.currentStencilZFail = stencilZFail;
				this.currentStencilZPass = stencilZPass;

			}

		}

		setLocked ( lock : boolean ) : void {

			this.locked = lock;

		}

		setClear ( stencil : number ) : void {

			if ( this.currentStencilClear !== stencil ) {

				this.gl.clearStencil( stencil );
				this.currentStencilClear = stencil;

			}

		}

		reset () : void {

			this.locked = false;

			this.currentStencilMask = null;
			this.currentStencilFunc = null;
			this.currentStencilRef = null;
			this.currentStencilFuncMask = null;
			this.currentStencilFail = null;
			this.currentStencilZFail = null;
			this.currentStencilZPass = null;
			this.currentStencilClear = null;

		}

		

	}
}
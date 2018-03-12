import { EventDispatcher } from '../core/EventDispatcher';
import { Texture } from '../textures/Texture';
import { LinearFilter } from '../constants';
import { Vector4 } from '../math/Vector4';
import { _Math } from '../math/Math';
import { DepthTexture } from '../Three';

/**
 * @author szimek / https://github.com/szimek/
 * @author alteredq / http://alteredqualia.com/
 * @author Marius Kintel / https://github.com/kintel
 */

/*
 In options, we can specify:
 * Texture parameters for an auto-generated target texture
 * depthBuffer/stencilBuffer: Booleans to indicate if we should generate these buffers
*/
export class WebGLRenderTarget extends EventDispatcher {

	uuid : string = _Math.generateUUID();
	width : number;
	height : number;
	scissor : Vector4;
	scissorTest : boolean;
	viewport : Vector4;
	texture : Texture;
	depthBuffer : boolean;
	stencilBuffer : boolean;
	depthTexture : DepthTexture;
	isWebGLRenderTarget : boolean = true;
	constructor( width? : number, height? : number, options : any = {} ){
		super();

		this.width = width;
		this.height = height;
	
		this.scissor = new Vector4( 0, 0, width, height );
		this.scissorTest = false;
	
		this.viewport = new Vector4( 0, 0, width, height );
	
		if ( options.minFilter === undefined ) options.minFilter = LinearFilter;
	
		this.texture = new Texture( undefined, undefined, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy, options.encoding );
	
		this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
		this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;
		this.depthTexture = options.depthTexture !== undefined ? options.depthTexture : null;
	}

	setSize ( width : number, height : number ) : void {

		if ( this.width !== width || this.height !== height ) {

			this.width = width;
			this.height = height;

			this.dispose();

		}

		this.viewport.set( 0, 0, width, height );
		this.scissor.set( 0, 0, width, height );

	}

	clone () : WebGLRenderTarget {

		return new WebGLRenderTarget().copy( this );

	}

	copy ( source : WebGLRenderTarget ) : WebGLRenderTarget {

		this.width = source.width;
		this.height = source.height;

		this.viewport.copy( source.viewport );

		this.texture = source.texture.clone();

		this.depthBuffer = source.depthBuffer;
		this.stencilBuffer = source.stencilBuffer;
		this.depthTexture = source.depthTexture;

		return this;

	}

	dispose () : void {

		this.dispatchEvent( { type: 'dispose' } );

	}

}
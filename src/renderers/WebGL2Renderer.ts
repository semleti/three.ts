/**
 * @author mrdoob / http://mrdoob.com/
 */

import { REVISION } from '../constants';
import { WebGLExtensions } from './webgl/WebGLExtensions';
import { WebGLState } from './webgl/WebGLState';
import { Color } from '../math/Color';
import { Vector4 } from '../math/Vector4';
import { Scene } from '../scenes/Scene';
import { Camera } from '../cameras/Camera';

export class WebGL2Renderer {

	gl;_viewport;_pixelRatio;_width;_height;_canvas;state;_premultipliedAlpha;extensions;
	_autoClear;_autoClearColor;_autoClearDepth;_autoClearStencil;_clearColor;_clearAlpha;
	constructor( parameters : any ){

		console.log( 'THREE.WebGL2Renderer', REVISION );
		parameters = parameters || {};
	
		this._canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ) as HTMLCanvasElement;
		var	_context = parameters.context !== undefined ? parameters.context : null,
	
			_alpha = parameters.alpha !== undefined ? parameters.alpha : false,
			_depth = parameters.depth !== undefined ? parameters.depth : true,
			_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
			_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
			_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false,
			_powerPreference = parameters.powerPreference !== undefined ? parameters.powerPreference : 'default';
		this._premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
	
		// initialize

	
		try {
	
			let attributes = {
				alpha: _alpha,
				depth: _depth,
				stencil: _stencil,
				antialias: _antialias,
				premultipliedAlpha: this._premultipliedAlpha,
				preserveDrawingBuffer: _preserveDrawingBuffer,
				powerPreference: _powerPreference
			};
	
			// event listeners must be registered before WebGL context is created, see #12753
	
			this._canvas.addEventListener( 'webglcontextlost', this.onContextLost, false );
			this._canvas.addEventListener( 'webglcontextrestored', function () { } );
	
			this.gl = _context || this._canvas.getContext( 'webgl2', attributes );
	
			if ( this.gl === null ) {
	
				if ( this._canvas.getContext( 'webgl2' ) !== null ) {
	
					throw new Error( 'Error creating WebGL2 context with your selected attributes.' );
	
				} else {
	
					throw new Error( 'Error creating WebGL2 context.' );
	
				}
	
			}
	
		} catch ( error ) {
	
			console.error( 'THREE.WebGL2Renderer: ' + error.message );
	
		}
	
		//
	
		this._autoClear = true;
		this._autoClearColor = true;
		this._autoClearDepth = true;
		this._autoClearStencil = true;
	
		this._clearColor = new Color( 0x000000 );
		this._clearAlpha = 0;
	
		this._width = this._canvas.width;
		this._height = this._canvas.height;
	
		this._pixelRatio = 1;
	
		this._viewport = new Vector4( 0, 0, this._width, this._height );
	
		this.extensions = new WebGLExtensions( this.gl );
		this.state = new WebGLState( this.gl, this.extensions, function () {} );
	}


	//

	clear( color? : number, depth? : number, stencil? : number ) : void {

		let bits = 0;

		if ( color === undefined || color ) bits |= this.gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= this.gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= this.gl.STENCIL_BUFFER_BIT;

		this.gl.clear( bits );

	}

	setPixelRatio( value : number ) : void {

		if ( value === undefined ) return;

		this._pixelRatio = value;

		this.setSize( this._viewport.z, this._viewport.w, false );

	}

	setSize( width : number, height : number, updateStyle : boolean ) : void {

		this._width = width;
		this._height = height;

		this._canvas.width = width * this._pixelRatio;
		this._canvas.height = height * this._pixelRatio;

		if ( updateStyle !== false ) {

			this._canvas.style.width = width + 'px';
			this._canvas.style.height = height + 'px';

		}

		this.setViewport( 0, 0, width, height );

	}

	setViewport( x : number, y : number, width : number, height : number ) : void {

		this.state.viewport( this._viewport.set( x, y, width, height ) );

	}

	render( scene : Scene, camera : Camera ) : void {

		if ( camera !== undefined && camera.isCamera !== true ) {

			console.error( 'THREE.WebGL2Renderer.render: camera is not an instance of THREE.Camera.' );
			return;

		}

		let background = scene.background;
		let forceClear = false;

		if ( background === null ) {

			this.state.buffers.color.setClear( this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearAlpha, this._premultipliedAlpha );

		} else if ( background && background.isColor ) {

			this.state.buffers.color.setClear( background.r, background.g, background.b, 1, this._premultipliedAlpha );
			forceClear = true;

		}

		if ( this._autoClear || forceClear ) {

			this.clear( this._autoClearColor, this._autoClearDepth, this._autoClearStencil );

		}

	}

	onContextLost( event : any ) : void {

		event.preventDefault();

	}

}
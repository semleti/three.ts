import { WebGLRenderTarget } from './WebGLRenderTarget';

/**
 * @author alteredq / http://alteredqualia.com
 */

export class WebGLRenderTargetCube extends WebGLRenderTarget {

	activeCubeFace;activeMipMapLevel;
	isWebGLRenderTargetCube : boolean = true;
	constructor( width : number, height : number, options : any ){
		super(width, height, options );

		this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
		this.activeMipMapLevel = 0;
	}


}
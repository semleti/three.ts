/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Texture } from './Texture';

export class CanvasTexture extends Texture {

	needsUpdate : boolean = true;
	constructor( canvas : any, mapping? : number, wrapS? : number, wrapT? : number, magFilter? : number, minFilter? : number, format? : number, type? : number, anisotropy? : number ){

		super(canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );
	}

}

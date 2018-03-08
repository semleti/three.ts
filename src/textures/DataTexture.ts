/**
 * @author alteredq / http://alteredqualia.com/
 */

import { Texture } from './Texture';
import { NearestFilter } from '../constants';

export class DataTexture extends Texture {

	isDataTexture : boolean = true;
	constructor( data? : Float32Array, width? : number, height? : number, format? : number, type? : number, mapping? : number,
		 wrapS? : number, wrapT? : number, magFilter? : number, minFilter? : number, anisotropy? : number, encoding? : number ){
		super(null, mapping, wrapS, wrapT, magFilter !== undefined ? magFilter : NearestFilter, minFilter !== undefined ? minFilter : NearestFilter, format, type, anisotropy, encoding)
		this.image = { data: data, width: width, height: height };
	
		this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
		this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;
	
		this.generateMipmaps = false;
		this.flipY = false;
		this.unpackAlignment = 1;
	}

}

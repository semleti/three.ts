/**
 * @author alteredq / http://alteredqualia.com/
 */

import { Texture } from './Texture';
import { NearestFilter } from '../constants';

export class DataTexture extends Texture {

	isDataTexture : boolean = true;
	constructor( data? : Float32Array, width? : number, height? : number, format? : number, type? : number, mapping? : number,
		 wrapS? : number, wrapT? : number, magFilter : number = NearestFilter, minFilter : number = NearestFilter, anisotropy? : number, encoding? : number ){
		super(null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
		this.image = { data: data, width: width, height: height };
	
		this.magFilter = magFilter;
		this.minFilter = minFilter;
	
		this.generateMipmaps = false;
		this.flipY = false;
		this.unpackAlignment = 1;
	}

}

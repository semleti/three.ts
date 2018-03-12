/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Texture } from './Texture';
import { CubeReflectionMapping } from '../constants';

export class CubeTexture extends Texture{

	isCubeTexture : boolean = true;
	images : Array<any>;
	mapping : number;
	constructor( images : Array<any> = [], mapping : number = CubeReflectionMapping, wrapS? : number, wrapT? : number, magFilter? : number, minFilter? : number
		, format? : number, type? : number, anisotropy? : number, encoding? : number ){
		super(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
		this.images = images;
		this.mapping = mapping;

		this.flipY = false;
	}

	get () : any {

		return this.image;

	}

	set ( value : any ) : void {

		this.image = value;

	}
}
/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Texture } from './Texture';
import { CubeReflectionMapping } from '../constants';

export class CubeTexture extends Texture{

	isCubeTexture : boolean = true;
	images : Array<any>;
	mapping : number;
	constructor( images? : Array<any>, mapping? : number, wrapS? : number, wrapT? : number, magFilter? : number, minFilter? : number
		, format? : number, type? : number, anisotropy? : number, encoding? : number ){
		super(images !== undefined ? images : [], mapping !== undefined ? mapping : CubeReflectionMapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
		this.images = images !== undefined ? images : [];
		this.mapping = mapping !== undefined ? mapping : CubeReflectionMapping;

		this.flipY = false;
	}

	get () : any {

		return this.image;

	}

	set ( value : any ) : void {

		this.image = value;

	}
}
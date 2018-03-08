/**
 * @author alteredq / http://alteredqualia.com/
 */

import { Texture } from './Texture';

export class CompressedTexture extends Texture {

	image : any;
	mipmaps : Array<any>;
	flipY : boolean;
	generateMipmaps : boolean;
	isCompressedTexture : boolean = true;
	constructor( mipmaps? : Array<any>, width? : number, height? : number, format? : number, type? : number, mapping? : number
		, wrapS? : number, wrapT? : number, magFilter? : number, minFilter? : number, anisotropy? : number, encoding? : number ){
		super(null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
		this.image = { width: width, height: height };
		this.mipmaps = mipmaps;

		// no flipping for cube textures
		// (also flipping doesn't work for compressed textures )

		this.flipY = false;

		// can't generate mipmaps for compressed textures
		// mips must be embedded in DDS files

		this.generateMipmaps = false;
	}

	

}

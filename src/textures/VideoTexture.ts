/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Texture } from './Texture';

export class VideoTexture extends Texture {

	generateMipmaps : boolean = false;
	isVideoTexture : boolean = true;
	constructor( video : any, mapping : number, wrapS : number, wrapT : number, magFilter : number, minFilter : number,
		 format : number, type : number, anisotropy : number ){
		super(video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	}

	update () : void {

		let video = this.image;

		if ( video.readyState >= video.HAVE_CURRENT_DATA ) {

			this.needsUpdate = true;

		}

	}

}


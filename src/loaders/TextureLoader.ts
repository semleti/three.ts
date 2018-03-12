/**
 * @author mrdoob / http://mrdoob.com/
 */

import { RGBAFormat, RGBFormat } from '../constants';
import { ImageLoader } from './ImageLoader';
import { Texture } from '../textures/Texture';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';


export class TextureLoader {

	manager : LoadingManager;
	path : string;
	constructor( manager : LoadingManager = DefaultLoadingManager ){

		this.manager = manager;
	}

	crossOrigin : string = 'Anonymous';

	load ( url : string, onLoad? : Function, onProgress? : Function, onError? : Function ) {

		let texture = new Texture();

		let loader = new ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );

		loader.load( url, function ( image ) {

			texture.image = image;

			// JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
			let isJPEG = url.search( /\.(jpg|jpeg)$/ ) > 0 || url.search( /^data\:image\/jpeg/ ) === 0;

			texture.format = isJPEG ? RGBFormat : RGBAFormat;
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

		return texture;

	}

	setCrossOrigin ( value : string ) : TextureLoader {

		this.crossOrigin = value;
		return this;

	}

	setPath ( value : string ) : TextureLoader {

		this.path = value;
		return this;

	}

}
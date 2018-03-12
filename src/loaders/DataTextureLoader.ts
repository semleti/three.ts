import { LinearFilter, LinearMipMapLinearFilter, ClampToEdgeWrapping } from '../constants';
import { FileLoader } from './FileLoader';
import { DataTexture } from '../textures/DataTexture';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';

/**
 * @author Nikos M. / https://github.com/foo123/
 *
 * Abstract Base class to load generic binary textures formats (rgbe, hdr, ...)
 */

export class DataTextureLoader {

	manager : LoadingManager;
	_parser : any;
	constructor( manager : LoadingManager = DefaultLoadingManager ){

		this.manager = manager;
	
		// override in sub classes
		this._parser = null;
	}

	load ( url : string, onLoad : Function, onProgress : Function, onError : Function ) : DataTexture {

		let scope = this;

		let texture = new DataTexture();

		let loader = new FileLoader( this.manager );
		loader.setResponseType( 'arraybuffer' );

		loader.load( url, function ( buffer ) {

			let texData = scope._parser( buffer );

			if ( ! texData ) return;

			if ( undefined !== texData.image ) {

				texture.image = texData.image;

			} else if ( undefined !== texData.data ) {

				texture.image.width = texData.width;
				texture.image.height = texData.height;
				texture.image.data = texData.data;

			}

			texture.wrapS = undefined !== texData.wrapS ? texData.wrapS : ClampToEdgeWrapping;
			texture.wrapT = undefined !== texData.wrapT ? texData.wrapT : ClampToEdgeWrapping;

			texture.magFilter = undefined !== texData.magFilter ? texData.magFilter : LinearFilter;
			texture.minFilter = undefined !== texData.minFilter ? texData.minFilter : LinearMipMapLinearFilter;

			texture.anisotropy = undefined !== texData.anisotropy ? texData.anisotropy : 1;

			if ( undefined !== texData.format ) {

				texture.format = texData.format;

			}
			if ( undefined !== texData.type ) {

				texture.type = texData.type;

			}

			if ( undefined !== texData.mipmaps ) {

				texture.mipmaps = texData.mipmaps;

			}

			if ( 1 === texData.mipmapCount ) {

				texture.minFilter = LinearFilter;

			}

			texture.needsUpdate = true;

			if ( onLoad ) onLoad( texture, texData );

		}, onProgress, onError );


		return texture;

	}

}
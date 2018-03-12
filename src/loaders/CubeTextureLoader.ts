/**
 * @author mrdoob / http://mrdoob.com/
 */

import { ImageLoader } from './ImageLoader';
import { CubeTexture } from '../textures/CubeTexture';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';


export class CubeTextureLoader {

	manager : LoadingManager;
	path : string;
	crossOrigin : string = 'Anonymous';
	constructor( manager : LoadingManager = DefaultLoadingManager ){
		this.manager = manager;

	}

	load ( urls : Array<string>, onLoad : Function, onProgress : Function, onError : Function ) : CubeTexture {

		let texture = new CubeTexture();

		let loader = new ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );

		let loaded = 0;

		function loadTexture( i : number ) : void {

			loader.load( urls[ i ], function ( image ) {

				texture.images[ i ] = image;

				loaded ++;

				if ( loaded === 6 ) {

					texture.needsUpdate = true;

					if ( onLoad ) onLoad( texture );

				}

			}, undefined, onError );

		}

		for ( let i = 0; i < urls.length; ++ i ) {

			loadTexture( i );

		}

		return texture;

	}

	setCrossOrigin ( value : string ) : CubeTextureLoader {

		this.crossOrigin = value;
		return this;

	}

	setPath ( value : string ) : CubeTextureLoader {

		this.path = value;
		return this;

	}

}

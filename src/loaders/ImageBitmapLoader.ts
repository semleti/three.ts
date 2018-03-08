/**
 * @author thespite / http://clicktorelease.com/
 */

import { Cache } from './Cache';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';


export class ImageBitmapLoader {

	manager : LoadingManager;
	options : any;
	path : string;
	constructor( manager : LoadingManager ){

		if ( typeof createImageBitmap === 'undefined' ) {
	
			console.warn( 'THREE.ImageBitmapLoader: createImageBitmap() not supported.' );
	
		}
	
		if ( typeof fetch === 'undefined' ) {
	
			console.warn( 'THREE.ImageBitmapLoader: fetch() not supported.' );
	
		}
	
		this.manager = manager !== undefined ? manager : DefaultLoadingManager;
		this.options = undefined;
	}

	setOptions( options : any ) : ImageBitmapLoader {

		this.options = options;

		return this;

	}

	load( url : string, onLoad : Function, onProgress : Function, onError : Function ) : ImageBitmap {

		if ( url === undefined ) url = '';

		if ( this.path !== undefined ) url = this.path + url;

		let scope = this;

		let cached = Cache.get( url );

		if ( cached !== undefined ) {

			scope.manager.itemStart( url );

			setTimeout( function () {

				if ( onLoad ) onLoad( cached );

				scope.manager.itemEnd( url );

			}, 0 );

			return cached;

		}

		fetch( url ).then( function ( res ) {

			return res.blob();

		} ).then( function ( blob ) {

			return createImageBitmap( blob, scope.options );

		} ).then( function ( imageBitmap ) {

			Cache.add( url, imageBitmap );

			if ( onLoad ) onLoad( imageBitmap );

			scope.manager.itemEnd( url );

		} ).catch( function ( e ) {

			if ( onError ) onError( e );

			scope.manager.itemEnd( url );
			scope.manager.itemError( url );

		} );

	}

	setCrossOrigin ( /* value */ ) : ImageBitmapLoader {
		//TODO: ?
		return this;

	}

	setPath ( value : string ) : ImageBitmapLoader {

		this.path = value;
		return this;

	}
}
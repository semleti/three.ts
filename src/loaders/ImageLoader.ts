/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Cache } from './Cache';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';


export class ImageLoader {

	crossOrigin : string = 'Anonymous';
	manager : LoadingManager;
	path : string;
	constructor( manager : LoadingManager = DefaultLoadingManager ){

		this.manager = manager;
	}

	load ( url : string, onLoad : Function, onProgress : Function, onError : Function ) : HTMLImageElement {

		if ( url === undefined ) url = '';

		if ( this.path !== undefined ) url = this.path + url;

		url = this.manager.resolveURL( url );

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

		let image = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'img' ) as HTMLImageElement;

		image.addEventListener( 'load', function () {

			Cache.add( url, this );

			if ( onLoad ) onLoad( this );

			scope.manager.itemEnd( url );

		}, false );

		/*
		image.addEventListener( 'progress', function ( event ) {

			if ( onProgress ) onProgress( event );

		}, false );
		*/

		image.addEventListener( 'error', function ( event ) {

			if ( onError ) onError( event );

			scope.manager.itemEnd( url );
			scope.manager.itemError( url );

		}, false );

		if ( url.substr( 0, 5 ) !== 'data:' ) {

			if ( this.crossOrigin !== undefined ) image.crossOrigin = this.crossOrigin;

		}

		scope.manager.itemStart( url );

		image.src = url;

		return image;

	}

	setCrossOrigin ( value : string ) : ImageLoader {

		this.crossOrigin = value;
		return this;

	}

	setPath ( value : string ) : ImageLoader {

		this.path = value;
		return this;

	}
}

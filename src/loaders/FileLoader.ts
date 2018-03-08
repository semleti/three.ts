/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Cache } from './Cache';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';

let loading = {};

export class FileLoader {

	manager : LoadingManager;
	path : string;
	responseType : XMLHttpRequestResponseType;
	withCredentials : boolean;
	requestHeader : Array<string>;
	mimeType;
	constructor( manager : LoadingManager ){
		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
	}

	load ( url : string, onLoad : Function, onProgress : Function, onError : Function ) : XMLHttpRequest {

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

		// Check if request is duplicate

		if ( loading[ url ] !== undefined ) {

			loading[ url ].push( {

				onLoad: onLoad,
				onProgress: onProgress,
				onError: onError

			} );

			return;

		}

		// Check for data: URI
		let dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
		let dataUriRegexResult = url.match( dataUriRegex );

		let request;
		
		// Safari can not handle Data URIs through XMLHttpRequest so process manually
		if ( dataUriRegexResult ) {

			let mimeType = dataUriRegexResult[ 1 ];
			let isBase64 = !! dataUriRegexResult[ 2 ];
			let data = dataUriRegexResult[ 3 ];

			data = decodeURIComponent( data );

			if ( isBase64 ) data = window.atob( data );

			try {

				let response;
				let responseType = ( this.responseType || '' ).toLowerCase();

				switch ( responseType ) {

					case 'arraybuffer':
					case 'blob':

						let view = new Uint8Array( data.length );

						for ( let i = 0; i < data.length; i ++ ) {

							view[ i ] = data.charCodeAt( i );

						}

						if ( responseType === 'blob' ) {

							response = new Blob( [ view.buffer ], { type: mimeType } );

						} else {

							response = view.buffer;

						}

						break;

					case 'document':

						let parser = new DOMParser();
						response = parser.parseFromString( data, mimeType );

						break;

					case 'json':

						response = JSON.parse( data );

						break;

					default: // 'text' or other

						response = data;

						break;

				}

				// Wait for next browser tick like standard XMLHttpRequest event dispatching does
				window.setTimeout( function () {

					if ( onLoad ) onLoad( response );

					scope.manager.itemEnd( url );

				}, 0 );

			} catch ( error ) {

				// Wait for next browser tick like standard XMLHttpRequest event dispatching does
				window.setTimeout( function () {

					if ( onError ) onError( error );

					scope.manager.itemEnd( url );
					scope.manager.itemError( url );

				}, 0 );

			}

		} else {

			// Initialise array for duplicate requests

			loading[ url ] = [];

			loading[ url ].push( {

				onLoad: onLoad,
				onProgress: onProgress,
				onError: onError

			} );

			request = new XMLHttpRequest();

			request.open( 'GET', url, true );

			request.addEventListener( 'load', function ( event ) {

				let response = this.response;

				Cache.add( url, response );

				let callbacks = loading[ url ];

				delete loading[ url ];

				if ( this.status === 200 ) {

					for ( let i = 0, il = callbacks.length; i < il; i ++ ) {

						let callback = callbacks[ i ];
						if ( callback.onLoad ) callback.onLoad( response );

					}

					scope.manager.itemEnd( url );

				} else if ( this.status === 0 ) {

					// Some browsers return HTTP Status 0 when using non-http protocol
					// e.g. 'file://' or 'data://'. Handle as success.

					console.warn( 'THREE.FileLoader: HTTP Status 0 received.' );

					for ( let i = 0, il = callbacks.length; i < il; i ++ ) {

						let callback = callbacks[ i ];
						if ( callback.onLoad ) callback.onLoad( response );

					}

					scope.manager.itemEnd( url );

				} else {

					for ( let i = 0, il = callbacks.length; i < il; i ++ ) {

						let callback = callbacks[ i ];
						if ( callback.onError ) callback.onError( event );

					}

					scope.manager.itemEnd( url );
					scope.manager.itemError( url );

				}

			}, false );

			request.addEventListener( 'progress', function ( event ) {

				let callbacks = loading[ url ];

				for ( let i = 0, il = callbacks.length; i < il; i ++ ) {

					let callback = callbacks[ i ];
					if ( callback.onProgress ) callback.onProgress( event );

				}

			}, false );

			request.addEventListener( 'error', function ( event ) {

				let callbacks = loading[ url ];

				delete loading[ url ];

				for ( let i = 0, il = callbacks.length; i < il; i ++ ) {

					let callback = callbacks[ i ];
					if ( callback.onError ) callback.onError( event );

				}

				scope.manager.itemEnd( url );
				scope.manager.itemError( url );

			}, false );

			if ( this.responseType !== undefined ) request.responseType = this.responseType;
			if ( this.withCredentials !== undefined ) request.withCredentials = this.withCredentials;

			if ( request.overrideMimeType ) request.overrideMimeType( this.mimeType !== undefined ? this.mimeType : 'text/plain' );

			for ( let header in this.requestHeader ) {

				request.setRequestHeader( header, this.requestHeader[ header ] );

			}

			request.send( null );

		}

		scope.manager.itemStart( url );

		return request;

	}

	setPath ( value : string ) : FileLoader {

		this.path = value;
		return this;

	}

	setResponseType ( value : XMLHttpRequestResponseType ) : FileLoader {

		this.responseType = value;
		return this;

	}

	setWithCredentials ( value ) {

		this.withCredentials = value;
		return this;

	}

	setMimeType ( value ) {

		this.mimeType = value;
		return this;

	}

	setRequestHeader ( value ) {

		this.requestHeader = value;
		return this;

	}
	

}
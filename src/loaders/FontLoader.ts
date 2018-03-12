import { Font } from '../extras/core/Font';
import { FileLoader } from './FileLoader';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class FontLoader {

	manager : LoadingManager;
	path : string;
	constructor( manager : LoadingManager = DefaultLoadingManager ){

		this.manager = manager;
	}

	load ( url : string, onLoad : Function, onProgress : Function, onError : Function ) : void {

		let scope = this;

		let loader = new FileLoader( this.manager );
		loader.setPath( this.path );
		loader.load( url, function ( text ) {

			let json;

			try {

				json = JSON.parse( text );

			} catch ( e ) {

				console.warn( 'THREE.FontLoader: typeface support is being deprecated. Use typefaceon instead.' );
				json = JSON.parse( text.substring( 65, text.length - 2 ) );

			}

			let font = scope.parse( json );

			if ( onLoad ) onLoad( font );

		}, onProgress, onError );

	}

	parse ( json : any ) : Font {

		return new Font( json );

	}

	setPath ( value : string ) : FontLoader {

		this.path = value;
		return this;

	}
}
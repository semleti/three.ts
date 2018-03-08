/**
 * @author Don McCurdy / https://www.donmccurdy.com
 */

export abstract class LoaderUtils{

	static decodeText ( array : Array<number> ) : string {

		// FIXME:
		/*if ( typeof TextDecoder !== 'undefined' ) {

			return new TextDecoder().decode( array );

		}*/

		// Avoid the String.fromCharCode.apply(null, array) shortcut, which
		// throws a "maximum call stack size exceeded" error for large arrays.

		let s = '';

		for ( let i = 0, il = array.length; i < il; i ++ ) {

			// Implicitly assumes little-endian.
			s += String.fromCharCode( array[ i ] );

		}

		// Merges multi-byte utf-8 characters.
		return decodeURIComponent( escape( s ) );

	}

	static extractUrlBase ( url : string ) : string {

		let parts = url.split( '/' );

		if ( parts.length === 1 ) return './';

		parts.pop();

		return parts.join( '/' ) + '/';

	}

}

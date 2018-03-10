/**
 * @author mrdoob / http://mrdoob.com/
 */

export abstract class Cache{

	static enabled : boolean = false;

	static files = {};

	static add ( key, file ) {

		if ( this.enabled === false ) return;

		// console.log( 'THREE.Cache', 'Adding key:', key );

		this.files[ key ] = file;

	}

	static get ( key ) {

		if ( Cache.enabled === false ) return;

		// console.log( 'THREE.Cache', 'Checking key:', key );

		return this.files[ key ];

	}

	static remove ( key ) {

		delete this.files[ key ];

	}

	static clear () {

		this.files = {};

	}

}

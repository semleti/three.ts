import { Sphere } from '../math/Sphere';
import { Vector3 } from '../math/Vector3';
import { BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { FileLoader } from './FileLoader';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class BufferGeometryLoader {

	manager : LoadingManager;
	constructor( manager? : LoadingManager ){
		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
	}
	
	load ( url : string, onLoad : Function, onProgress : Function, onError : Function ) : void {

		let scope = this;

		let loader = new FileLoader( scope.manager );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	}

	parse ( json : any ) : BufferGeometry {

		let geometry = new BufferGeometry();

		let index = json.data.index;

		if ( index !== undefined ) {

			let typedArray = new TYPED_ARRAYS[ index.type ]( index.array );
			geometry.setIndex( new BufferAttribute( typedArray, 1 ) );

		}

		let attributes = json.data.attributes;

		for ( let key in attributes ) {

			let attribute = attributes[ key ];
			let typedArray = new TYPED_ARRAYS[ attribute.type ]( attribute.array );

			geometry.addAttribute( key, new BufferAttribute( typedArray, attribute.itemSize, attribute.normalized ) );

		}

		let groups = json.data.groups || json.data.drawcalls || json.data.offsets;

		if ( groups !== undefined ) {

			for ( let i = 0, n = groups.length; i !== n; ++ i ) {

				let group = groups[ i ];

				geometry.addGroup( group.start, group.count, group.materialIndex );

			}

		}

		let boundingSphere = json.data.boundingSphere;

		if ( boundingSphere !== undefined ) {

			let center = new Vector3();

			if ( boundingSphere.center !== undefined ) {

				center.fromArray( boundingSphere.center );

			}

			geometry.boundingSphere = new Sphere( center, boundingSphere.radius );

		}

		return geometry;

	}

}

let TYPED_ARRAYS = {
	Int8Array: Int8Array,
	Uint8Array: Uint8Array,
	// Workaround for IE11 pre KB2929437. See #11440
	Uint8ClampedArray: typeof Uint8ClampedArray !== 'undefined' ? Uint8ClampedArray : Uint8Array,
	Int16Array: Int16Array,
	Uint16Array: Uint16Array,
	Int32Array: Int32Array,
	Uint32Array: Uint32Array,
	Float32Array: Float32Array,
	Float64Array: Float64Array
};
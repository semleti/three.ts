/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Uint16BufferAttribute, Uint32BufferAttribute } from '../../core/BufferAttribute';
import { BufferGeometry } from '../../core/BufferGeometry';
import { arrayMax } from '../../utils';
import { Geometry } from '../../core/Geometry';
import { Object3D } from '../../Three';

export class WebGLGeometries {

	geometries = {};
	wireframeAttributes = {};

	gl;attributes;infoMemory;
	constructor( gl : any, attributes : any, infoMemory : any ){
		this.gl = gl;
		this.attributes = attributes;
		this.infoMemory = infoMemory;
	}

	onGeometryDispose = function(scope){
		return function( event : any ) : void {

			let geometry = event.target;
			let buffergeometry = scope.geometries[ geometry.id ];

			if ( buffergeometry.index !== null ) {

				scope.attributes.remove( buffergeometry.index );

			}

			for ( let name in buffergeometry.attributes ) {

				scope.attributes.remove( buffergeometry.attributes[ name ] );

			}

			geometry.removeEventListener( 'dispose', scope.onGeometryDispose );

			delete scope.geometries[ geometry.id ];

			// TODO Remove duplicate code

			let attribute = scope.wireframeAttributes[ geometry.id ];

			if ( attribute ) {

				scope.attributes.remove( attribute );
				delete scope.wireframeAttributes[ geometry.id ];

			}

			attribute = scope.wireframeAttributes[ buffergeometry.id ];

			if ( attribute ) {

				scope.attributes.remove( attribute );
				delete scope.wireframeAttributes[ buffergeometry.id ];

			}

			//

			scope.infoMemory.geometries --;

		}
	}(this);

	get( object : Object3D, geometry : Geometry | BufferGeometry ) {

		let buffergeometry = this.geometries[ geometry.id ];

		if ( buffergeometry ) return buffergeometry;

		geometry.addEventListener( 'dispose', this.onGeometryDispose );

		if ( (geometry as BufferGeometry).isBufferGeometry ) {

			buffergeometry = geometry;

		} else if ( (geometry as Geometry).isGeometry ) {

			if ( (geometry as Geometry)._bufferGeometry === undefined ) {

				(geometry as Geometry)._bufferGeometry = new BufferGeometry().setFromObject( object );

			}

			buffergeometry = (geometry as Geometry)._bufferGeometry;

		}

		this.geometries[ geometry.id ] = buffergeometry;

		this.infoMemory.geometries ++;

		return buffergeometry;

	}

	update( geometry : BufferGeometry ) : void {

		let index = geometry.index;
		let geometryAttributes = geometry.attributes;

		if ( index !== null ) {

			this.attributes.update( index, this.gl.ELEMENT_ARRAY_BUFFER );

		}

		for ( let name in geometryAttributes ) {

			this.attributes.update( geometryAttributes[ name ], this.gl.ARRAY_BUFFER );

		}

		// morph targets

		let morphAttributes = geometry.morphAttributes;

		for ( let name in morphAttributes ) {

			let array = morphAttributes[ name ];

			for ( let i = 0, l = array.length; i < l; i ++ ) {

				this.attributes.update( array[ i ], this.gl.ARRAY_BUFFER );

			}

		}

	}

	getWireframeAttribute( geometry : BufferGeometry ) {

		let attribute = this.wireframeAttributes[ geometry.id ];

		if ( attribute ) return attribute;

		let indices = [];

		let geometryIndex = geometry.index;
		let geometryAttributes = geometry.attributes;

		// console.time( 'wireframe' );

		if ( geometryIndex !== null ) {

			let array = geometryIndex.array;

			for ( let i = 0, l = array.length; i < l; i += 3 ) {

				let a = array[ i + 0 ];
				let b = array[ i + 1 ];
				let c = array[ i + 2 ];

				indices.push( a, b, b, c, c, a );

			}

		} else {

			let array = geometryAttributes.position.array;

			for ( let i = 0, lt = ( array.length / 3 ) - 1; i < lt; i += 3 ) {

				let at = i + 0;
				let bt = i + 1;
				let ct = i + 2;

				indices.push( at, bt, bt, ct, ct, at );

			}

		}

		// console.timeEnd( 'wireframe' );

		attribute = new ( arrayMax( indices ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( indices, 1 );

		this.attributes.update( attribute, this.gl.ELEMENT_ARRAY_BUFFER );

		this.wireframeAttributes[ geometry.id ] = attribute;

		return attribute;

	}

}
/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';
import { Geometry } from '../core/Geometry';

export class WireframeGeometry extends BufferGeometry {

	type : string = 'WireframeGeometry';
	// buffer

	vertices : Array<number> = [];
	position : Float32BufferAttribute;
	constructor( geometry : Geometry | BufferGeometry ){
		super();
		let i, j, l, o, ol;
		let edge = [ 0, 0 ], edges = {}, e, edge1, edge2;
		let key, keys = [ 'a', 'b', 'c' ];
		let vertex;

		// different logic for Geometry and BufferGeometry

		if ( geometry && (geometry as Geometry).isGeometry ) {

			// create a data structure that contains all edges without duplicates

			let faces = (geometry as Geometry).faces;

			for ( i = 0, l = faces.length; i < l; i ++ ) {

				let face = faces[ i ];

				for ( j = 0; j < 3; j ++ ) {

					edge1 = face[ keys[ j ] ];
					edge2 = face[ keys[ ( j + 1 ) % 3 ] ];
					edge[ 0 ] = Math.min( edge1, edge2 ); // sorting prevents duplicates
					edge[ 1 ] = Math.max( edge1, edge2 );

					key = edge[ 0 ] + ',' + edge[ 1 ];

					if ( edges[ key ] === undefined ) {

						edges[ key ] = { index1: edge[ 0 ], index2: edge[ 1 ] };

					}

				}

			}

			// generate vertices

			for ( key in edges ) {

				e = edges[ key ];

				vertex = (geometry as Geometry).vertices[ e.index1 ];
				this.vertices.push( vertex.x, vertex.y, vertex.z );

				vertex = (geometry as Geometry).vertices[ e.index2 ];
				this.vertices.push( vertex.x, vertex.y, vertex.z );

			}

		} else if ( geometry && (geometry as BufferGeometry).isBufferGeometry ) {

			let position, indices, groups;
			let group, start, count;
			let index1, index2;

			vertex = new Vector3();

			if ( (geometry as BufferGeometry).index !== null ) {

				// indexed BufferGeometry

				position = (geometry as BufferGeometry).attributes.position;
				indices = (geometry as BufferGeometry).index;
				groups = (geometry as BufferGeometry).groups;

				if ( groups.length === 0 ) {

					groups = [ { start: 0, count: indices.count, materialIndex: 0 } ];

				}

				// create a data structure that contains all eges without duplicates

				for ( o = 0, ol = groups.length; o < ol; ++ o ) {

					group = groups[ o ];

					start = group.start;
					count = group.count;

					for ( i = start, l = ( start + count ); i < l; i += 3 ) {

						for ( j = 0; j < 3; j ++ ) {

							edge1 = indices.getX( i + j );
							edge2 = indices.getX( i + ( j + 1 ) % 3 );
							edge[ 0 ] = Math.min( edge1, edge2 ); // sorting prevents duplicates
							edge[ 1 ] = Math.max( edge1, edge2 );

							key = edge[ 0 ] + ',' + edge[ 1 ];

							if ( edges[ key ] === undefined ) {

								edges[ key ] = { index1: edge[ 0 ], index2: edge[ 1 ] };

							}

						}

					}

				}

				// generate vertices

				for ( key in edges ) {

					e = edges[ key ];

					vertex.fromBufferAttribute( position, e.index1 );
					this.vertices.push( vertex.x, vertex.y, vertex.z );

					vertex.fromBufferAttribute( position, e.index2 );
					this.vertices.push( vertex.x, vertex.y, vertex.z );

				}

			} else {

				// non-indexed BufferGeometry

				position = (geometry as BufferGeometry).attributes.position;

				for ( i = 0, l = ( position.count / 3 ); i < l; i ++ ) {

					for ( j = 0; j < 3; j ++ ) {

						// three edges per triangle, an edge is represented as (index1, index2)
						// e.g. the first triangle has the following edges: (0,1),(1,2),(2,0)

						index1 = 3 * i + j;
						vertex.fromBufferAttribute( position, index1 );
						this.vertices.push( vertex.x, vertex.y, vertex.z );

						index2 = 3 * i + ( ( j + 1 ) % 3 );
						vertex.fromBufferAttribute( position, index2 );
						this.vertices.push( vertex.x, vertex.y, vertex.z );

					}

				}

			}

		}
		// build geometry
		this.position = new Float32BufferAttribute( this.vertices, 3 );
	}
	
}

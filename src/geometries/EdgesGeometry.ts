/**
 * @author WestLangley / http://github.com/WestLangley
 * @author Mugen87 / https://github.com/Mugen87
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Geometry } from '../core/Geometry';
import { _Math } from '../math/Math';
import { Vector3 } from '../math/Vector3';

export class EdgesGeometry extends BufferGeometry {
	type : string = 'EdgesGeometry';
	vertices : Array<number> = [];
	position : Float32BufferAttribute;
	constructor( geometry : Geometry | BufferGeometry, thresholdAngle? : number ){
		super();
		thresholdAngle = ( thresholdAngle !== undefined ) ? thresholdAngle : 1;
		this.parameters = {
			thresholdAngle: thresholdAngle
		};
	

	

		// buffer

		// helper variables

		let thresholdDot = Math.cos( _Math.DEG2RAD * thresholdAngle );
		let edge = [ 0, 0 ], edges = {}, edge1, edge2;
		let key, keys = [ 'a', 'b', 'c' ];

		// prepare source geometry

		let geometry2;

		if ( (geometry as BufferGeometry).isBufferGeometry ) {

			geometry2 = new Geometry();
			geometry2.fromBufferGeometry( geometry );

		} else {

			geometry2 = geometry.clone();

		}

		geometry2.mergeVertices();
		geometry2.computeFaceNormals();

		let sourceVertices = geometry2.vertices;
		let faces = geometry2.faces;

		// now create a data structure where each entry represents an edge with its adjoining faces

		for ( let i = 0, l = faces.length; i < l; i ++ ) {

			let face = faces[ i ];

			for ( let j = 0; j < 3; j ++ ) {

				edge1 = face[ keys[ j ] ];
				edge2 = face[ keys[ ( j + 1 ) % 3 ] ];
				edge[ 0 ] = Math.min( edge1, edge2 );
				edge[ 1 ] = Math.max( edge1, edge2 );

				key = edge[ 0 ] + ',' + edge[ 1 ];

				if ( edges[ key ] === undefined ) {

					edges[ key ] = { index1: edge[ 0 ], index2: edge[ 1 ], face1: i, face2: undefined };

				} else {

					edges[ key ].face2 = i;

				}

			}

		}

		// generate vertices

		for ( key in edges ) {

			let e = edges[ key ];

			// an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.

			if ( e.face2 === undefined || faces[ e.face1 ].normal.dot( faces[ e.face2 ].normal ) <= thresholdDot ) {

				let vertex = sourceVertices[ e.index1 ];
				this.vertices.push( vertex.x, vertex.y, vertex.z );

				vertex = sourceVertices[ e.index2 ];
				this.vertices.push( vertex.x, vertex.y, vertex.z );

			}

		}

		// build geometry
		this.position = new Float32BufferAttribute( this.vertices, 3 );

	}
}


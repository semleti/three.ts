/**
 * @author clockworkgeek / https://github.com/clockworkgeek
 * @author timothypratley / https://github.com/timothypratley
 * @author WestLangley / http://github.com/WestLangley
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';

// PolyhedronGeometry

export class PolyhedronGeometry extends Geometry {
	type : string = 'PolyhedronGeometry';
	constructor( vertices : Array<number>, indices : Array<number>, radius : number, detail : number ){
		super();
		this.parameters = {
			vertices: vertices,
			indices: indices,
			radius: radius,
			detail: detail
		};
	
		this.fromBufferGeometry( new PolyhedronBufferGeometry( vertices, indices, radius, detail ) );
		this.mergeVertices();
	}

}
// PolyhedronBufferGeometry

export class PolyhedronBufferGeometry extends BufferGeometry {
	type : string = 'PolyhedronBufferGeometry';
	// default buffer data
	vertexBuffer : Array<number> = [];
	uvBuffer : Array<number> = [];
	constructor( vertices : Array<number>, indices : Array<number>, radius? : number, detail? : number )
	{
		super();
		this.parameters = {
			vertices: vertices,
			indices: indices,
			radius: radius,
			detail: detail
		};
		radius = radius || 1;
		detail = detail || 0;
		// the subdivision creates the vertex buffer data

		this.subdivide( detail );

		// all vertices should lie on a conceptual sphere with a given radius

		this.appplyRadius( radius );

		// finally, create the uv data

		this.generateUVs();

		// build non-indexed geometry

		this.addAttribute( 'position', new Float32BufferAttribute( this.vertexBuffer, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( this.vertexBuffer.slice(), 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( this.uvBuffer, 2 ) );

		if ( detail === 0 ) {

			this.computeVertexNormals(); // flat normals

		} else {

			this.normalizeNormals(); // smooth normals

		}
	}



	

	

	// helper functions

	subdivide( detail : number ) : void {

		let a = new Vector3();
		let b = new Vector3();
		let c = new Vector3();

		// iterate over all faces and apply a subdivison with the given detail value

		for ( let i = 0; i < this.parameters.indices.length; i += 3 ) {

			// get the vertices of the face

			this.getVertexByIndex( this.parameters.indices[ i + 0 ], a );
			this.getVertexByIndex( this.parameters.indices[ i + 1 ], b );
			this.getVertexByIndex( this.parameters.indices[ i + 2 ], c );

			// perform subdivision

			this.subdivideFace( a, b, c, detail );

		}

	}

	subdivideFace( a : Vector3, b : Vector3, c : Vector3, detail : number ) : void {

		let cols = Math.pow( 2, detail );

		// we use this multidimensional array as a data structure for creating the subdivision

		let v = [];

		let i, j;

		// construct all of the vertices for this subdivision

		for ( i = 0; i <= cols; i ++ ) {

			v[ i ] = [];

			let aj = a.clone().lerp( c, i / cols );
			let bj = b.clone().lerp( c, i / cols );

			let rows = cols - i;

			for ( j = 0; j <= rows; j ++ ) {

				if ( j === 0 && i === cols ) {

					v[ i ][ j ] = aj;

				} else {

					v[ i ][ j ] = aj.clone().lerp( bj, j / rows );

				}

			}

		}

		// construct all of the faces

		for ( i = 0; i < cols; i ++ ) {

			for ( j = 0; j < 2 * ( cols - i ) - 1; j ++ ) {

				let k = Math.floor( j / 2 );

				if ( j % 2 === 0 ) {

					this.pushVertex( v[ i ][ k + 1 ] );
					this.pushVertex( v[ i + 1 ][ k ] );
					this.pushVertex( v[ i ][ k ] );

				} else {

					this.pushVertex( v[ i ][ k + 1 ] );
					this.pushVertex( v[ i + 1 ][ k + 1 ] );
					this.pushVertex( v[ i + 1 ][ k ] );

				}

			}

		}

	}

	appplyRadius( radius : number ) : void {

		let vertex = new Vector3();

		// iterate over the entire buffer and apply the radius to each vertex

		for ( let i = 0; i < this.vertexBuffer.length; i += 3 ) {

			vertex.x = this.vertexBuffer[ i + 0 ];
			vertex.y = this.vertexBuffer[ i + 1 ];
			vertex.z = this.vertexBuffer[ i + 2 ];

			vertex.normalize().multiplyScalar( radius );

			this.vertexBuffer[ i + 0 ] = vertex.x;
			this.vertexBuffer[ i + 1 ] = vertex.y;
			this.vertexBuffer[ i + 2 ] = vertex.z;

		}

	}

	generateUVs() : void {

		let vertex = new Vector3();

		for ( let i = 0; i < this.vertexBuffer.length; i += 3 ) {

			vertex.x = this.vertexBuffer[ i + 0 ];
			vertex.y = this.vertexBuffer[ i + 1 ];
			vertex.z = this.vertexBuffer[ i + 2 ];

			let u = this.azimuth( vertex ) / 2 / Math.PI + 0.5;
			let v = this.inclination( vertex ) / Math.PI + 0.5;
			this.uvBuffer.push( u, 1 - v );

		}

		this.correctUVs();

		this.correctSeam();

	}

	correctSeam() : void {

		// handle case when face straddles the seam, see #3269

		for ( let i = 0; i < this.uvBuffer.length; i += 6 ) {

			// uv data of a single face

			let x0 = this.uvBuffer[ i + 0 ];
			let x1 = this.uvBuffer[ i + 2 ];
			let x2 = this.uvBuffer[ i + 4 ];

			let max = Math.max( x0, x1, x2 );
			let min = Math.min( x0, x1, x2 );

			// 0.9 is somewhat arbitrary

			if ( max > 0.9 && min < 0.1 ) {

				if ( x0 < 0.2 ) this.uvBuffer[ i + 0 ] += 1;
				if ( x1 < 0.2 ) this.uvBuffer[ i + 2 ] += 1;
				if ( x2 < 0.2 ) this.uvBuffer[ i + 4 ] += 1;

			}

		}

	}

	pushVertex( vertex : Vector3 ) : void {

		this.vertexBuffer.push( vertex.x, vertex.y, vertex.z );

	}

	getVertexByIndex( index : number, vertex : Vector3 ) : void {

		let stride = index * 3;

		vertex.x = this.parameters.vertices[ stride + 0 ];
		vertex.y = this.parameters.vertices[ stride + 1 ];
		vertex.z = this.parameters.vertices[ stride + 2 ];

	}

	correctUVs() : void {

		let a = new Vector3();
		let b = new Vector3();
		let c = new Vector3();

		let centroid = new Vector3();

		let uvA = new Vector2();
		let uvB = new Vector2();
		let uvC = new Vector2();

		for ( let i = 0, j = 0; i < this.vertexBuffer.length; i += 9, j += 6 ) {

			a.set( this.vertexBuffer[ i + 0 ], this.vertexBuffer[ i + 1 ], this.vertexBuffer[ i + 2 ] );
			b.set( this.vertexBuffer[ i + 3 ], this.vertexBuffer[ i + 4 ], this.vertexBuffer[ i + 5 ] );
			c.set( this.vertexBuffer[ i + 6 ], this.vertexBuffer[ i + 7 ], this.vertexBuffer[ i + 8 ] );

			uvA.set( this.uvBuffer[ j + 0 ], this.uvBuffer[ j + 1 ] );
			uvB.set( this.uvBuffer[ j + 2 ], this.uvBuffer[ j + 3 ] );
			uvC.set( this.uvBuffer[ j + 4 ], this.uvBuffer[ j + 5 ] );

			centroid.copy( a ).add( b ).add( c ).divideScalar( 3 );

			let azi = this.azimuth( centroid );

			this.correctUV( uvA, j + 0, a, azi );
			this.correctUV( uvB, j + 2, b, azi );
			this.correctUV( uvC, j + 4, c, azi );

		}

	}

	correctUV( uv : Vector2, stride : number, vector : Vector3, azimuth : number ) : void {

		if ( ( azimuth < 0 ) && ( uv.x === 1 ) ) {

			this.uvBuffer[ stride ] = uv.x - 1;

		}

		if ( ( vector.x === 0 ) && ( vector.z === 0 ) ) {

			this.uvBuffer[ stride ] = azimuth / 2 / Math.PI + 0.5;

		}

	}

	// Angle around the Y axis, counter-clockwise when looking from above.

	azimuth( vector : Vector3 ) : number {

		return Math.atan2( vector.z, - vector.x );

	}


	// Angle above the XZ plane.

	inclination( vector : Vector3 ) : number {

		return Math.atan2( - vector.y, Math.sqrt( ( vector.x * vector.x ) + ( vector.z * vector.z ) ) );

	}

}

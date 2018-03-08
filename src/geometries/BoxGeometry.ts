/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';

// BoxGeometry

export class BoxGeometry extends Geometry {
	type : string = 'BoxGeometry';
	constructor( width : number, height : number, depth : number, widthSegments : number, heightSegments : number, depthSegments : number ){
		super();
		this.parameters = {
			width: width,
			height: height,
			depth: depth,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			depthSegments: depthSegments
		};
		this.fromBufferGeometry( new BoxBufferGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) );
		this.mergeVertices();
	}

}

// BoxBufferGeometry

export class BoxBufferGeometry extends BufferGeometry {
	type : string = 'BoxBufferGeometry';
	// buffers

	indices : Array<number> = [];
	vertices : Array<number> = [];
	normals : Array<number> = [];
	uvs : Array<number> = [];

	// helper variables

	numberOfVertices : number = 0;
	groupStart : number = 0;
	constructor( width? : number, height? : number, depth? : number, widthSegments? : number, heightSegments? : number,
		 depthSegments? : number ){
		super();
		this.parameters = {
			width: width,
			height: height,
			depth: depth,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			depthSegments: depthSegments
		};
	
		width = width || 1;
		height = height || 1;
		depth = depth || 1;
	
		// segments
	
		widthSegments = Math.floor( widthSegments ) || 1;
		heightSegments = Math.floor( heightSegments ) || 1;
		depthSegments = Math.floor( depthSegments ) || 1;
		
		// build each side of the box geometry
		this.buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height, width, depthSegments, heightSegments, 0 ); // px
		this.buildPlane( 'z', 'y', 'x', 1, - 1, depth, height, - width, depthSegments, heightSegments, 1 ); // nx
		this.buildPlane( 'x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2 ); // py
		this.buildPlane( 'x', 'z', 'y', 1, - 1, width, depth, - height, widthSegments, depthSegments, 3 ); // ny
		this.buildPlane( 'x', 'y', 'z', 1, - 1, width, height, depth, widthSegments, heightSegments, 4 ); // pz
		this.buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth, widthSegments, heightSegments, 5 ); // nz

		// build geometry
		this.setIndex( this.indices );
		this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );
	}

	buildPlane( u : string, v : string, w : string, udir : number, vdir : number, width : number, height : number, depth : number,
		 gridX : number, gridY : number, materialIndex : number ) : void {

		let segmentWidth = width / gridX;
		let segmentHeight = height / gridY;

		let widthHalf = width / 2;
		let heightHalf = height / 2;
		let depthHalf = depth / 2;

		let gridX1 = gridX + 1;
		let gridY1 = gridY + 1;

		let vertexCounter = 0;
		let groupCount = 0;

		let ix, iy;

		let vector = new Vector3();

		// generate vertices, normals and uvs

		for ( iy = 0; iy < gridY1; iy ++ ) {

			let y = iy * segmentHeight - heightHalf;

			for ( ix = 0; ix < gridX1; ix ++ ) {

				let x = ix * segmentWidth - widthHalf;

				// set values to correct vector component

				vector[ u ] = x * udir;
				vector[ v ] = y * vdir;
				vector[ w ] = depthHalf;

				// now apply vector to vertex buffer

				this.vertices.push( vector.x, vector.y, vector.z );

				// set values to correct vector component

				vector[ u ] = 0;
				vector[ v ] = 0;
				vector[ w ] = depth > 0 ? 1 : - 1;

				// now apply vector to normal buffer

				this.normals.push( vector.x, vector.y, vector.z );

				// uvs

				this.uvs.push( ix / gridX );
				this.uvs.push( 1 - ( iy / gridY ) );

				// counters

				vertexCounter += 1;

			}

		}

		// indices

		// 1. you need three indices to draw a single face
		// 2. a single segment consists of two faces
		// 3. so we need to generate six (2*3) indices per segment

		for ( iy = 0; iy < gridY; iy ++ ) {

			for ( ix = 0; ix < gridX; ix ++ ) {

				let a = this.numberOfVertices + ix + gridX1 * iy;
				let b = this.numberOfVertices + ix + gridX1 * ( iy + 1 );
				let c = this.numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
				let d = this.numberOfVertices + ( ix + 1 ) + gridX1 * iy;

				// faces

				this.indices.push( a, b, d );
				this.indices.push( b, c, d );

				// increase counter

				groupCount += 6;

			}

		}

		// add a group to the geometry. this will ensure multi material support

		this.addGroup( this.groupStart, groupCount, materialIndex );

		// calculate new start value for groups

		this.groupStart += groupCount;

		// update total number of vertices

		this.numberOfVertices += vertexCounter;

	}

}

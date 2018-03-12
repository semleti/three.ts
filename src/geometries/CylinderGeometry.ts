/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';

// CylinderGeometry

export class CylinderGeometry extends Geometry {
	type : string = 'CylinderGeometry';
	constructor( radiusTop : number, radiusBottom : number, height : number, radialSegments : number, heightSegments : number,
		 openEnded : boolean, thetaStart : number, thetaLength : number )
	{
		super();
		this.parameters = {
			radiusTop: radiusTop,
			radiusBottom: radiusBottom,
			height: height,
			radialSegments: radialSegments,
			heightSegments: heightSegments,
			openEnded: openEnded,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
		this.fromBufferGeometry( new CylinderBufferGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) );
	this.mergeVertices();
	}

}


// CylinderBufferGeometry

export class CylinderBufferGeometry extends BufferGeometry {
	type : string = 'CylinderBufferGeometry';
	// buffers
	indices : Array<number> = [];
	vertices : Array<number> = [];
	normals : Array<number> = [];
	uvs : Array<number> = [];
	indx : number = 0;
	indexArray : Array<Array<number>> = [];
	groupStart : number = 0;
	halfHeight : number;
	constructor( radiusTop : number = 1, radiusBottom : number = 1, height : number = 1, radialSegments : number = 8,
		heightSegments : number = 1, openEnded : boolean = false, thetaStart : number = 0, thetaLength : number =  Math.PI * 2 )
	{
		super();

		radialSegments = Math.floor( radialSegments );
		heightSegments = Math.floor( heightSegments );

		this.parameters = {
			radiusTop: radiusTop,
			radiusBottom: radiusBottom,
			height: height,
			radialSegments: radialSegments,
			heightSegments: heightSegments,
			openEnded: openEnded,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
		// helper variables

		
		this.halfHeight = height / 2;

		// generate geometry

		this.generateTorso();

		if ( openEnded === false ) {

			if ( radiusTop > 0 ) this.generateCap( true );
			if ( radiusBottom > 0 ) this.generateCap( false );

		}

		// build geometry

		this.setIndex( this.indices );
		this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );
	}

	clone() : CylinderBufferGeometry {
		return new CylinderBufferGeometry( this.parameters.radiusTop, this.parameters.radiusBottom, this.parameters.height, this.parameters.radialSegments, this.parameters.heightSegments,
			this.parameters.openEnded, this.parameters.thetaStart, this.parameters.thetaLength ).copy(this);
	}

	copy( source : CylinderBufferGeometry) : CylinderBufferGeometry {
		super.copy(source);
		this.indices = source.indices;
		this.vertices = source.vertices;
		return this;
	}
	

	

	

	generateTorso() : void {

		let x, y;
		let normal = new Vector3();
		let vertex = new Vector3();

		let groupCount = 0;

		// this will be used to calculate the normal
		let slope = ( this.parameters.radiusBottom - this.parameters.radiusTop ) / this.parameters.height;

		// generate vertices, normals and uvs

		for ( y = 0; y <= this.parameters.heightSegments; y ++ ) {

			let indexRow = [];

			let v = y / this.parameters.heightSegments;

			// calculate the radius of the current row

			let radius = v * ( this.parameters.radiusBottom - this.parameters.radiusTop ) + this.parameters.radiusTop;

			for ( x = 0; x <= this.parameters.radialSegments; x ++ ) {

				let u = x / this.parameters.radialSegments;

				let theta = u * this.parameters.thetaLength + this.parameters.thetaStart;

				let sinTheta = Math.sin( theta );
				let cosTheta = Math.cos( theta );

				// vertex

				vertex.x = radius * sinTheta;
				vertex.y = - v * this.parameters.height + this.halfHeight;
				vertex.z = radius * cosTheta;
				
				this.vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				normal.set( sinTheta, slope, cosTheta ).normalize();
				this.normals.push( normal.x, normal.y, normal.z );

				// uv

				this.uvs.push( u, 1 - v );

				// save index of vertex in respective row

				indexRow.push( this.indx ++ );

			}

			// now save vertices of the row in our index array

			this.indexArray.push( indexRow );

		}

		// generate indices

		for ( x = 0; x < this.parameters.radialSegments; x ++ ) {

			for ( y = 0; y < this.parameters.heightSegments; y ++ ) {

				// we use the index array to access the correct indices

				let a = this.indexArray[ y ][ x ];
				let b = this.indexArray[ y + 1 ][ x ];
				let c = this.indexArray[ y + 1 ][ x + 1 ];
				let d = this.indexArray[ y ][ x + 1 ];

				// faces

				this.indices.push( a, b, d );
				this.indices.push( b, c, d );

				// update group counter

				groupCount += 6;

			}

		}

		// add a group to the geometry. this will ensure multi material support

		this.addGroup( this.groupStart, groupCount, 0 );

		// calculate new start value for groups

		this.groupStart += groupCount;

	}

	generateCap( top : boolean ) : void {

		let x, centerIndexStart, centerIndexEnd;

		let uv = new Vector2();
		let vertex = new Vector3();

		let groupCount = 0;

		let radius = ( top === true ) ? this.parameters.radiusTop : this.parameters.radiusBottom;
		let sign = ( top === true ) ? 1 : - 1;

		// save the index of the first center vertex
		centerIndexStart = this.index;

		// first we generate the center vertex data of the cap.
		// because the geometry needs one set of uvs per face,
		// we must generate a center vertex per face/segment

		for ( x = 1; x <= this.parameters.radialSegments; x ++ ) {

			// vertex

			this.vertices.push( 0, this.halfHeight * sign, 0 );

			// normal

			this.normals.push( 0, sign, 0 );

			// uv

			this.uvs.push( 0.5, 0.5 );

			// increase index

			this.indx ++;

		}

		// save the index of the last center vertex

		centerIndexEnd = this.index;

		// now we generate the surrounding vertices, normals and uvs

		for ( x = 0; x <= this.parameters.radialSegments; x ++ ) {

			let u = x / this.parameters.radialSegments;
			let theta = u * this.parameters.thetaLength + this.parameters.thetaStart;

			let cosTheta = Math.cos( theta );
			let sinTheta = Math.sin( theta );

			// vertex

			vertex.x = radius * sinTheta;
			vertex.y = this.halfHeight * sign;
			vertex.z = radius * cosTheta;
			this.vertices.push( vertex.x, vertex.y, vertex.z );

			// normal

			this.normals.push( 0, sign, 0 );

			// uv

			uv.x = ( cosTheta * 0.5 ) + 0.5;
			uv.y = ( sinTheta * 0.5 * sign ) + 0.5;
			this.uvs.push( uv.x, uv.y );

			// increase index

			this.indx ++;

		}

		// generate indices

		for ( x = 0; x < this.parameters.radialSegments; x ++ ) {

			let c = centerIndexStart + x;
			let i = centerIndexEnd + x;

			if ( top === true ) {

				// face top

				this.indices.push( i, i + 1, c );

			} else {

				// face bottom

				this.indices.push( i + 1, i, c );

			}

			groupCount += 3;

		}

		// add a group to the geometry. this will ensure multi material support

		this.addGroup( this.groupStart, groupCount, top === true ? 1 : 2 );

		// calculate new start value for groups

		this.groupStart += groupCount;

	}

}
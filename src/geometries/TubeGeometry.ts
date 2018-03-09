/**
 * @author oosmoxiecode / https://github.com/oosmoxiecode
 * @author WestLangley / https://github.com/WestLangley
 * @author zz85 / https://github.com/zz85
 * @author miningold / https://github.com/miningold
 * @author jonobr1 / https://github.com/jonobr1
 * @author Mugen87 / https://github.com/Mugen87
 *
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Path } from '../extras/core/Path';

// TubeGeometry

export class TubeGeometry extends Geometry {

	type : string = 'TubeGeometry';
	tangents : Array<Vector3>;
	normals : Array<number>;
	binormals : Array<Vector3>;
	constructor( path : Path, tubularSegments : number, radius : number, radialSegments : number, closed : boolean, taper? ){
		super();
		this.parameters = {
			path: path,
			tubularSegments: tubularSegments,
			radius: radius,
			radialSegments: radialSegments,
			closed: closed
		};
	
		if ( taper !== undefined ) console.warn( 'THREE.TubeGeometry: taper has been removed.' );
	
		let bufferGeometry = new TubeBufferGeometry( path, tubularSegments, radius, radialSegments, closed );
	
		// expose internals
	
		this.tangents = bufferGeometry.tangents;
		this.normals = bufferGeometry.normals;
		this.binormals = bufferGeometry.binormals;
	
		// create geometry
	
		this.fromBufferGeometry( bufferGeometry );
		this.mergeVertices();
	}

	clone() : TubeGeometry {
		return new TubeGeometry(this.parameters.path,this.parameters.tubularSegments,this.parameters.radius,this.parameters.radialSegments,this.parameters.closed).copy(this);
	}

	copy( source : TubeGeometry) : TubeGeometry {
		super.copy(source);
		this.tangents = source.tangents;
		return this;
	}

}

// TubeBufferGeometry

export class TubeBufferGeometry extends BufferGeometry {

	type : string = 'TubeBufferGeometry';
	tangents : Array<Vector3>;
	binormals : Array<Vector3>;
	frames : any;
	vertices : Array<number> = [];
	normals : Array<number> = [];
	uvs : Array<number> = [];
	indices : Array<number> = [];
	closed: boolean;
	constructor( path : Path, tubularSegments? : number, radius? : number, radialSegments? : number, closed? : boolean ){
		super();

		//TODO: check order of parameters/default value setting
		this.parameters = {
			path: path,
			tubularSegments: tubularSegments,
			radius: radius,
			radialSegments: radialSegments,
			closed: closed
		};
	
		tubularSegments = tubularSegments || 64;
		radius = radius || 1;
		radialSegments = radialSegments || 8;
		this.closed = closed || false;
	
		this.frames = path.computeFrenetFrames( tubularSegments, this.closed );
	
		// expose internals
	
		this.tangents = this.frames.tangents;
		this.normals = this.frames.normals;
		this.binormals = this.frames.binormals;

	
		// buffer
	
		
	
		// create buffer data
	
		this.generateBufferData();
	
		// build geometry
	
		this.setIndex( this.indices );
		this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );
	}

	clone() : TubeBufferGeometry {
		return new TubeBufferGeometry(this.parameters.path,this.parameters.tubularSegments,this.parameters.radius,this.parameters.radialSegments,this.parameters.closed).copy(this);
	}

	copy( source : TubeBufferGeometry) : TubeBufferGeometry {
		super.copy(source);
		this.tangents = source.tangents;
		return this;
	}

	

	// functions

	generateBufferData() : void {

		for ( let i = 0; i < this.parameters.tubularSegments; i ++ ) {

			this.generateSegment( i );

		}

		// if the geometry is not closed, generate the last row of vertices and normals
		// at the regular position on the given path
		//
		// if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

		this.generateSegment( ( this.closed === false ) ? this.parameters.tubularSegments : 0 );

		// uvs are generated in a separate function.
		// this makes it easy compute correct values for closed geometries

		this.generateUVs();

		// finally create faces

		this.generateIndices();

	}

	generateSegment( i : number ) : void {
		
		// helper variables
	
		let vertex = new Vector3();
		let normal = new Vector3();
		let P = new Vector3();

		// we use getPointAt to sample evenly distributed points from the given path

		P = this.parameters.path.getPointAt( i / this.parameters.tubularSegments, P );

		// retrieve corresponding normal and binormal

		let N = this.frames.normals[ i ];
		let B = this.frames.binormals[ i ];
	


		// generate normals and vertices for the current segment

		for ( let j = 0; j <= this.parameters.radialSegments; j ++ ) {

			let v = j / this.parameters.radialSegments * Math.PI * 2;

			let sin = Math.sin( v );
			let cos = - Math.cos( v );

			// normal

			normal.x = ( cos * N.x + sin * B.x );
			normal.y = ( cos * N.y + sin * B.y );
			normal.z = ( cos * N.z + sin * B.z );
			normal.normalize();

			this.normals.push( normal.x, normal.y, normal.z );

			// vertex

			vertex.x = P.x + this.parameters.radius * normal.x;
			vertex.y = P.y + this.parameters.radius * normal.y;
			vertex.z = P.z + this.parameters.radius * normal.z;

			this.vertices.push( vertex.x, vertex.y, vertex.z );

		}

	}

	generateIndices() : void {

		for ( let j = 1; j <= this.parameters.tubularSegments; j ++ ) {

			for ( let i = 1; i <= this.parameters.radialSegments; i ++ ) {

				let a = ( this.parameters.radialSegments + 1 ) * ( j - 1 ) + ( i - 1 );
				let b = ( this.parameters.radialSegments + 1 ) * j + ( i - 1 );
				let c = ( this.parameters.radialSegments + 1 ) * j + i;
				let d = ( this.parameters.radialSegments + 1 ) * ( j - 1 ) + i;

				// faces

				this.indices.push( a, b, d );
				this.indices.push( b, c, d );

			}

		}

	}

	generateUVs() : void {

		let uv = new Vector2();
		for ( let i = 0; i <= this.parameters.tubularSegments; i ++ ) {

			for ( let j = 0; j <= this.parameters.radialSegments; j ++ ) {

				uv.x = i / this.parameters.tubularSegments;
				uv.y = j / this.parameters.radialSegments;

				this.uvs.push( uv.x, uv.y );

			}

		}

	}

}
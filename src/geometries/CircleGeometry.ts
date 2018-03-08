/**
 * @author benaadams / https://twitter.com/ben_a_adams
 * @author Mugen87 / https://github.com/Mugen87
 * @author hughes
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';

// CircleGeometry

export class CircleGeometry extends Geometry {
	type : string = 'CircleGeometry';
	constructor( radius : number, segments : number, thetaStart : number, thetaLength : number ){
		super();
		this.parameters = {
			radius: radius,
			segments: segments,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
	
		this.fromBufferGeometry( new CircleBufferGeometry( radius, segments, thetaStart, thetaLength ) );
		this.mergeVertices();
	}

}

export class CircleBufferGeometry extends BufferGeometry {
	type : string = 'CircleBufferGeometry';
	// buffers
	indices : Array<number> = [];
	vertices : Array<number> = [];
	normals : Array<number> = [];
	uvs : Array<number> = [];
	constructor( radius : number, segments : number, thetaStart : number, thetaLength : number ){
		super();
		this.parameters = {
			radius: radius,
			segments: segments,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
	
		radius = radius || 1;
		segments = segments !== undefined ? Math.max( 3, segments ) : 8;
	
		thetaStart = thetaStart !== undefined ? thetaStart : 0;
		thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

		// helper variables

		let i, s;
		let vertex = new Vector3();
		let uv = new Vector2();

		this.vertices.push( 0, 0, 0 );
		this.normals.push( 0, 0, 1 );
		this.uvs.push( 0.5, 0.5 );

	for ( s = 0, i = 3; s <= segments; s ++, i += 3 ) {

		let segment = thetaStart + s / segments * thetaLength;

		// vertex

		vertex.x = radius * Math.cos( segment );
		vertex.y = radius * Math.sin( segment );

		this.vertices.push( vertex.x, vertex.y, vertex.z );

		// normal

		this.normals.push( 0, 0, 1 );

		// uvs

		uv.x = ( this.vertices[ i ] / radius + 1 ) / 2;
		uv.y = ( this.vertices[ i + 1 ] / radius + 1 ) / 2;

		this.uvs.push( uv.x, uv.y );

	}

	// indices

	for ( i = 1; i <= segments; i ++ ) {

		this.indices.push( i, i + 1, 0 );

	}

	// build geometry

	this.setIndex( this.indices );
	this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute(this.uvs, 2 ) );
	}
	

}


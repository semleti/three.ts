/**
 * @author oosmoxiecode
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';

// TorusGeometry

export class TorusGeometry extends Geometry {

	type : string = 'TorusGeometry';
	constructor( radius : number, tube : number, radialSegments : number, tubularSegments : number, arc : number ){
		super();
		this.parameters = {
			radius: radius,
			tube: tube,
			radialSegments: radialSegments,
			tubularSegments: tubularSegments,
			arc: arc
		};
	
		this.fromBufferGeometry( new TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc ) );
		this.mergeVertices();
	}

}

// TorusBufferGeometry

export class TorusBufferGeometry extends BufferGeometry {

	type : string = 'TorusBufferGeometry';
	// buffers
	
	indices : Array<number> = [];
	vertices : Array<number> = [];
	normals : Array<number> = [];
	uvs : Array<number> = [];
	constructor( radius : number, tube : number, radialSegments : number, tubularSegments : number, arc : number ){
		super();
		this.parameters = {
			radius: radius,
			tube: tube,
			radialSegments: radialSegments,
			tubularSegments: tubularSegments,
			arc: arc
		};
	
		radius = radius || 1;
		tube = tube || 0.4;
		radialSegments = Math.floor( radialSegments ) || 8;
		tubularSegments = Math.floor( tubularSegments ) || 6;
		arc = arc || Math.PI * 2;
	
		// helper variables
	
		let center = new Vector3();
		let vertex = new Vector3();
		let normal = new Vector3();
	
		let j, i;
	
		// generate vertices, normals and uvs
	
		for ( j = 0; j <= radialSegments; j ++ ) {
	
			for ( i = 0; i <= tubularSegments; i ++ ) {
	
				let u = i / tubularSegments * arc;
				let v = j / radialSegments * Math.PI * 2;
	
				// vertex
	
				vertex.x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
				vertex.y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
				vertex.z = tube * Math.sin( v );
	
				this.vertices.push( vertex.x, vertex.y, vertex.z );
	
				// normal
	
				center.x = radius * Math.cos( u );
				center.y = radius * Math.sin( u );
				normal.subVectors( vertex, center ).normalize();
	
				this.normals.push( normal.x, normal.y, normal.z );
	
				// uv
	
				this.uvs.push( i / tubularSegments );
				this.uvs.push( j / radialSegments );
	
			}
	
		}
	
		// generate indices
	
		for ( j = 1; j <= radialSegments; j ++ ) {
	
			for ( i = 1; i <= tubularSegments; i ++ ) {
	
				// indices
	
				let a = ( tubularSegments + 1 ) * j + i - 1;
				let b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
				let c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
				let d = ( tubularSegments + 1 ) * j + i;
	
				// faces
	
				this.indices.push( a, b, d );
				this.indices.push( b, c, d );
	
			}
	
		}
	
		// build geometry
	
		this.setIndex( this.indices );
		this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );
	}

	clone() : TorusBufferGeometry {
		return new TorusBufferGeometry(this.parameters.radius,this.parameters.tube,this.parameters.radialSegments,this.parameters.tubularSegments,this.parameters.arc).copy(this);
	}

	copy( source : TorusBufferGeometry) : TorusBufferGeometry {
		super.copy(source);
		return this;
	}

}

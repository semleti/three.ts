/**
 * @author mrdoob / http://mrdoob.com/
 * @author benaadams / https://twitter.com/ben_a_adams
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';

// SphereGeometry

export class SphereGeometry extends Geometry {
	type : string = 'SphereGeometry';
	constructor( radius : number, widthSegments : number, heightSegments : number, phiStart : number, phiLength : number, thetaStart : number, thetaLength : number ){
		super();
		this.parameters = {
			radius: radius,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: phiStart,
			phiLength: phiLength,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
	
		this.fromBufferGeometry( new SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) );
		this.mergeVertices();
	}

}


// SphereBufferGeometry

export class SphereBufferGeometry extends BufferGeometry {

	type : string = 'SphereBufferGeometry';
	constructor( radius? : number, widthSegments? : number, heightSegments? : number, phiStart? : number, phiLength? : number, thetaStart? : number, thetaLength? : number ){
		super();
		this.parameters = {
			radius: radius,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: phiStart,
			phiLength: phiLength,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
	
		radius = radius || 1;
	
		widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
		heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );
	
		phiStart = phiStart !== undefined ? phiStart : 0;
		phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;
	
		thetaStart = thetaStart !== undefined ? thetaStart : 0;
		thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;
	
		let thetaEnd = thetaStart + thetaLength;
	
		let ix, iy;
	
		let index = 0;
		let grid = [];
	
		let vertex = new Vector3();
		let normal = new Vector3();
	
		// buffers
	
		let indices = [];
		let vertices = [];
		let normals = [];
		let uvs = [];
	
		// generate vertices, normals and uvs
	
		for ( iy = 0; iy <= heightSegments; iy ++ ) {
	
			let verticesRow = [];
	
			let v = iy / heightSegments;
	
			for ( ix = 0; ix <= widthSegments; ix ++ ) {
	
				let u = ix / widthSegments;
	
				// vertex
	
				vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
				vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
				vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
	
				vertices.push( vertex.x, vertex.y, vertex.z );
	
				// normal
	
				normal.set( vertex.x, vertex.y, vertex.z ).normalize();
				normals.push( normal.x, normal.y, normal.z );
	
				// uv
	
				uvs.push( u, 1 - v );
	
				verticesRow.push( index ++ );
	
			}
	
			grid.push( verticesRow );
	
		}
	
		// indices
	
		for ( iy = 0; iy < heightSegments; iy ++ ) {
	
			for ( ix = 0; ix < widthSegments; ix ++ ) {
	
				let a = grid[ iy ][ ix + 1 ];
				let b = grid[ iy ][ ix ];
				let c = grid[ iy + 1 ][ ix ];
				let d = grid[ iy + 1 ][ ix + 1 ];
	
				if ( iy !== 0 || thetaStart > 0 ) indices.push( a, b, d );
				if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( b, c, d );
	
			}
	
		}
	
		// build geometry
	
		this.setIndex( indices );
		this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
	}

	

}
/**
 * @author Kaleb Murphy
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

// RingGeometry

export class RingGeometry extends Geometry {

	type : string = 'RingGeometry';
	constructor( innerRadius : number, outerRadius : number, thetaSegments : number, phiSegments : number, thetaStart : number, thetaLength : number ){
		super();
		this.parameters = {
			innerRadius: innerRadius,
			outerRadius: outerRadius,
			thetaSegments: thetaSegments,
			phiSegments: phiSegments,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
	
		this.fromBufferGeometry( new RingBufferGeometry( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) );
		this.mergeVertices();
	}

}

// RingBufferGeometry

export class RingBufferGeometry extends BufferGeometry {
	
	type : string = 'RingBufferGeometry';
	constructor( innerRadius : number = 0.5, outerRadius : number = 1, thetaSegments : number = 8, phiSegments : number = 1,
		 thetaStart : number = 0, thetaLength : number = Math.PI * 2 ){
		super();

		this.parameters = {
			innerRadius: innerRadius,
			outerRadius: outerRadius,
			thetaSegments: thetaSegments,
			phiSegments: phiSegments,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
	
		thetaSegments = Math.max( 3, thetaSegments );
		phiSegments = Math.max( 1, phiSegments );
	
		// buffers
	
		let indices : Array<number> = [];
		let vertices : Array<number> = [];
		let normals : Array<number> = [];
		let uvs : Array<number> = [];
	
		// some helper variables
	
		let segment;
		let radius = innerRadius;
		let radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );
		let vertex = new Vector3();
		let uv = new Vector2();
		let j, i;
	
		// generate vertices, normals and uvs
	
		for ( j = 0; j <= phiSegments; j ++ ) {
	
			for ( i = 0; i <= thetaSegments; i ++ ) {
	
				// values are generate from the inside of the ring to the outside
	
				segment = thetaStart + i / thetaSegments * thetaLength;
	
				// vertex
	
				vertex.x = radius * Math.cos( segment );
				vertex.y = radius * Math.sin( segment );
	
				vertices.push( vertex.x, vertex.y, vertex.z );
	
				// normal
	
				normals.push( 0, 0, 1 );
	
				// uv
	
				uv.x = ( vertex.x / outerRadius + 1 ) / 2;
				uv.y = ( vertex.y / outerRadius + 1 ) / 2;
	
				uvs.push( uv.x, uv.y );
	
			}
	
			// increase the radius for next row of vertices
	
			radius += radiusStep;
	
		}
	
		// indices
	
		for ( j = 0; j < phiSegments; j ++ ) {
	
			let thetaSegmentLevel = j * ( thetaSegments + 1 );
	
			for ( i = 0; i < thetaSegments; i ++ ) {
	
				segment = i + thetaSegmentLevel;
	
				let a = segment;
				let b = segment + thetaSegments + 1;
				let c = segment + thetaSegments + 2;
				let d = segment + 1;
	
				// faces
	
				indices.push( a, b, d );
				indices.push( b, c, d );
	
			}
	
		}
	
		// build geometry
	
		this.setIndex( indices );
		this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
	}


}

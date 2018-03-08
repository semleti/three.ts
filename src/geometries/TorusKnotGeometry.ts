/**
 * @author oosmoxiecode
 * @author Mugen87 / https://github.com/Mugen87
 *
 * based on http://www.blackpawn.com/texts/pqtorus/
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';

// TorusKnotGeometry

export class TorusKnotGeometry extends Geometry {

	type : string = 'TorusKnotGeometry';
	constructor( radius : number, tube : number, tubularSegments : number, radialSegments : number, p : number, q : number, heightScale : number ){
		super();
		this.parameters = {
			radius: radius,
			tube: tube,
			tubularSegments: tubularSegments,
			radialSegments: radialSegments,
			p: p,
			q: q
		};
	
		if ( heightScale !== undefined ) console.warn( 'THREE.TorusKnotGeometry: heightScale has been deprecated. Use .scale( x, y, z ) instead.' );
	
		this.fromBufferGeometry( new TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments, p, q ) );
		this.mergeVertices();
	}

}

// TorusKnotBufferGeometry

export class TorusKnotBufferGeometry extends BufferGeometry {

	type : string = 'TorusKnotBufferGeometry';// buffers
	
	indices : Array<number> = [];
	vertices : Array<number> = [];
	normals : Array<number> = [];
	uvs : Array<number> = [];
	constructor( radius : number, tube : number, tubularSegments : number, radialSegments : number, p : number, q : number ){
		super();
		this.parameters = {
			radius: radius,
			tube: tube,
			tubularSegments: tubularSegments,
			radialSegments: radialSegments,
			p: p,
			q: q
		};
	
		radius = radius || 1;
		tube = tube || 0.4;
		tubularSegments = Math.floor( tubularSegments ) || 64;
		radialSegments = Math.floor( radialSegments ) || 8;
		p = p || 2;
		q = q || 3;
	
		
	
		// helper variables
	
		let i, j;
	
		let vertex = new Vector3();
		let normal = new Vector3();
	
		let P1 = new Vector3();
		let P2 = new Vector3();
	
		let B = new Vector3();
		let T = new Vector3();
		let N = new Vector3();
	
		// generate vertices, normals and uvs
	
		for ( i = 0; i <= tubularSegments; ++ i ) {
	
			// the radian "u" is used to calculate the position on the torus curve of the current tubular segement
	
			let u = i / tubularSegments * p * Math.PI * 2;
	
			// now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
			// these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions
	
			this.calculatePositionOnCurve( u, p, q, radius, P1 );
			this.calculatePositionOnCurve( u + 0.01, p, q, radius, P2 );
	
			// calculate orthonormal basis
	
			T.subVectors( P2, P1 );
			N.addVectors( P2, P1 );
			B.crossVectors( T, N );
			N.crossVectors( B, T );
	
			// normalize B, N. T can be ignored, we don't use it
	
			B.normalize();
			N.normalize();
	
			for ( j = 0; j <= radialSegments; ++ j ) {
	
				// now calculate the vertices. they are nothing more than an extrusion of the torus curve.
				// because we extrude a shape in the xy-plane, there is no need to calculate a z-value.
	
				let v = j / radialSegments * Math.PI * 2;
				let cx = - tube * Math.cos( v );
				let cy = tube * Math.sin( v );
	
				// now calculate the final vertex position.
				// first we orient the extrusion with our basis vectos, then we add it to the current position on the curve
	
				vertex.x = P1.x + ( cx * N.x + cy * B.x );
				vertex.y = P1.y + ( cx * N.y + cy * B.y );
				vertex.z = P1.z + ( cx * N.z + cy * B.z );
	
				this.vertices.push( vertex.x, vertex.y, vertex.z );
	
				// normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)
	
				normal.subVectors( vertex, P1 ).normalize();
	
				this.normals.push( normal.x, normal.y, normal.z );
	
				// uv
	
				this.uvs.push( i / tubularSegments );
				this.uvs.push( j / radialSegments );
	
			}
	
		}
	
		// generate indices
	
		for ( j = 1; j <= tubularSegments; j ++ ) {
	
			for ( i = 1; i <= radialSegments; i ++ ) {
	
				// indices
	
				let a = ( radialSegments + 1 ) * ( j - 1 ) + ( i - 1 );
				let b = ( radialSegments + 1 ) * j + ( i - 1 );
				let c = ( radialSegments + 1 ) * j + i;
				let d = ( radialSegments + 1 ) * ( j - 1 ) + i;
	
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

	

	// this function calculates the current position on the torus curve

	calculatePositionOnCurve( u : number, p : number, q : number, radius : number, position : Vector3 ) {

		let cu = Math.cos( u );
		let su = Math.sin( u );
		let quOverP = q / p * u;
		let cs = Math.cos( quOverP );

		position.x = radius * ( 2 + cs ) * 0.5 * cu;
		position.y = radius * ( 2 + cs ) * su * 0.5;
		position.z = radius * Math.sin( quOverP ) * 0.5;

	}

}


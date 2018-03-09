/**
 * @author zz85 / https://github.com/zz85
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';

// ParametricGeometry

export class ParametricGeometry extends Geometry {

	type : string = 'ParametricGeometry';
	constructor( func : Function, slices : number, stacks : number ){
		super();
		this.parameters = {
			func: func,
			slices: slices,
			stacks: stacks
		};
	
		this.fromBufferGeometry( new ParametricBufferGeometry( func, slices, stacks ) );
		this.mergeVertices();
	}

}


// ParametricBufferGeometry

export class ParametricBufferGeometry extends BufferGeometry {
	
	type : string = 'ParametricBufferGeometry';
	indices : Array<number> = [];
	vertices : Array<number> = [];
	normals : Array<number> = [];
	uvs : Array<number> = [];
	static EPS : number = 0.00001;
	normal : Vector3 = new Vector3();

	p0 : Vector3 = new Vector3();
	p1 : Vector3 = new Vector3();
	pu : Vector3 = new Vector3();
	pv : Vector3 = new Vector3();
	constructor( func : Function, slices : number, stacks : number ){
		super();
		this.parameters = {
			func: func,
			slices: slices,
			stacks: stacks
		};
		// buffers

		let i, j;

		// generate vertices, normals and uvs

		let sliceCount = slices + 1;

		for ( i = 0; i <= stacks; i ++ ) {

			let v = i / stacks;

			for ( j = 0; j <= slices; j ++ ) {

				let u = j / slices;

				// vertex

				this.p0 = func( u, v, this.p0 );
				this.vertices.push( this.p0.x, this.p0.y, this.p0.z );

				// normal

				// approximate tangent vectors via finite differences

				if ( u - ParametricBufferGeometry.EPS >= 0 ) {

					this.p1 = func( u - ParametricBufferGeometry.EPS, v, this.p1 );
					this.pu.subVectors( this.p0, this.p1 );

				} else {

					this.p1 = func( u + ParametricBufferGeometry.EPS, v, this.p1 );
					this.pu.subVectors( this.p1, this.p0 );

				}

				if ( v - ParametricBufferGeometry.EPS >= 0 ) {

					this.p1 = func( u, v - ParametricBufferGeometry.EPS, this.p1 );
					this.pv.subVectors( this.p0, this.p1 );

				} else {

					this.p1 = func( u, v + ParametricBufferGeometry.EPS, this.p1 );
					this.pv.subVectors( this.p1, this.p0 );

				}

				// cross product of tangent vectors returns surface normal

				this.normal.crossVectors( this.pu, this.pv ).normalize();
				this.normals.push( this.normal.x, this.normal.y, this.normal.z );

				// uv

				this.uvs.push( u, v );

			}

		}

		// generate indices

		for ( i = 0; i < stacks; i ++ ) {

			for ( j = 0; j < slices; j ++ ) {

				let a = i * sliceCount + j;
				let b = i * sliceCount + j + 1;
				let c = ( i + 1 ) * sliceCount + j + 1;
				let d = ( i + 1 ) * sliceCount + j;

				// faces one and two

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

	clone() : ParametricBufferGeometry {
		return new ParametricBufferGeometry(this.parameters.func,this.parameters.slices,this.parameters.stacks).copy(this);
	}

	copy( source : ParametricBufferGeometry) : ParametricBufferGeometry {
		super.copy(source);
		this.vertices = source.vertices;
		this.indices = source.indices;
		return this;
	}

}

	
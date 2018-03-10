/**
 * @author timothypratley / https://github.com/timothypratley
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { PolyhedronBufferGeometry } from './PolyhedronGeometry';

// IcosahedronGeometry

export class IcosahedronGeometry extends Geometry {
	type : string = 'IcosahedronGeometry';
	constructor( radius : number, detail : number ){
		super();
		this.parameters = {
			radius: radius,
			detail: detail
		};
		
		this.fromBufferGeometry( new IcosahedronBufferGeometry( radius, detail ) );
		this.mergeVertices();
	}

}


// IcosahedronBufferGeometry

export class IcosahedronBufferGeometry extends PolyhedronBufferGeometry {

	static t : number = ( 1 + Math.sqrt( 5 ) ) / 2;

	static vertices : Array<number> = [
		- 1, IcosahedronBufferGeometry.t, 0, 	1, IcosahedronBufferGeometry.t, 0, 	- 1, - IcosahedronBufferGeometry.t, 0, 	1, - IcosahedronBufferGeometry.t, 0,
		0, - 1, IcosahedronBufferGeometry.t, 	0, 1, IcosahedronBufferGeometry.t,	0, - 1, - IcosahedronBufferGeometry.t, 	0, 1, - IcosahedronBufferGeometry.t,
		IcosahedronBufferGeometry.t, 0, - 1, 	IcosahedronBufferGeometry.t, 0, 1, 	- IcosahedronBufferGeometry.t, 0, - 1, 	- IcosahedronBufferGeometry.t, 0, 1
	];

	static indices : Array<number> = [
		0, 11, 5, 	0, 5, 1, 	0, 1, 7, 	0, 7, 10, 	0, 10, 11,
		1, 5, 9, 	5, 11, 4,	11, 10, 2,	10, 7, 6,	7, 1, 8,
		3, 9, 4, 	3, 4, 2,	3, 2, 6,	3, 6, 8,	3, 8, 9,
		4, 9, 5, 	2, 4, 11,	6, 2, 10,	8, 6, 7,	9, 8, 1
	];
	
	type : string = 'IcosahedronBufferGeometry';
	constructor( radius : number, detail : number ){
		super(IcosahedronBufferGeometry.vertices, IcosahedronBufferGeometry.indices,radius, detail);


		this.parameters = {
			radius: radius,
			detail: detail
		};
	}
	

}

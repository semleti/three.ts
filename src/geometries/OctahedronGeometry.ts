/**
 * @author timothypratley / https://github.com/timothypratley
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { PolyhedronBufferGeometry } from './PolyhedronGeometry';

// OctahedronGeometry

export class OctahedronGeometry extends Geometry {

	type = 'OctahedronGeometry';
	constructor( radius, detail ){
		super();
		this.parameters = {
			radius: radius,
			detail: detail
		};
	
		this.fromBufferGeometry( new OctahedronBufferGeometry( radius, detail ) );
		this.mergeVertices();
	}

}

// OctahedronBufferGeometry

export class OctahedronBufferGeometry extends PolyhedronBufferGeometry {

	type : string = 'OctahedronBufferGeometry';
	constructor( radius : number, detail? : number ){
		super(OctahedronBufferGeometry.vertices, OctahedronBufferGeometry.indices, radius, detail);
		this.parameters = {
			radius: radius,
			detail: detail
		};
	}
	static vertices : Array<number> = [
		1, 0, 0, 	- 1, 0, 0,	0, 1, 0,
		0, - 1, 0, 	0, 0, 1,	0, 0, - 1
	];

	static indices : Array<number> = [
		0, 2, 4,	0, 4, 3,	0, 3, 5,
		0, 5, 2,	1, 2, 5,	1, 5, 3,
		1, 3, 4,	1, 4, 2
	];


	

}
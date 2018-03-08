/**
 * @author timothypratley / https://github.com/timothypratley
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { PolyhedronBufferGeometry } from './PolyhedronGeometry';

// TetrahedronGeometry

export class TetrahedronGeometry extends Geometry {

	type : string = 'TetrahedronGeometry';
	constructor( radius : number, detail : number ){
		super();
		this.parameters = {
			radius: radius,
			detail: detail
		};
	
		this.fromBufferGeometry( new TetrahedronBufferGeometry( radius, detail ) );
		this.mergeVertices();
	}

}

// TetrahedronBufferGeometry

export class TetrahedronBufferGeometry extends PolyhedronBufferGeometry {

	type : string = 'TetrahedronBufferGeometry';
	static vertices : Array<number> = [
		1, 1, 1, 	- 1, - 1, 1, 	- 1, 1, - 1, 	1, - 1, - 1
	];

	static indices : Array<number> = [
		2, 1, 0, 	0, 3, 2,	1, 3, 0,	2, 3, 1
	];

	constructor( radius : number, detail : number ){
		super( TetrahedronBufferGeometry.vertices, TetrahedronBufferGeometry.indices, radius, detail );
		this.parameters = {
			radius: radius,
			detail: detail
		};
	}

}

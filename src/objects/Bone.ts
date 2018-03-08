import { Object3D } from '../core/Object3D';

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

export class Bone extends Object3D {

	type : string = 'Bone';
	isBone : boolean = true;
	constructor(){
		super();
	}

}
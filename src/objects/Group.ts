import { Object3D } from '../core/Object3D';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class Group extends Object3D {

	type : string = 'Group';
	isGroup : boolean = true;
	constructor(){
		super();
	}

}
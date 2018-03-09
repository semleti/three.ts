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

	clone () : Group {
		return new Group().copy(this);
	}

	copy (source : Group) : Group {
		super.copy(source);
		return this;
	}

}
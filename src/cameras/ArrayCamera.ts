/**
 * @author mrdoob / http://mrdoob.com/
 */

import { PerspectiveCamera } from './PerspectiveCamera';
import { Camera } from './Camera';

export class ArrayCamera extends PerspectiveCamera {
	cameras : Array<Camera>;
	isArrayCamera : boolean = true;
	constructor( array : Array<Camera> ){
		super();
		this.cameras = array || [];
	}

}

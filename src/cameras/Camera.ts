/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author WestLangley / http://github.com/WestLangley
*/

import { Matrix4 } from '../math/Matrix4';
import { Quaternion } from '../math/Quaternion';
import { Object3D } from '../core/Object3D';
import { Vector3 } from '../math/Vector3';

export class Camera extends Object3D {

	matrixWorldInverse : Matrix4 = new Matrix4();
	projectionMatrix : Matrix4 = new Matrix4();
	type : string = 'Camera';
	isCamera : boolean = true;
	constructor(){
		super();

	}


	copy ( source : Camera, recursive? : boolean ) : Camera {

		super.copy(source, recursive );

		this.matrixWorldInverse.copy( source.matrixWorldInverse );
		this.projectionMatrix.copy( source.projectionMatrix );

		return this;

	}

	getWorldDirection( optionalTarget? : Vector3 ) : Vector3 {
		let quaternion = new Quaternion();

		let result = optionalTarget || new Vector3();

		this.getWorldQuaternion( quaternion );

		return result.set( 0, 0, - 1 ).applyQuaternion( quaternion );


	}

	updateMatrixWorld ( force? : boolean ) : void {

		super.updateMatrixWorld( force );

		this.matrixWorldInverse.getInverse( this.matrixWorld );

	}

	clone () : Camera {

		return new Camera().copy( this );

	}

}

export module Camera{
	export class Obj extends Object3D.Obj{
		matrix;
	}
}

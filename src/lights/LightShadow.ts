import { Matrix4 } from '../math/Matrix4';
import { Vector2 } from '../math/Vector2';
import { Light } from './Light';
import { Camera, Object3D, PerspectiveCamera } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class LightShadow {

	camera : PerspectiveCamera;
	bias = 0;
	radius = 1;
	mapSize = new Vector2( 512, 512 );
	matrix = new Matrix4();
	map = null;
	constructor( camera? ){
		this.camera = camera;
	}
	
	copy ( source : LightShadow ) : LightShadow {

		this.camera = source.camera.clone();

		this.bias = source.bias;
		this.radius = source.radius;

		this.mapSize.copy( source.mapSize );

		return this;

	}

	clone () : LightShadow {

		return new LightShadow().copy( this );

	}

	toJSON () : LightShadow.Data {

		let object = new LightShadow.Data();

		if ( this.bias !== 0 ) object.bias = this.bias;
		if ( this.radius !== 1 ) object.radius = this.radius;
		if ( this.mapSize.x !== 512 || this.mapSize.y !== 512 ) object.mapSize = this.mapSize.toArray();

		object.camera = this.camera.toJSON( null ).object;
		delete object.camera.matrix;

		return object;

	}

}

export module LightShadow{
	export class Data{
		bias : number;
		radius : number;
		mapSize : Array<number>;
		camera : Camera.Obj;
	}
}

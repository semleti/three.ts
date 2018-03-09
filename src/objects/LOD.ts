import { Vector3 } from '../math/Vector3';
import { Object3D } from '../core/Object3D';
import { Raycaster, Camera } from '../Three';

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

export class LOD extends Object3D {

	type : string = 'LOD';
	constructor(){
		super();
	}

	clone() : LOD {
		return new LOD().copy(this);
	}

	levels = [];
	l;
	copy ( source : LOD ) : LOD {

		super.copy(source, false );

		let levels = source.levels;
		this.l = levels.length;
		for ( let i = 0; i < this.l; i ++ ) {

			let level = levels[ i ];

			this.addLevel( level.object.clone(), level.distance );

		}

		return this;

	}

	addLevel ( object : Object3D, distance : number ) : void {

		if ( distance === undefined ) distance = 0;

		distance = Math.abs( distance );

		let levels = this.levels;
		let l = 0;
		for ( l = 0; l < levels.length; l ++ ) {

			if ( distance < levels[ l ].distance ) {

				break;

			}

		}

		levels.splice( l, 0, { distance: distance, object: object } );

		this.add( object );

	}

	getObjectForDistance ( distance : number ) : Object3D {

		let levels = this.levels;
		let i = 1;
		for ( i = 1, this.l = levels.length; i < this.l; i ++ ) {

			if ( distance < levels[ i ].distance ) {

				break;

			}

		}

		return levels[ i - 1 ].object;

	}

	raycast( raycaster : Raycaster, intersects : Array<Object3D> ) : Array<any> {
		let matrixPosition = new Vector3();
		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		let distance = raycaster.ray.origin.distanceTo( matrixPosition );

		return this.getObjectForDistance( distance ).raycast( raycaster, intersects );

	}

	update( camera : Camera ) : void {
		let v1 = new Vector3();
		let v2 = new Vector3();
		let levels = this.levels;

		if ( levels.length > 1 ) {

			v1.setFromMatrixPosition( camera.matrixWorld );
			v2.setFromMatrixPosition( this.matrixWorld );

			let distance = v1.distanceTo( v2 );

			levels[ 0 ].object.visible = true;

			let i = 1;
			for ( i = 1, this.l = levels.length; i < this.l; i ++ ) {

				if ( distance >= levels[ i ].distance ) {

					levels[ i - 1 ].object.visible = false;
					levels[ i ].object.visible = true;

				} else {

					break;

				}

			}

			for ( ; i < this.l; i ++ ) {

				levels[ i ].object.visible = false;

			}

		}

	}

	toJSON ( meta : Object3D.MetaData ) : LOD.Data {

		let data : LOD.Data = super.toJSON( meta ) as LOD.Data;

		data.object.levels = [];

		let levels = this.levels;

		for ( let i = 0, l = levels.length; i < l; i ++ ) {

			let level = levels[ i ];

			data.object.levels.push( {
				object: level.object.uuid,
				distance: level.distance
			} );

		}

		return data;

	}

}

export module LOD{
	export class Data extends Object3D.Data{
		object : Obj;
	}
	export class Obj extends Object3D.Obj{
		levels : Array<any>;
	}
}
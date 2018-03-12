import { Ray } from '../math/Ray';
import { Vector3 } from '../math/Vector3';
import { Camera } from '../cameras/Camera';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { OrthographicCamera } from '../cameras/OrthographicCamera';
import { Object3D } from './Object3D';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://clara.io/
 * @author stephomi / http://stephaneginier.com/
 */

export class Raycaster {
	ray : Ray;
	near : number;
	far : number;
	params;
	constructor( origin : Vector3, direction : Vector3, near : number = 0, far : number = Infinity ){
		this.ray = new Ray( origin, direction );
		// direction is assumed to be normalized (for accurate distance calculations)

		this.near = near;
		this.far = far;

		this.params = {
			Mesh: {},
			Line: {},
			LOD: {},
			Points: { threshold: 1 },
			Sprite: {},
			get PointCloud () {

				console.warn( 'THREE.Raycaster: params.PointCloud has been renamed to params.Points.' );
				return this.Points;

			}
		};
	}


	linePrecision : number = 1;

	set ( origin : Vector3, direction : Vector3 ) : void {

		// direction is assumed to be normalized (for accurate distance calculations)

		this.ray.set( origin, direction );

	}

	setFromCamera ( coords : Vector3, camera : Camera ) : void {

		if ( ( camera && (camera as PerspectiveCamera).isPerspectiveCamera ) ) {

			this.ray.origin.setFromMatrixPosition( camera.matrixWorld );
			this.ray.direction.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();

		} else if ( ( camera && (camera as OrthographicCamera).isOrthographicCamera ) ) {
			let cameraOrtho = (camera as OrthographicCamera);
			this.ray.origin.set( coords.x, coords.y, ( cameraOrtho.near + cameraOrtho.far ) / ( cameraOrtho.near - cameraOrtho.far ) ).unproject( camera ); // set origin in plane of camera
			this.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );

		} else {

			console.error( 'THREE.Raycaster: Unsupported camera type.' );

		}

	}

	intersectObject ( object : Object3D, recursive? : boolean ) : Array<any> {

		let intersects = [];

		Raycaster.intersectObject( object, this, intersects, recursive );

		intersects.sort( Raycaster.ascSort );

		return intersects;

	}

	intersectObjects ( objects : Array<Object3D>, recursive? : boolean ) : Array<any> {

		let intersects = [];

		if ( Array.isArray( objects ) === false ) {

			console.warn( 'THREE.Raycaster.intersectObjects: objects is not an Array.' );
			return intersects;

		}

		for ( let i = 0, l = objects.length; i < l; i ++ ) {

			Raycaster.intersectObject( objects[ i ], this, intersects, recursive );

		}

		intersects.sort( Raycaster.ascSort );

		return intersects;

	}

}



export module Raycaster
{
	export function ascSort( a, b ) {

		return a.distance - b.distance;

	}

	export function intersectObject( object : Object3D, raycaster : Raycaster, intersects : Array<any>, recursive? : boolean ) : void {

		if ( object.visible === false ) return;

		object.raycast( raycaster, intersects );

		if ( recursive === true ) {

			let children = object.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				intersectObject( children[ i ], raycaster, intersects, true );

			}

		}

	}
}
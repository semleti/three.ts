import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Object3D } from '../core/Object3D';
import { SpriteMaterial } from '../materials/SpriteMaterial';
import { Raycaster } from '../core/Raycaster';
import { Material } from '../materials/Material';

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

export class Sprite extends Object3D {

	type : string = 'Sprite';
	center;
	isSprite : boolean = true;
	z : number;
	constructor( material : Material ){
		super();
		this.material = ( material !== undefined ) ? material : new SpriteMaterial();

		this.center = new Vector2( 0.5, 0.5 );
	}

	raycast( raycaster : Raycaster, intersects : Array<any> ) : Array<any> {
		let intersectPoint = new Vector3();
		let worldPosition = new Vector3();
		let worldScale = new Vector3();
		worldPosition.setFromMatrixPosition( this.matrixWorld );
		raycaster.ray.closestPointToPoint( worldPosition, intersectPoint );

		worldScale.setFromMatrixScale( this.matrixWorld );
		let guessSizeSq = worldScale.x * worldScale.y / 4;

		if ( worldPosition.distanceToSquared( intersectPoint ) > guessSizeSq ) return;

		let distance = raycaster.ray.origin.distanceTo( intersectPoint );

		if ( distance < raycaster.near || distance > raycaster.far ) return;

		intersects.push( {

			distance: distance,
			point: intersectPoint.clone(),
			face: null,
			object: this

		} );

	}

	clone () : Sprite {

		return new Sprite( this.material ).copy( this );

	}

	copy ( source : Sprite ) : Sprite {

		super.copy(source);

		if ( source.center !== undefined ) this.center.copy( source.center );

		return this;

	}

}

import { Sphere } from '../math/Sphere';
import { Ray } from '../math/Ray';
import { Matrix4 } from '../math/Matrix4';
import { Object3D } from '../core/Object3D';
import { Vector3 } from '../math/Vector3';
import { PointsMaterial } from '../materials/PointsMaterial';
import { BufferGeometry } from '../core/BufferGeometry';
import { Raycaster } from '../core/Raycaster';
import { Geometry } from '../core/Geometry';
import { Material } from '../materials/Material';

/**
 * @author alteredq / http://alteredqualia.com/
 */

export class Points extends Object3D {

	type : string = 'Points';
	isPoints : boolean = true;
	constructor( geometry : Geometry, material : Material ){
		super();
		this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
		this.material = material !== undefined ? material : new PointsMaterial( { color: Math.random() * 0xffffff } );
	}

	raycast( raycaster : Raycaster, intersects : Array<any> ) : Array<any> {
		let inverseMatrix = new Matrix4();
		let ray = new Ray();
		let sphere = new Sphere();
		let object = this;
		let geometry = this.geometry;
		let matrixWorld = this.matrixWorld;
		let threshold = raycaster.params.Points.threshold;

		// Checking boundingSphere distance to ray

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( matrixWorld );
		sphere.radius += threshold;

		if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

		//

		inverseMatrix.getInverse( matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		let localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
		let localThresholdSq = localThreshold * localThreshold;
		let position = new Vector3();

		function testPoint( point, index ) {

			let rayPointDistanceSq = ray.distanceSqToPoint( point );

			if ( rayPointDistanceSq < localThresholdSq ) {

				let intersectPoint = ray.closestPointToPoint( point );
				intersectPoint.applyMatrix4( matrixWorld );

				let distance = raycaster.ray.origin.distanceTo( intersectPoint );

				if ( distance < raycaster.near || distance > raycaster.far ) return;

				intersects.push( {

					distance: distance,
					distanceToRay: Math.sqrt( rayPointDistanceSq ),
					point: intersectPoint.clone(),
					index: index,
					face: null,
					object: object

				} );

			}

		}

		if ( geometry.isBufferGeometry ) {

			let index = geometry.index;
			let attributes = geometry.attributes;
			let positions = attributes.position.array;

			if ( index !== null ) {

				let indices = index.array;

				for ( let i = 0, il = indices.length; i < il; i ++ ) {

					let a = indices[ i ];

					position.fromArray( positions, a * 3 );

					testPoint( position, a );

				}

			} else {

				for ( let i = 0, l = positions.length / 3; i < l; i ++ ) {

					position.fromArray( positions, i * 3 );

					testPoint( position, i );

				}

			}

		} else {

			let vertices = geometry.vertices;

			for ( let i = 0, lt = vertices.length; i < lt; i ++ ) {

				testPoint( vertices[ i ], i );

			}

		}

	}

	clone () : Points {

		return new Points( this.geometry, this.material ).copy( this );

	}

	copy(source : Points) {
		return super.copy(source) as Points;
	}

}

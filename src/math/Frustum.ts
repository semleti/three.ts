import { Vector3 } from './Vector3';
import { Sphere } from './Sphere';
import { Plane } from './Plane';
import { Matrix3, Matrix4, Sprite, Box3, Object3D } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / http://clara.io
 */

export class Frustum {

	planes : Array<Plane>;
	constructor( p0? : Plane, p1? : Plane, p2? : Plane, p3? : Plane, p4? : Plane, p5? : Plane ){
		this.planes = [

			( p0 !== undefined ) ? p0 : new Plane(),
			( p1 !== undefined ) ? p1 : new Plane(),
			( p2 !== undefined ) ? p2 : new Plane(),
			( p3 !== undefined ) ? p3 : new Plane(),
			( p4 !== undefined ) ? p4 : new Plane(),
			( p5 !== undefined ) ? p5 : new Plane()
	
		];
	}

	set ( p0 : Plane, p1 : Plane, p2 : Plane, p3 : Plane, p4 : Plane, p5 : Plane ) {

		let planes = this.planes;

		planes[ 0 ].copy( p0 );
		planes[ 1 ].copy( p1 );
		planes[ 2 ].copy( p2 );
		planes[ 3 ].copy( p3 );
		planes[ 4 ].copy( p4 );
		planes[ 5 ].copy( p5 );

		return this;

	}

	clone () : Frustum {

		return new Frustum().copy( this );

	}

	copy ( frustum : Frustum ) : Frustum {

		let planes = this.planes;

		for ( let i = 0; i < 6; i ++ ) {

			planes[ i ].copy( frustum.planes[ i ] );

		}

		return this;

	}

	setFromMatrix ( m : Matrix4 ) : Frustum {

		let planes = this.planes;
		let me = m.elements;
		let me0 = me[ 0 ], me1 = me[ 1 ], me2 = me[ 2 ], me3 = me[ 3 ];
		let me4 = me[ 4 ], me5 = me[ 5 ], me6 = me[ 6 ], me7 = me[ 7 ];
		let me8 = me[ 8 ], me9 = me[ 9 ], me10 = me[ 10 ], me11 = me[ 11 ];
		let me12 = me[ 12 ], me13 = me[ 13 ], me14 = me[ 14 ], me15 = me[ 15 ];

		planes[ 0 ].setComponents( me3 - me0, me7 - me4, me11 - me8, me15 - me12 ).normalize();
		planes[ 1 ].setComponents( me3 + me0, me7 + me4, me11 + me8, me15 + me12 ).normalize();
		planes[ 2 ].setComponents( me3 + me1, me7 + me5, me11 + me9, me15 + me13 ).normalize();
		planes[ 3 ].setComponents( me3 - me1, me7 - me5, me11 - me9, me15 - me13 ).normalize();
		planes[ 4 ].setComponents( me3 - me2, me7 - me6, me11 - me10, me15 - me14 ).normalize();
		planes[ 5 ].setComponents( me3 + me2, me7 + me6, me11 + me10, me15 + me14 ).normalize();

		return this;

	}

	intersectsObject( object : Object3D ) : boolean {
		let sphere = new Sphere();
		let geometry = object.geometry;

		if ( geometry.boundingSphere === null )
			geometry.computeBoundingSphere();

		sphere.copy( geometry.boundingSphere )
			.applyMatrix4( object.matrixWorld );

		return this.intersectsSphere( sphere );

	}

	intersectsSprite( sprite : Sprite ) : boolean {
		let sphere = new Sphere();
		sphere.center.set( 0, 0, 0 );
		sphere.radius = 0.7071067811865476;
		sphere.applyMatrix4( sprite.matrixWorld );

		return this.intersectsSphere( sphere );

	}

	intersectsSphere ( sphere : Sphere ) : boolean {

		let planes = this.planes;
		let center = sphere.center;
		let negRadius = - sphere.radius;

		for ( let i = 0; i < 6; i ++ ) {

			let distance = planes[ i ].distanceToPoint( center );

			if ( distance < negRadius ) {

				return false;

			}

		}

		return true;

	}

	intersectsBox( box : Box3 ) : boolean {
		let p1 = new Vector3(),
		p2 = new Vector3();
		let planes = this.planes;

		for ( let i = 0; i < 6; i ++ ) {

			let plane = planes[ i ];

			p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
			p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
			p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
			p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
			p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
			p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

			let d1 = plane.distanceToPoint( p1 );
			let d2 = plane.distanceToPoint( p2 );

			// if both outside plane, no intersection

			if ( d1 < 0 && d2 < 0 ) {

				return false;

			}

		}

		return true;

	}

	containsPoint ( point : Vector3 ) : boolean {

		let planes = this.planes;

		for ( let i = 0; i < 6; i ++ ) {

			if ( planes[ i ].distanceToPoint( point ) < 0 ) {

				return false;

			}

		}

		return true;

	}

}


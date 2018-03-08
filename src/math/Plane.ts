import { Matrix3 } from './Matrix3';
import { Vector3 } from './Vector3';
import { Matrix4, Sphere, Box3, Line, Line3, LineCurve3 } from '../Three';

/**
 * @author bhouston / http://clara.io
 */

export class Plane {
	normal : Vector3;
	constant : number;
	constructor( normal? : Vector3, constant? : number ){
		// normal is assumed to be normalized

		this.normal = ( normal !== undefined ) ? normal : new Vector3( 1, 0, 0 );
		this.constant = ( constant !== undefined ) ? constant : 0;
	}

	set ( normal : Vector3, constant : number ) : Plane {

		this.normal.copy( normal );
		this.constant = constant;

		return this;

	}

	setComponents ( x : number, y : number, z : number, w : number ) : Plane {

		this.normal.set( x, y, z );
		this.constant = w;

		return this;

	}

	setFromNormalAndCoplanarPoint ( normal : Vector3, point : Vector3 ) : Plane {

		this.normal.copy( normal );
		this.constant = - point.dot( this.normal );

		return this;

	}

	setFromCoplanarPoints( a : Vector3, b : Vector3, c : Vector3 ) : Plane {
		let v1 = new Vector3();
		let v2 = new Vector3();
		let normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();

		// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

		this.setFromNormalAndCoplanarPoint( normal, a );

		return this;

	}v

	clone () : Plane {

		return new Plane().copy( this );

	}

	copy ( plane : Plane ) : Plane {

		this.normal.copy( plane.normal );
		this.constant = plane.constant;

		return this;

	}

	normalize () : Plane {

		// Note: will lead to a divide by zero if the plane is invalid.

		let inverseNormalLength = 1.0 / this.normal.length();
		this.normal.multiplyScalar( inverseNormalLength );
		this.constant *= inverseNormalLength;

		return this;

	}

	negate () : Plane {

		this.constant *= - 1;
		this.normal.negate();

		return this;

	}

	distanceToPoint ( point : Vector3 ) : number {

		return this.normal.dot( point ) + this.constant;

	}

	distanceToSphere ( sphere : Sphere ) : number {

		return this.distanceToPoint( sphere.center ) - sphere.radius;

	}

	projectPoint ( point : Vector3, optionalTarget? : Vector3 ) : Vector3 {

		let result = optionalTarget || new Vector3();

		return result.copy( this.normal ).multiplyScalar( - this.distanceToPoint( point ) ).add( point );

	}

	intersectLine( line : Line3, optionalTarget? : Vector3 ) : Vector3 {
		let v1 = new Vector3();
		let result = optionalTarget || new Vector3();

		let direction = line.delta( v1 );

		let denominator = this.normal.dot( direction );

		if ( denominator === 0 ) {

			// line is coplanar, return origin
			if ( this.distanceToPoint( line.start ) === 0 ) {

				return result.copy( line.start );

			}

			// Unsure if this is the correct method to handle this case.
			return undefined;

		}

		let t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

		if ( t < 0 || t > 1 ) {

			return undefined;

		}

		return result.copy( direction ).multiplyScalar( t ).add( line.start );

	}

	intersectsLine ( line : Line3 ) : boolean {

		// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

		let startSign = this.distanceToPoint( line.start );
		let endSign = this.distanceToPoint( line.end );

		return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

	}

	intersectsBox ( box : Box3 ) : boolean {

		return box.intersectsPlane( this );

	}

	intersectsSphere ( sphere : Sphere ) : boolean {

		return sphere.intersectsPlane( this );

	}

	coplanarPoint ( optionalTarget? : Vector3 ) : Vector3 {

		let result = optionalTarget || new Vector3();

		return result.copy( this.normal ).multiplyScalar( - this.constant );

	}

	applyMatrix4( matrix : Matrix4, optionalNormalMatrix? : Matrix3 ) : Plane {
			let v1 = new Vector3();
			let m1 = new Matrix3();
			let normalMatrix = optionalNormalMatrix || m1.getNormalMatrix( matrix );

			let referencePoint = this.coplanarPoint( v1 ).applyMatrix4( matrix );

			let normal = this.normal.applyMatrix3( normalMatrix ).normalize();

			this.constant = - referencePoint.dot( normal );

			return this;

		}

	translate ( offset : Vector3 ) : Plane {

		this.constant -= offset.dot( this.normal );

		return this;

	}

	equals ( plane : Plane ) : boolean {

		return plane.normal.equals( this.normal ) && ( plane.constant === this.constant );

	}
	

}

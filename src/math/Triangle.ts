import { Vector3 } from './Vector3';
import { Line3 } from './Line3';
import { Plane } from './Plane';
import { Box3 } from './Box3';

/**
 * @author bhouston / http://clara.io
 * @author mrdoob / http://mrdoob.com/
 */

export class Triangle {

	a : Vector3;
	b : Vector3;
	c : Vector3;
	constructor( a?  :Vector3, b?  :Vector3, c?  :Vector3 ){
		this.a = ( a !== undefined ) ? a : new Vector3();
		this.b = ( b !== undefined ) ? b : new Vector3();
		this.c = ( c !== undefined ) ? c : new Vector3();
	}

	static normal( a : Vector3, b : Vector3, c : Vector3, optionalTarget? : Vector3 ) : Vector3 {
		let v0 = new Vector3();
		let result = optionalTarget || new Vector3();

		result.subVectors( c, b );
		v0.subVectors( a, b );
		result.cross( v0 );

		let resultLengthSq = result.lengthSq();
		if ( resultLengthSq > 0 ) {

			return result.multiplyScalar( 1 / Math.sqrt( resultLengthSq ) );

		}

		return result.set( 0, 0, 0 );

	}

	static barycoordFromPoint( point : Vector3, a : Vector3, b : Vector3, c : Vector3, optionalTarget? : Vector3 ) : Vector3 {
		let v0 = new Vector3();
		let v1 = new Vector3();
		let v2 = new Vector3();
		v0.subVectors( c, a );
		v1.subVectors( b, a );
		v2.subVectors( point, a );

		let dot00 = v0.dot( v0 );
		let dot01 = v0.dot( v1 );
		let dot02 = v0.dot( v2 );
		let dot11 = v1.dot( v1 );
		let dot12 = v1.dot( v2 );

		let denom = ( dot00 * dot11 - dot01 * dot01 );

		let result = optionalTarget || new Vector3();

		// collinear or singular triangle
		if ( denom === 0 ) {

			// arbitrary location outside of triangle?
			// not sure if this is the best idea, maybe should be returning undefined
			return result.set( - 2, - 1, - 1 );

		}

		let invDenom = 1 / denom;
		let u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
		let v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

		// barycentric coordinates must always sum to 1
		return result.set( 1 - u - v, v, u );

	}

	static containsPoint( point : Vector3, a : Vector3, b : Vector3, c : Vector3 ) : boolean {
		let v1 = new Vector3();
		let result = Triangle.barycoordFromPoint( point, a, b, c, v1 );

		return ( result.x >= 0 ) && ( result.y >= 0 ) && ( ( result.x + result.y ) <= 1 );

	}

	set ( a : Vector3, b : Vector3, c : Vector3 ) : Triangle {

		this.a.copy( a );
		this.b.copy( b );
		this.c.copy( c );

		return this;

	}

	setFromPointsAndIndices ( points : Array<Vector3>, i0 : number, i1 : number, i2 : number ) : Triangle {

		this.a.copy( points[ i0 ] );
		this.b.copy( points[ i1 ] );
		this.c.copy( points[ i2 ] );

		return this;

	}

	clone () : Triangle {

		return new Triangle().copy( this );

	}

	copy ( triangle : Triangle ) : Triangle {

		this.a.copy( triangle.a );
		this.b.copy( triangle.b );
		this.c.copy( triangle.c );

		return this;

	}

	area() : number {
		let v0 = new Vector3();
		let v1 = new Vector3();
		v0.subVectors( this.c, this.b );
		v1.subVectors( this.a, this.b );

		return v0.cross( v1 ).length() * 0.5;

	}

	midpoint ( optionalTarget? : Vector3 ) : Vector3 {

		let result = optionalTarget || new Vector3();
		return result.addVectors( this.a, this.b ).add( this.c ).multiplyScalar( 1 / 3 );

	}

	normal ( optionalTarget? : Vector3 ) : Vector3 {

		return Triangle.normal( this.a, this.b, this.c, optionalTarget );

	}

	plane ( optionalTarget? : Plane ) : Plane {

		let result = optionalTarget || new Plane();

		return result.setFromCoplanarPoints( this.a, this.b, this.c );

	}

	barycoordFromPoint ( point : Vector3, optionalTarget? : Vector3 ) : Vector3 {

		return Triangle.barycoordFromPoint( point, this.a, this.b, this.c, optionalTarget );

	}

	containsPoint ( point : Vector3) : boolean {

		return Triangle.containsPoint( point, this.a, this.b, this.c );

	}

	intersectsBox ( box : Box3 ) : boolean {

		return box.intersectsTriangle( this );

	}

	closestPointToPoint( point : Vector3, optionalTarget? : Vector3 ) : Vector3 {
		let plane = new Plane();
		let edgeList = [ new Line3(), new Line3(), new Line3() ];
		let projectedPoint = new Vector3();
		let closestPoint = new Vector3();
		let result = optionalTarget || new Vector3();
		let minDistance = Infinity;

		// project the point onto the plane of the triangle

		plane.setFromCoplanarPoints( this.a, this.b, this.c );
		plane.projectPoint( point, projectedPoint );

		// check if the projection lies within the triangle

		if ( this.containsPoint( projectedPoint ) === true ) {

			// if so, this is the closest point

			result.copy( projectedPoint );

		} else {

			// if not, the point falls outside the triangle. the result is the closest point to the triangle's edges or vertices

			edgeList[ 0 ].set( this.a, this.b );
			edgeList[ 1 ].set( this.b, this.c );
			edgeList[ 2 ].set( this.c, this.a );

			for ( let i = 0; i < edgeList.length; i ++ ) {

				edgeList[ i ].closestPointToPoint( projectedPoint, true, closestPoint );

				let distance = projectedPoint.distanceToSquared( closestPoint );

				if ( distance < minDistance ) {

					minDistance = distance;

					result.copy( closestPoint );

				}

			}

		}

		return result;

	}

	equals ( triangle : Triangle ) : boolean {

		return triangle.a.equals( this.a ) && triangle.b.equals( this.b ) && triangle.c.equals( this.c );

	}

}
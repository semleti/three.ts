import { Curve } from './Curve';
import * as Curves from '../curves/Curves';
import { Vector3 } from '../../math/Vector3';
import { Vector2 } from '../../math/Vector2';

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 **/

/**************************************************************
 *	Curved Path - a curve path is simply a array of connected
 *  curves, but retains the api of a curve
 **************************************************************/

export class CurvePath extends Curve {
	type : string = 'CurvePath';

	curves : Array<Curve> = [];
	autoClose : boolean = false; // Automatically closes the path
	constructor(){
		super();
	}

	add ( curve : Curve ) : void {

		this.curves.push( curve );

	}

	closePath () : void {

		// Add a line curve if start and end of lines are not connected
		let startPoint = this.curves[ 0 ].getPoint( 0 );
		let endPoint = this.curves[ this.curves.length - 1 ].getPoint( 1 );

		if ( ! startPoint.equals( endPoint ) ) {

			this.curves.push( new Curves[ 'LineCurve' ]( endPoint, startPoint ) );

		}

	}

	// To get accurate point with reference to
	// entire path distance at time t,
	// following has to be done:

	// 1. Length of each sub path have to be known
	// 2. Locate and identify type of curve
	// 3. Get t for the curve
	// 4. Return curve.getPointAt(t')

	getPoint ( t : number ) : Vector2 {

		let d = t * this.getLength();
		let curveLengths = this.getCurveLengths();
		let i = 0;

		// To think about boundaries points.

		while ( i < curveLengths.length ) {

			if ( curveLengths[ i ] >= d ) {

				let diff = curveLengths[ i ] - d;
				let curve = this.curves[ i ];

				let segmentLength = curve.getLength();
				let u = segmentLength === 0 ? 0 : 1 - diff / segmentLength;

				return curve.getPointAt( u );

			}

			i ++;

		}

		return null;

		// loop where sum != 0, sum > d , sum+1 <d

	}

	// We cannot use the default THREE.Curve getPoint() with getLength() because in
	// THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
	// getPoint() depends on getLength

	getLength () : number {

		let lens = this.getCurveLengths();
		return lens[ lens.length - 1 ];

	}
	cacheLengths;
	// cacheLengths must be recalculated.
	updateArcLengths () : void {

		this.needsUpdate = true;
		this.cacheLengths = null;
		this.getCurveLengths();

	}

	// Compute lengths and cache them
	// We cannot overwrite getLengths() because UtoT mapping uses it.

	getCurveLengths () : Array<number> {

		// We use cache values if curves and cache array are same length

		if ( this.cacheLengths && this.cacheLengths.length === this.curves.length ) {

			return this.cacheLengths;

		}

		// Get length of sub-curve
		// Push sums into cached array

		let lengths = [], sums = 0;

		for ( let i = 0, l = this.curves.length; i < l; i ++ ) {

			sums += this.curves[ i ].getLength();
			lengths.push( sums );

		}

		this.cacheLengths = lengths;

		return lengths;

	}

	getSpacedPoints ( divisions? : number ) : Array<Vector3> {

		if ( divisions === undefined ) divisions = 40;

		let points = [];

		for ( let i = 0; i <= divisions; i ++ ) {

			points.push( this.getPoint( i / divisions ) );

		}

		if ( this.autoClose ) {

			points.push( points[ 0 ] );

		}

		return points;

	}

	getPoints ( divisions? : number ) : Array<Vector2> {

		divisions = divisions || 12;

		let points = [], last;

		for ( let i = 0, curves = this.curves; i < curves.length; i ++ ) {

			let curve = curves[ i ];
			let resolution = ( curve && (curve as Curves.EllipseCurve).isEllipseCurve ) ? divisions * 2
				: ( curve && (curve as Curves.LineCurve).isLineCurve ) ? 1
					: ( curve && (curve as Curves.SplineCurve).isSplineCurve ) ? divisions * (curve as Curves.SplineCurve).points.length
						: divisions;

			let pts = curve.getPoints( resolution );

			for ( let j = 0; j < pts.length; j ++ ) {

				let point = pts[ j ];

				if ( last && last.equals( point ) ) continue; // ensures no consecutive points are duplicates

				points.push( point );
				last = point;

			}

		}

		if ( this.autoClose && points.length > 1 && ! points[ points.length - 1 ].equals( points[ 0 ] ) ) {

			points.push( points[ 0 ] );

		}

		return points;

	}

	copy ( source : CurvePath ) : CurvePath {

		super.copy(source );

		this.curves = [];

		for ( let i = 0, l = source.curves.length; i < l; i ++ ) {

			let curve = source.curves[ i ];

			this.curves.push( curve.clone() );

		}

		this.autoClose = source.autoClose;

		return this;

	}

	toJSON () : CurvePath.Data {

		let data = super.toJSON() as CurvePath.Data;

		data.autoClose = this.autoClose;
		data.curves = [];

		for ( let i = 0, l = this.curves.length; i < l; i ++ ) {

			let curve = this.curves[ i ];
			data.curves.push( curve.toJSON() );

		}

		return data;

	}

	fromJSON ( json : CurvePath.Data ) : CurvePath {

		super.fromJSON(json );

		this.autoClose = json.autoClose;
		this.curves = [];

		for ( let i = 0, l = json.curves.length; i < l; i ++ ) {

			let curve = json.curves[ i ];
			this.curves.push( new Curves[ curve.type ]().fromJSON( curve ) );

		}

		return this;

	}

}

export module CurvePath{
	export class Data extends Curve.Data{
		autoClose;
		curves;
	}
}
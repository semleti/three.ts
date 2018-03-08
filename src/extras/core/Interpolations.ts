/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Bezier Curves formulas obtained from
 * http://en.wikipedia.org/wiki/Bézier_curve
 */

export function CatmullRom( t : number, p0 : number, p1 : number, p2 : number, p3 : number ) {

	let v0 = ( p2 - p0 ) * 0.5;
	let v1 = ( p3 - p1 ) * 0.5;
	let t2 = t * t;
	let t3 = t * t2;
	return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

}

//

export function QuadraticBezierP0( t : number, p : number ) : number {

	let k = 1 - t;
	return k * k * p;

}

export function QuadraticBezierP1( t : number, p : number ) : number {

	return 2 * ( 1 - t ) * t * p;

}

export function QuadraticBezierP2( t : number, p : number ) : number {

	return t * t * p;

}

export function QuadraticBezier( t : number, p0 : number, p1 : number, p2 : number ) : number {

	return QuadraticBezierP0( t, p0 ) + QuadraticBezierP1( t, p1 ) +
		QuadraticBezierP2( t, p2 );

}

//

export function CubicBezierP0( t : number, p : number ) : number {

	let k = 1 - t;
	return k * k * k * p;

}

export function CubicBezierP1( t : number, p : number ) : number {

	let k = 1 - t;
	return 3 * k * k * t * p;

}

export function CubicBezierP2( t : number, p : number ) : number {

	return 3 * ( 1 - t ) * t * t * p;

}

export function CubicBezierP3( t : number, p : number ) : number {

	return t * t * t * p;

}

export function CubicBezier( t : number, p0 : number, p1 : number, p2 : number, p3 : number ) : number {

	return CubicBezierP0( t, p0 ) + CubicBezierP1( t, p1 ) + CubicBezierP2( t, p2 ) +
		CubicBezierP3( t, p3 );

}

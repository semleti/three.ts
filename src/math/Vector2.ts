import { Matrix3, BufferAttribute } from "../Three";

/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

export class Vector2 {
	x : number;
	y : number;

	isVector2 : boolean = true;
	constructor( x? : number, y? : number ){

		this.x = x || 0;
		this.y = y || 0;
	}

	get width () : number {
		return this.x;
	}

	set width ( value : number ) {
		this.x = value;
	}


	get height () : number {
		return this.y;
	}

	set height ( value : number ) {

		this.y = value;

	}


	set ( x : number, y : number ) : Vector2 {

		this.x = x;
		this.y = y;

		return this;

	}

	setScalar ( scalar : number ) : Vector2 {

		this.x = scalar;
		this.y = scalar;

		return this;

	}

	setX ( x : number ) : Vector2 {

		this.x = x;

		return this;

	}

	setY ( y : number ) : Vector2 {

		this.y = y;

		return this;

	}

	setComponent ( index : number, value : number ) : Vector2 {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

		return this;

	}

	getComponent ( index : number ) : number {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error( 'index is out of range: ' + index );

		}

	}

	clone () : Vector2 {

		return new Vector2( this.x, this.y );

	}

	copy ( v : Vector2 ) : Vector2 {

		this.x = v.x;
		this.y = v.y;

		return this;

	}

	add ( v : Vector2, w? : Vector2 ) : Vector2 {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;

		return this;

	}

	addScalar ( s : number ) : Vector2 {

		this.x += s;
		this.y += s;

		return this;

	}

	addVectors ( a : Vector2, b : Vector2 ) : Vector2 {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	}

	addScaledVector ( v : Vector2, s : number ) : Vector2 {

		this.x += v.x * s;
		this.y += v.y * s;

		return this;

	}

	sub ( v : Vector2, w? : Vector2 ) : Vector2 {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;

		return this;

	}

	subScalar ( s : number ) : Vector2 {

		this.x -= s;
		this.y -= s;

		return this;

	}

	subVectors ( a : Vector2, b : Vector2 ) : Vector2 {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	}

	multiply ( v : Vector2 ) : Vector2 {

		this.x *= v.x;
		this.y *= v.y;

		return this;

	}

	multiplyScalar ( scalar : number ) : Vector2 {

		this.x *= scalar;
		this.y *= scalar;

		return this;

	}

	divide ( v : Vector2 ) : Vector2 {

		this.x /= v.x;
		this.y /= v.y;

		return this;

	}

	divideScalar ( scalar : number ) : Vector2 {

		return this.multiplyScalar( 1 / scalar );

	}

	applyMatrix3 ( m : Matrix3 ) : Vector2 {

		let x = this.x, y = this.y;
		let e = m.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

		return this;

	}

	min ( v : Vector2 ) : Vector2 {

		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );

		return this;

	}

	max ( v : Vector2 ) : Vector2 {

		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );

		return this;

	}

	clamp ( min : Vector2, max : Vector2 ) : Vector2 {

		// assumes min < max, componentwise

		this.x = Math.max( min.x, Math.min( max.x, this.x ) );
		this.y = Math.max( min.y, Math.min( max.y, this.y ) );

		return this;

	}

	clampScalar( minVal : number, maxVal : number ) : Vector2 {
		let min = new Vector2();
		let max = new Vector2();
		min.set( minVal, minVal );
		max.set( maxVal, maxVal );

		return this.clamp( min, max );

	}

	clampLength ( min : number, max : number ) : Vector2 {

		let length = this.length();

		return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

	}

	floor () : Vector2 {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );

		return this;

	}

	ceil () : Vector2 {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );

		return this;

	}

	round () : Vector2 {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );

		return this;

	}

	roundToZero () : Vector2 {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

		return this;

	}

	negate () : Vector2 {

		this.x = - this.x;
		this.y = - this.y;

		return this;

	}

	dot ( v ) : number {

		return this.x * v.x + this.y * v.y;

	}

	lengthSq () : number {

		return this.x * this.x + this.y * this.y;

	}

	length () : number {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	}

	manhattanLength () : number {

		return Math.abs( this.x ) + Math.abs( this.y );

	}

	normalize () : Vector2 {

		return this.divideScalar( this.length() || 1 );

	}

	angle () : number {

		// computes the angle in radians with respect to the positive x-axis

		let angle = Math.atan2( this.y, this.x );

		if ( angle < 0 ) angle += 2 * Math.PI;

		return angle;

	}

	distanceTo ( v : Vector2 ) : number {

		return Math.sqrt( this.distanceToSquared( v ) );

	}

	distanceToSquared ( v : Vector2 ) : number {

		let dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	}

	manhattanDistanceTo ( v : Vector2 ) : number {

		return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y );

	}

	setLength ( length : number ) : Vector2 {

		return this.normalize().multiplyScalar( length );

	}

	lerp ( v : Vector2, alpha : number ) : Vector2 {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	}

	lerpVectors ( v1 : Vector2, v2 : Vector2, alpha : number ) : Vector2 {

		return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

	}

	equals ( v : Vector2 ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	}

	fromArray ( array? : Array<number>, offset? : number ) : Vector2 {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];

		return this;

	}

	toArray ( array? : Array<number>, offset? : number ) : Array<number> {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;

		return array;

	}

	fromBufferAttribute ( attribute : BufferAttribute, index : number, offset? : number ) : Vector2 {

		if ( offset !== undefined ) {

			console.warn( 'THREE.Vector2: offset has been removed from .fromBufferAttribute().' );

		}

		this.x = attribute.getX( index );
		this.y = attribute.getY( index );

		return this;

	}

	rotateAround ( center : Vector2, angle : number ) : Vector2 {

		let c = Math.cos( angle ), s = Math.sin( angle );

		let x = this.x - center.x;
		let y = this.y - center.y;

		this.x = x * c - y * s + center.x;
		this.y = x * s + y * c + center.y;

		return this;

	}

}

import { _Math } from './Math';
import { Matrix4 } from './Matrix4';
import { Quaternion } from './Quaternion';
import { BufferAttribute, Matrix3, Cylindrical, Spherical, Camera, Euler } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

export class Vector3 {
	x : number;
	y : number;
	z : number;
	constructor( x? : number, y? : number, z? : number ){
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	isVector3 : boolean = true;

	set ( x : number, y : number, z : number ) : Vector3 {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	}

	setScalar ( scalar : number ) : Vector3 {

		this.x = scalar;
		this.y = scalar;
		this.z = scalar;

		return this;

	}

	setX ( x : number ) : Vector3 {

		this.x = x;

		return this;

	}

	setY ( y : number ) : Vector3 {

		this.y = y;

		return this;

	}

	setZ ( z : number ) : Vector3 {

		this.z = z;

		return this;

	}

	setComponent ( index : number, value : number ) : Vector3 {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

		return this;

	}

	getComponent ( index : number ) : number {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error( 'index is out of range: ' + index );

		}

	}

	clone () : Vector3 {

		return new Vector3( this.x, this.y, this.z );

	}

	copy ( v : Vector3 ) : Vector3 {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	}

	add ( v : Vector3) : Vector3 {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	}

	addScalar ( s : number ) : Vector3 {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	}

	addVectors ( a : Vector3, b : Vector3 ) : Vector3 {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	}

	addScaledVector ( v : Vector3, s : number ) : Vector3 {

		this.x += v.x * s;
		this.y += v.y * s;
		this.z += v.z * s;

		return this;

	}

	sub ( v : Vector3, w? : Vector3 ) : Vector3 {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	}

	subScalar ( s : number ) : Vector3 {

		this.x -= s;
		this.y -= s;
		this.z -= s;

		return this;

	}

	subVectors ( a:Vector3, b:Vector3 ) : Vector3 {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	}

	multiply ( v : Vector3, w : Vector3 ) : Vector3 {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
			return this.multiplyVectors( v, w );

		}

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	}

	multiplyScalar ( scalar ) : Vector3 {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;

	}

	multiplyVectors ( a : Vector3, b : Vector3 ) : Vector3 {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	}

	applyEuler( euler : Euler ) : Vector3 {

		let quaternion = new Quaternion();
		if ( ! ( euler && euler.isEuler ) ) {

			console.error( 'THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.' );

		}

		return this.applyQuaternion( quaternion.setFromEuler( euler ) );

	}

	applyAxisAngle( axis : Vector3, angle : number ) : Vector3 {
		let quaternion = new Quaternion();
		return this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );
	}

	applyMatrix3 ( m : Matrix3 ) : Vector3 {

		let x = this.x, y = this.y, z = this.z;
		let e = m.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
		this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

		return this;

	}

	applyMatrix4 ( m : Matrix4 ) : Vector3 {

		let x = this.x, y = this.y, z = this.z;
		let e = m.elements;

		let w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

		return this;

	}

	applyQuaternion ( q : Quaternion ) : Vector3 {

		let x = this.x, y = this.y, z = this.z;
		let qx = q.x, qy = q.y, qz = q.z, qw = q.w;

		// calculate quat * vector

		let ix = qw * x + qy * z - qz * y;
		let iy = qw * y + qz * x - qx * z;
		let iz = qw * z + qx * y - qy * x;
		let iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

	}

	project( camera : Camera ) : Vector3 {
		let matrix = new Matrix4();
		matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
		return this.applyMatrix4( matrix );

	}

	unproject( camera : Camera ) : Vector3 {
		let matrix = new Matrix4();
		matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
		return this.applyMatrix4( matrix );

	}

	transformDirection ( m : Matrix4 ) : Vector3 {

		// input: THREE.Matrix4 affine matrix
		// vector interpreted as a direction

		let x = this.x, y = this.y, z = this.z;
		let e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

		return this.normalize();

	}

	divide ( v : Vector3 ) : Vector3 {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	}

	divideScalar ( scalar : number ) : Vector3 {

		return this.multiplyScalar( 1 / scalar );

	}

	min ( v : Vector3 ) : Vector3 {

		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );
		this.z = Math.min( this.z, v.z );

		return this;

	}

	max ( v : Vector3 ) : Vector3 {

		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		this.z = Math.max( this.z, v.z );

		return this;

	}

	clamp ( min : Vector3, max : Vector3 ) : Vector3 {

		// assumes min < max, componentwise

		this.x = Math.max( min.x, Math.min( max.x, this.x ) );
		this.y = Math.max( min.y, Math.min( max.y, this.y ) );
		this.z = Math.max( min.z, Math.min( max.z, this.z ) );

		return this;

	}

	clampScalar( minVal : number, maxVal : number ) : Vector3 {
		let min = new Vector3();
		let max = new Vector3();
		min.set( minVal, minVal, minVal );
		max.set( maxVal, maxVal, maxVal );

		return this.clamp( min, max );

	}

	clampLength ( min : number, max : number ) : Vector3 {

		let length = this.length();

		return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

	}

	floor () : Vector3 {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );
		this.z = Math.floor( this.z );

		return this;

	}

	ceil () : Vector3 {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );
		this.z = Math.ceil( this.z );

		return this;

	}

	round () : Vector3 {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );
		this.z = Math.round( this.z );

		return this;

	}

	roundToZero () : Vector3 {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
		this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

		return this;

	}

	negate () : Vector3 {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;

		return this;

	}

	dot ( v : Vector3 ) : number {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	}

	// TODO lengthSquared?

	lengthSq () : number {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	}

	length () : number {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

	}

	manhattanLength () : number {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

	}

	normalize () : Vector3 {

		return this.divideScalar( this.length() || 1 );

	}

	setLength ( length : number ) : Vector3 {

		return this.normalize().multiplyScalar( length );

	}

	lerp ( v : Vector3, alpha : number ) : Vector3 {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;

		return this;

	}

	lerpVectors ( v1 : Vector3, v2 : Vector3, alpha : number ) : Vector3 {

		return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

	}

	cross ( v : Vector3, w? : Vector3 ) : Vector3 {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
			return this.crossVectors( v, w );

		}

		return this.crossVectors( this, v );

	}

	crossVectors ( a : Vector3, b : Vector3 ) : Vector3 {

		let ax = a.x, ay = a.y, az = a.z;
		let bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;

	}

	projectOnVector ( vector : Vector3 ) : Vector3 {

		let scalar = vector.dot( this ) / vector.lengthSq();

		return this.copy( vector ).multiplyScalar( scalar );

	}

	projectOnPlane( planeNormal : Vector3 ) : Vector3 {
		let v1 = new Vector3();
		v1.copy( this ).projectOnVector( planeNormal );

		return this.sub( v1 );

	}


	// reflect incident vector off plane orthogonal to normal
	// normal is assumed to have unit length
	reflect( normal : Vector3 ) : Vector3 {
		let v1 = new Vector3();
		return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

	}

	angleTo ( v : Vector3 ) : number {

		let theta = this.dot( v ) / ( Math.sqrt( this.lengthSq() * v.lengthSq() ) );

		// clamp, to handle numerical problems

		return Math.acos( _Math.clamp( theta, - 1, 1 ) );

	}

	distanceTo ( v : Vector3 ) : number {

		return Math.sqrt( this.distanceToSquared( v ) );

	}

	distanceToSquared ( v : Vector3 ) : number {

		let dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	}

	manhattanDistanceTo ( v : Vector3 ) : number {

		return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y ) + Math.abs( this.z - v.z );

	}

	setFromSpherical ( s : Spherical ) : Vector3 {

		let sinPhiRadius = Math.sin( s.phi ) * s.radius;

		this.x = sinPhiRadius * Math.sin( s.theta );
		this.y = Math.cos( s.phi ) * s.radius;
		this.z = sinPhiRadius * Math.cos( s.theta );

		return this;

	}

	setFromCylindrical ( c : Cylindrical ) : Vector3 {

		this.x = c.radius * Math.sin( c.theta );
		this.y = c.y;
		this.z = c.radius * Math.cos( c.theta );

		return this;

	}

	setFromMatrixPosition ( m : Matrix4 ) : Vector3 {

		let e = m.elements;

		this.x = e[ 12 ];
		this.y = e[ 13 ];
		this.z = e[ 14 ];

		return this;

	}

	setFromMatrixScale ( m : Matrix4 ) : Vector3 {

		let sx = this.setFromMatrixColumn( m, 0 ).length();
		let sy = this.setFromMatrixColumn( m, 1 ).length();
		let sz = this.setFromMatrixColumn( m, 2 ).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;

	}

	setFromMatrixColumn ( m : Matrix4, index : number ) : Vector3 {

		return this.fromArray( m.elements, index * 4 );

	}

	equals ( v : Vector3 ) : boolean {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	}

	fromArray ( array : Array<number>, offset? : number ) : Vector3 {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];

		return this;

	}

	toArray ( array? : Array<number>, offset? : number ) : Array<number> {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;

		return array;

	}

	fromBufferAttribute ( attribute : BufferAttribute, index : number, offset? : number ) : Vector3 {

		if ( offset !== undefined ) {

			console.warn( 'THREE.Vector3: offset has been removed from .fromBufferAttribute().' );

		}

		this.x = attribute.getX( index );
		this.y = attribute.getY( index );
		this.z = attribute.getZ( index );

		return this;

	}

}
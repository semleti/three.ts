import { Vector4 } from '../math/Vector4';
import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';
import { Color } from '../math/Color';
import { _Math } from '../math/Math';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class BufferAttribute {
	uuid : string = _Math.generateUUID();
	name : string = '';
	array : any;
	itemSize : number;
	count : number;
	normalized : boolean;
	dynamic : boolean = false;
	updateRange = { offset: 0, count: - 1 };
	version : number = 0;
	isBufferAttribute : boolean = true;
	constructor( array : any, itemSize : number, normalized? : boolean ){
		if ( Array.isArray( array ) ) {

			throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );

		}

		this.array = array;
		this.itemSize = itemSize;
		this.count = array !== undefined ? array.length / itemSize : 0;
		this.normalized = normalized === true;

	}

	onUploadCallback : Function = function(){};

	set needsUpdate( value ) {
		if ( value === true ) this.version ++;

	}


	setArray ( array : any ) {

		if ( Array.isArray( array ) ) {

			throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );

		}

		this.count = array !== undefined ? array.length / this.itemSize : 0;
		this.array = array;

	}

	setDynamic ( value : boolean ) : BufferAttribute {

		this.dynamic = value;

		return this;

	}

	copy ( source : BufferAttribute ) : BufferAttribute {

		this.array = new source.array.constructor( source.array );
		this.itemSize = source.itemSize;
		this.count = source.count;
		this.normalized = source.normalized;

		this.dynamic = source.dynamic;

		return this;

	}

	copyAt ( index1 : number, attribute : BufferAttribute, index2 : number ) : BufferAttribute {

		index1 *= this.itemSize;
		index2 *= attribute.itemSize;

		for ( let i = 0, l = this.itemSize; i < l; i ++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

		return this;

	}

	copyArray ( array : any ) : BufferAttribute {

		this.array.set( array );

		return this;

	}

	copyColorsArray ( colors : Array<Color> ) : BufferAttribute {

		let array = this.array, offset = 0;

		for ( let i = 0, l = colors.length; i < l; i ++ ) {

			let color = colors[ i ];

			if ( color === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyColorsArray(): color is undefined', i );
				color = new Color();

			}

			array[ offset ++ ] = color.r;
			array[ offset ++ ] = color.g;
			array[ offset ++ ] = color.b;

		}

		return this;

	}

	copyIndicesArray ( indices : Array<any> ) : BufferAttribute {

		let array = this.array, offset = 0;

		for ( let i = 0, l = indices.length; i < l; i ++ ) {

			let index = indices[ i ];

			array[ offset ++ ] = index.a;
			array[ offset ++ ] = index.b;
			array[ offset ++ ] = index.c;

		}

		return this;

	}

	copyVector2sArray ( vectors : Array<Vector2> ) : BufferAttribute {

		let array = this.array, offset = 0;

		for ( let i = 0, l = vectors.length; i < l; i ++ ) {

			let vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i );
				vector = new Vector2();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;

		}

		return this;

	}

	copyVector3sArray ( vectors : Array<Vector3> ) : BufferAttribute {

		let array = this.array, offset = 0;

		for ( let i = 0, l = vectors.length; i < l; i ++ ) {

			let vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i );
				vector = new Vector3();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;

		}

		return this;

	}

	copyVector4sArray ( vectors : Array<Vector4> ) : BufferAttribute {

		let array = this.array, offset = 0;

		for ( let i = 0, l = vectors.length; i < l; i ++ ) {

			let vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i );
				vector = new Vector4();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;
			array[ offset ++ ] = vector.w;

		}

		return this;

	}

	set ( value : any, offset? : number ) : BufferAttribute {

		if ( offset === undefined ) offset = 0;

		this.array.set( value, offset );

		return this;

	}

	getX ( index : number ) : number {

		return this.array[ index * this.itemSize ];

	}

	setX ( index : number, x : number ) : BufferAttribute {

		this.array[ index * this.itemSize ] = x;

		return this;

	}

	getY ( index : number ) : number {

		return this.array[ index * this.itemSize + 1 ];

	}

	setY ( index : number, y : number ) : BufferAttribute {

		this.array[ index * this.itemSize + 1 ] = y;

		return this;

	}

	getZ ( index : number ) : number {

		return this.array[ index * this.itemSize + 2 ];

	}

	setZ ( index : number, z : number ) : BufferAttribute {

		this.array[ index * this.itemSize + 2 ] = z;

		return this;

	}

	getW ( index : number ) : number {

		return this.array[ index * this.itemSize + 3 ];

	}

	setW ( index : number, w : number ) : BufferAttribute {

		this.array[ index * this.itemSize + 3 ] = w;

		return this;

	}

	setXY ( index : number, x : number, y : number ) : BufferAttribute {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;

		return this;

	}

	setXYZ ( index : number, x : number, y : number, z : number ) : BufferAttribute {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;

		return this;

	}

	setXYZW ( index : number, x : number, y : number, z : number, w : number ) : BufferAttribute {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;
		this.array[ index + 3 ] = w;

		return this;

	}

	onUpload ( callback : Function ) : BufferAttribute {

		this.onUploadCallback = callback;

		return this;

	}

	clone () : BufferAttribute {

		return new BufferAttribute( this.array, this.itemSize ).copy( this );

	}

}

//

export class Int8BufferAttribute extends BufferAttribute {
	constructor( array : any, itemSize : number, normalized? : boolean ){
		super( new Int8Array( array ), itemSize, normalized );
	}

}


export class Uint8BufferAttribute extends BufferAttribute {
	constructor( array : any, itemSize : number, normalized? : boolean ){
		super(new Uint8Array( array ), itemSize, normalized);
	}

}


export class Uint8ClampedBufferAttribute extends BufferAttribute {
	constructor( array : any, itemSize : number, normalized? : boolean ){
		super(new Uint8ClampedArray( array ), itemSize, normalized );
	}

}



export class Int16BufferAttribute extends BufferAttribute {
	constructor( array : any, itemSize : number, normalized? : boolean ){
		super(new Int16Array( array ), itemSize, normalized );
	}

}


export class Uint16BufferAttribute extends BufferAttribute {
	constructor( array : any, itemSize : number, normalized? : boolean ){
		super(new Uint16Array( array ), itemSize, normalized);
	}

}


export class Int32BufferAttribute extends BufferAttribute {
	constructor( array : any, itemSize : number, normalized? : boolean ){
		super(new Int32Array( array ), itemSize, normalized );
	}

}


export class Uint32BufferAttribute extends BufferAttribute {
	constructor( array : any, itemSize : number, normalized? : boolean ){
		super(new Uint32Array( array ), itemSize, normalized);
	}

}


export class Float32BufferAttribute extends BufferAttribute {
	constructor( array : any, itemSize : number, normalized? : boolean ){
		super(new Float32Array( array ), itemSize, normalized);
	}

}


export class Float64BufferAttribute extends BufferAttribute {
	constructor( array : any, itemSize : number, normalized? : boolean ){
		super(new Float64Array( array ), itemSize, normalized );
	}

}
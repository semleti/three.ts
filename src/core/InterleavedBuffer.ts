import { _Math } from '../math/Math';

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

export class InterleavedBuffer {

	uuid : string = _Math.generateUUID();
	array : any;
	stride : number;
	count : number;
	dynamic : boolean = false;
	updateRange = { offset: 0, count: - 1 };
	version = 0;
	isInterleavedBuffer : boolean = true;	
	constructor( array? : any, stride? : number ){
		this.array = array;
		this.stride = stride;
		this.count = array !== undefined ? array.length / stride : 0;

	}

	onUploadCallback : Function = function(){};
	set needsUpdate ( value : boolean ) {
		if ( value === true ) this.version ++;

	}

	setArray ( array : any ) : void {

		if ( Array.isArray( array ) ) {

			throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );

		}

		this.count = array !== undefined ? array.length / this.stride : 0;
		this.array = array;

	}

	setDynamic ( value : boolean ) : InterleavedBuffer {

		this.dynamic = value;

		return this;

	}

	copy ( source : InterleavedBuffer ) : InterleavedBuffer {

		this.array = new source.array.constructor( source.array );
		this.count = source.count;
		this.stride = source.stride;
		this.dynamic = source.dynamic;

		return this;

	}

	copyAt ( index1 : number, attribute : any, index2 : number ) : InterleavedBuffer {

		index1 *= this.stride;
		index2 *= attribute.stride;

		for ( let i = 0, l = this.stride; i < l; i ++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

		return this;

	}

	set ( value : any, offset : number ) : InterleavedBuffer {

		if ( offset === undefined ) offset = 0;

		this.array.set( value, offset );

		return this;

	}

	clone () : InterleavedBuffer {

		return new InterleavedBuffer().copy( this );

	}

	onUpload ( callback : Function ) : InterleavedBuffer {

		this.onUploadCallback = callback;

		return this;

	}

}


import { _Math } from '../math/Math';
import { InterleavedBuffer } from './InterleavedBuffer';

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

export class InterleavedBufferAttribute {
	uuid : string = _Math.generateUUID();
	data : InterleavedBuffer;
	itemSize : number;
	offset : number;
	normalized : boolean;

	isInterleavedBufferAttribute : boolean = true;
	constructor( interleavedBuffer : InterleavedBuffer, itemSize : number, offset : number, normalized? : boolean ){

		this.data = interleavedBuffer;
		this.itemSize = itemSize;
		this.offset = offset;

		this.normalized = normalized === true;

	}

	get count() : number {

		return this.data.count;

	}

	get array () : any {

		return this.data.array;

	}


	setX ( index : number, x : number ) : InterleavedBufferAttribute {

		this.data.array[ index * this.data.stride + this.offset ] = x;

		return this;

	}

	setY ( index : number, y : number ) : InterleavedBufferAttribute {

		this.data.array[ index * this.data.stride + this.offset + 1 ] = y;

		return this;

	}

	setZ ( index : number, z : number ) : InterleavedBufferAttribute {

		this.data.array[ index * this.data.stride + this.offset + 2 ] = z;

		return this;

	}

	setW ( index : number, w : number ) : InterleavedBufferAttribute {

		this.data.array[ index * this.data.stride + this.offset + 3 ] = w;

		return this;

	}

	getX ( index : number ) : any {

		return this.data.array[ index * this.data.stride + this.offset ];

	}

	getY ( index : number ) : any {

		return this.data.array[ index * this.data.stride + this.offset + 1 ];

	}

	getZ ( index : number ) : any {

		return this.data.array[ index * this.data.stride + this.offset + 2 ];

	}

	getW ( index : number ) : any {

		return this.data.array[ index * this.data.stride + this.offset + 3 ];

	}

	setXY ( index : number, x : number, y : number ) : InterleavedBufferAttribute {

		index = index * this.data.stride + this.offset;

		this.data.array[ index + 0 ] = x;
		this.data.array[ index + 1 ] = y;

		return this;

	}

	setXYZ ( index : number, x : number, y : number, z : number ) : InterleavedBufferAttribute {

		index = index * this.data.stride + this.offset;

		this.data.array[ index + 0 ] = x;
		this.data.array[ index + 1 ] = y;
		this.data.array[ index + 2 ] = z;

		return this;

	}

	setXYZW ( index : number, x : number, y : number, z : number, w : number ) : InterleavedBufferAttribute {

		index = index * this.data.stride + this.offset;

		this.data.array[ index + 0 ] = x;
		this.data.array[ index + 1 ] = y;
		this.data.array[ index + 2 ] = z;
		this.data.array[ index + 3 ] = w;

		return this;

	}

}

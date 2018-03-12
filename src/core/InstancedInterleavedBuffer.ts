import { InterleavedBuffer } from './InterleavedBuffer';

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

export class InstancedInterleavedBuffer extends InterleavedBuffer {
	isInstancedInterleavedBuffer : boolean = true;
	meshPerAttribute : number;
	constructor( array : any, stride : number, meshPerAttribute : number = 1 ){
		super(array, stride);
		this.meshPerAttribute = meshPerAttribute;

	}


	copy ( source : InstancedInterleavedBuffer ) : InstancedInterleavedBuffer {

		super.copy( source );

		this.meshPerAttribute = source.meshPerAttribute;

		return this;

	}

}

import { BufferAttribute } from './BufferAttribute';

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

export class InstancedBufferAttribute extends BufferAttribute {
	meshPerAttribute : number;
	isInstancedBufferAttribute : boolean = true;	
	constructor( array : any, itemSize : number, meshPerAttribute? : number ){
		super(array, itemSize);
		this.meshPerAttribute = meshPerAttribute || 1;

	}


	copy ( source : InstancedBufferAttribute ) : InstancedBufferAttribute {

		super.copy( source );

		this.meshPerAttribute = source.meshPerAttribute;

		return this;

	}

}
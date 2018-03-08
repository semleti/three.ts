import { BufferGeometry } from './BufferGeometry';

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

export class InstancedBufferGeometry extends BufferGeometry {
	type : string = 'InstancedBufferGeometry';
	isInstancedBufferGeometry : boolean = true;
	maxInstancedCount : number = undefined;
	constructor(){
		super();

	}


	copy ( source : InstancedBufferGeometry ) : InstancedBufferGeometry {

		super.copy( source );

		this.maxInstancedCount = source.maxInstancedCount;

		return this;

	}

	clone () : InstancedBufferGeometry {

		return new InstancedBufferGeometry().copy( this );

	}

}

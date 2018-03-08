/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Vector3 } from '../math/Vector3';
import { Audio } from './Audio';
import { Object3D } from '../core/Object3D';

export class PositionalAudio extends Audio {
	panner : any;
	constructor( listener ){
		super( listener );

		this.panner = this.context.createPanner();
		this.panner.connect( this.gain );

	}

	getOutput () : any {

		return this.panner;

	}

	getRefDistance () : number {

		return this.panner.refDistance;

	}

	setRefDistance ( value : number ) : void {

		this.panner.refDistance = value;

	}

	getRolloffFactor () : number {

		return this.panner.rolloffFactor;

	}

	setRolloffFactor ( value : number ) : void {

		this.panner.rolloffFactor = value;

	}

	getDistanceModel () : any {

		return this.panner.distanceModel;

	}

	setDistanceModel ( value : any ) : any {

		this.panner.distanceModel = value;

	}

	getMaxDistance () : number {

		return this.panner.maxDistance;

	}

	setMaxDistance ( value : number ) : void {

		this.panner.maxDistance = value;

	}

	updateMatrixWorld( force : boolean ) : void {
		let position = new Vector3();
		super.updateMatrixWorld( force );

		position.setFromMatrixPosition( this.matrixWorld );

		this.panner.setPosition( position.x, position.y, position.z );

	

	}


}

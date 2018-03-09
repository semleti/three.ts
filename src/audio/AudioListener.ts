/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Object3D } from '../core/Object3D';
import { AudioContext } from './AudioContext';

export class AudioListener extends Object3D {
	type : string = 'AudioListener';
	context : any;
	gain : any;
	filter : any = null;
	constructor(){
		super();
		this.context = AudioContext.getContext();
		this.gain = this.context.createGain();
		this.gain.connect( this.context.destination );
	}

	clone () : AudioListener {
		return new AudioListener().copy(this);
	}

	copy (source : AudioListener) : AudioListener {
		super.copy(source);
		return this;
	}

	getInput () : any {

		return this.gain;

	}

	removeFilter ( ) : void {

		if ( this.filter !== null ) {

			this.gain.disconnect( this.filter );
			this.filter.disconnect( this.context.destination );
			this.gain.connect( this.context.destination );
			this.filter = null;

		}

	}

	getFilter () : any {

		return this.filter;

	}

	setFilter ( value : any ) : void {

		if ( this.filter !== null ) {

			this.gain.disconnect( this.filter );
			this.filter.disconnect( this.context.destination );

		} else {

			this.gain.disconnect( this.context.destination );

		}

		this.filter = value;
		this.gain.connect( this.filter );
		this.filter.connect( this.context.destination );

	}

	getMasterVolume () : number {

		return this.gain.gain.value;

	}

	setMasterVolume ( value : number ) : void {

		this.gain.gain.value = value;

	}

	updateMatrixWorld( force : boolean ) : void {
		let position = new Vector3();
		let quaternion = new Quaternion();
		let scale = new Vector3();

		let orientation = new Vector3();
		Object3D.prototype.updateMatrixWorld.call( this, force );

		let listener = this.context.listener;
		let up = this.up;

		this.matrixWorld.decompose( position, quaternion, scale );

		orientation.set( 0, 0, - 1 ).applyQuaternion( quaternion );

		if ( listener.positionX ) {

			listener.positionX.setValueAtTime( position.x, this.context.currentTime );
			listener.positionY.setValueAtTime( position.y, this.context.currentTime );
			listener.positionZ.setValueAtTime( position.z, this.context.currentTime );
			listener.forwardX.setValueAtTime( orientation.x, this.context.currentTime );
			listener.forwardY.setValueAtTime( orientation.y, this.context.currentTime );
			listener.forwardZ.setValueAtTime( orientation.z, this.context.currentTime );
			listener.upX.setValueAtTime( up.x, this.context.currentTime );
			listener.upY.setValueAtTime( up.y, this.context.currentTime );
			listener.upZ.setValueAtTime( up.z, this.context.currentTime );

		} else {

			listener.setPosition( position.x, position.y, position.z );
			listener.setOrientation( orientation.x, orientation.y, orientation.z, up.x, up.y, up.z );

		}

		
	}

} 

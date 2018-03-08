/**
 * @author alteredq / http://alteredqualia.com/
 */

export class Clock {
	startTime : number = 0;
	oldTime : number = 0;
	elapsedTime : number = 0;

	running : boolean = false;
	autoStart : boolean;
	constructor( autoStart? : boolean ){
		this.autoStart = ( autoStart !== undefined ) ? autoStart : true;
	}

	start () : void {

		this.startTime = ( typeof performance === 'undefined' ? Date : performance ).now(); // see #10732

		this.oldTime = this.startTime;
		this.elapsedTime = 0;
		this.running = true;

	}

	stop () : void {

		this.getElapsedTime();
		this.running = false;
		this.autoStart = false;

	}

	getElapsedTime () : number {

		this.getDelta();
		return this.elapsedTime;

	}

	getDelta () : number {

		let diff = 0;

		if ( this.autoStart && ! this.running ) {

			this.start();
			return 0;

		}

		if ( this.running ) {

			let newTime = ( typeof performance === 'undefined' ? Date : performance ).now();

			diff = ( newTime - this.oldTime ) / 1000;
			this.oldTime = newTime;

			this.elapsedTime += diff;

		}

		return diff;

	}

}

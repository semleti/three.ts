import { Audio } from "./Audio";

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class AudioAnalyser{
	analyser : any;
	data : Uint8Array;
	constructor( audio : Audio, fftSize? : number ) {
		this.analyser = audio.context.createAnalyser();
		this.analyser.fftSize = fftSize !== undefined ? fftSize : 2048;

		this.data = new Uint8Array( this.analyser.frequencyBinCount );

		audio.getOutput().connect( this.analyser );

	}

	getFrequencyData () :Uint8Array {

		this.analyser.getByteFrequencyData( this.data );

		return this.data;

	}

	getAverageFrequency () : number {

		let value = 0, data = this.getFrequencyData();

		for ( let i = 0; i < data.length; i ++ ) {

			value += data[ i ];

		}

		return value / data.length;

	}

}

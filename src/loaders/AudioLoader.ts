import { AudioContext } from '../audio/AudioContext';
import { FileLoader } from './FileLoader';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';

/**
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */

export class AudioLoader {

	manager : LoadingManager;
	constructor( manager : LoadingManager = DefaultLoadingManager ){
		this.manager = manager;
	}
	
	load ( url : string, onLoad : Function, onProgress : Function, onError : Function ) : void {

		let loader = new FileLoader( this.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function ( buffer ) {

			let context = AudioContext.getContext();

			context.decodeAudioData( buffer, function ( audioBuffer ) {

				onLoad( audioBuffer );

			} );

		}, onProgress, onError );

	}
}
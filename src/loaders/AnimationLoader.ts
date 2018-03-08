import { AnimationClip } from '../animation/AnimationClip';
import { FileLoader } from './FileLoader';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';

/**
 * @author bhouston / http://clara.io/
 */

export class AnimationLoader {

	manager : LoadingManager;
	constructor( manager : LoadingManager ){
		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
	}

	load ( url : string, onLoad : Function, onProgress : Function, onError : Function ) {

		let scope = this;

		let loader = new FileLoader( this.manager );
		loader.load( url, function ( text ) {

			scope.parse( JSON.parse( text ), onLoad );

		}, onProgress, onError );

	}

	parse ( json : Array<any>, onLoad : Function ) : void {

		let animations = [];

		for ( let i = 0; i < json.length; i ++ ) {

			let clip = AnimationClip.parse( json[ i ] );

			animations.push( clip );

		}

		onLoad( animations );

	}

}
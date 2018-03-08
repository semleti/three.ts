/**
 * @author mrdoob / http://mrdoob.com/
 */

let context : any;

export module AudioContext {

	export function getContext() : any {

		if ( context === undefined ) {

			context = new ( (window as any).AudioContext || (window as any).webkitAudioContext )() as any;

		}

		return context;

	}

	export function setContext ( value : any ) {

		context = value;

	}

}

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class LoadingManager {

	isLoading : boolean = false;
	itemsLoaded : number = 0;
	itemsTotal : number = 0;
	urlModifier : (string) => string = undefined;
	onStart : Function = function(){};
	onLoad : Function = function(){};
	onProgress : Function = function(){};
	onError : Function = function(){};
	constructor( onLoad? : Function, onProgress? : Function, onError? : Function ){
	
		this.onStart = undefined;
		this.onLoad = onLoad;
		this.onProgress = onProgress;
		this.onError = onError;
	}

	

	itemStart ( url : string ) : void {

		this.itemsTotal ++;

		if ( this.isLoading === false ) {

			if ( this.onStart !== undefined ) {

				this.onStart( url, this.itemsLoaded, this.itemsTotal );

			}

		}

		this.isLoading = true;

	}

	itemEnd ( url : string ) : void {

		this.itemsLoaded ++;

		if ( this.onProgress !== undefined ) {

			this.onProgress( url, this.itemsLoaded, this.itemsTotal );

		}

		if ( this.itemsLoaded === this.itemsTotal ) {

			this.isLoading = false;

			if ( this.onLoad !== undefined ) {

				this.onLoad();

			}

		}

	}

	itemError  ( url : string ) : void {

		if ( this.onError !== undefined ) {

			this.onError( url );

		}

	}

	resolveURL ( url : string ) : string {

		if ( this.urlModifier ) {

			return this.urlModifier( url );

		}

		return url;

	}

	setURLModifier ( transform : (string) => string ) : LoadingManager {

		this.urlModifier = transform;
		return this;

	}

}

let DefaultLoadingManager = new LoadingManager();


export { DefaultLoadingManager };

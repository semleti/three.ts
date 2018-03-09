/**
 * @author mrdoob / http://mrdoob.com/
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */

import { Object3D } from '../core/Object3D';
import {AudioListener} from './AudioListener'

export class Audio extends Object3D {
	type : string = 'Audio';
	context : AudioContext;
	gain : any;
	source : any;
	autoplay : boolean = false;

	buffer : any = null;
	loop : boolean = false;
	startTime : number = 0;
	offset : number = 0;
	playbackRate : number = 1;
	isPlaying : boolean = false;
	hasPlaybackControl : boolean = true;
	sourceType : string = 'empty';
	filters : Array<any> = [];
	listener : AudioListener;
	constructor( listener : AudioListener ){
		super();
		this.listener = listener;

		this.context = listener.context;

		this.gain = this.context.createGain();
		this.gain.connect( listener.getInput() );

		

	}

	clone () : Audio {
		return new Audio(this.listener).copy(this);
	}

	copy (source : Audio) : Audio {
		super.copy(source);
		return this;
	}

	getOutput () {

		return this.gain;

	}

	setNodeSource ( audioNode ) {

		this.hasPlaybackControl = false;
		this.sourceType = 'audioNode';
		this.source = audioNode;
		this.connect();

		return this;

	}

	setBuffer ( audioBuffer ) {

		this.buffer = audioBuffer;
		this.sourceType = 'buffer';

		if ( this.autoplay ) this.play();

		return this;

	}

	play () {

		if ( this.isPlaying === true ) {

			console.warn( 'THREE.Audio: Audio is already playing.' );
			return;

		}

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		let source = this.context.createBufferSource();

		source.buffer = this.buffer;
		source.loop = this.loop;
		source.onended = this.onEnded.bind( this );
		source.playbackRate.setValueAtTime( this.playbackRate, this.startTime );
		this.startTime = this.context.currentTime;
		source.start( this.startTime, this.offset );

		this.isPlaying = true;

		this.source = source;

		return this.connect();

	}

	pause () {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		if ( this.isPlaying === true ) {

			this.source.stop();
			this.offset += ( this.context.currentTime - this.startTime ) * this.playbackRate;
			this.isPlaying = false;

		}

		return this;

	}

	stop () {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.source.stop();
		this.offset = 0;
		this.isPlaying = false;

		return this;

	}

	connect () {

		if ( this.filters.length > 0 ) {

			this.source.connect( this.filters[ 0 ] );

			for ( let i = 1, l = this.filters.length; i < l; i ++ ) {

				this.filters[ i - 1 ].connect( this.filters[ i ] );

			}

			this.filters[ this.filters.length - 1 ].connect( this.getOutput() );

		} else {

			this.source.connect( this.getOutput() );

		}

		return this;

	}

	disconnect () {

		if ( this.filters.length > 0 ) {

			this.source.disconnect( this.filters[ 0 ] );

			for ( let i = 1, l = this.filters.length; i < l; i ++ ) {

				this.filters[ i - 1 ].disconnect( this.filters[ i ] );

			}

			this.filters[ this.filters.length - 1 ].disconnect( this.getOutput() );

		} else {

			this.source.disconnect( this.getOutput() );

		}

		return this;

	}

	getFilters () {

		return this.filters;

	}

	setFilters ( value ) {

		if ( ! value ) value = [];

		if ( this.isPlaying === true ) {

			this.disconnect();
			this.filters = value;
			this.connect();

		} else {

			this.filters = value;

		}

		return this;

	}

	getFilter () {

		return this.getFilters()[ 0 ];

	}

	setFilter ( filter ) {

		return this.setFilters( filter ? [ filter ] : [] );

	}

	setPlaybackRate ( value ) {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.playbackRate = value;

		if ( this.isPlaying === true ) {

			this.source.playbackRate.setValueAtTime( this.playbackRate, this.context.currentTime );

		}

		return this;

	}

	getPlaybackRate () {

		return this.playbackRate;

	}

	onEnded () {

		this.isPlaying = false;

	}

	getLoop () {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return false;

		}

		return this.loop;

	}

	setLoop ( value ) {

		if ( this.hasPlaybackControl === false ) {

			console.warn( 'THREE.Audio: this Audio has no playback control.' );
			return;

		}

		this.loop = value;

		if ( this.isPlaying === true ) {

			this.source.loop = this.loop;

		}

		return this;

	}

	getVolume () {

		return this.gain.gain.value;

	}

	setVolume ( value ) {

		this.gain.gain.value = value;

		return this;

	}

}

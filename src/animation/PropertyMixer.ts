import { Quaternion } from '../math/Quaternion';
import { PropertyBinding } from './PropertyBinding';

/**
 *
 * Buffered scene graph property that allows weighted accumulation.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

export class PropertyMixer {
	binding : PropertyBinding;
	valueSize : number;
	cumulativeWeight : number = 0;
	useCount : number = 0;
	referenceCount : number = 0;
	buffer : any;
	_mixBufferRegion : Function;
	_cacheIndex : number;
	constructor( binding : PropertyBinding, typeName : string, valueSize : number ){
		this.binding = binding;
		this.valueSize = valueSize;

		let bufferType : any = Float64Array;
		let mixFunction : Function;

		switch ( typeName ) {

			case 'quaternion':
				mixFunction = this._slerp;
				break;

			case 'string':
			case 'bool':
				bufferType = Array;
				mixFunction = this._select;
				break;

			default:
				mixFunction = this._lerp;

		}

		this.buffer = new bufferType( valueSize * 4 );
		// layout: [ incoming | accu0 | accu1 | orig ]
		//
		// interpolators can use .buffer as their .result
		// the data then goes to 'incoming'
		//
		// 'accu0' and 'accu1' are used frame-interleaved for
		// the cumulative result and are compared to detect
		// changes
		//
		// 'orig' stores the original state of the property

		this._mixBufferRegion = mixFunction;
	}


	// accumulate data in the 'incoming' region into 'accu<i>'
	accumulate ( accuIndex : number, weight : number ) : void {

		// note: happily accumulating nothing when weight = 0, the caller knows
		// the weight and shouldn't have made the call in the first place

		let buffer = this.buffer,
			stride = this.valueSize,
			offset = accuIndex * stride + stride,

			currentWeight = this.cumulativeWeight;

		if ( currentWeight === 0 ) {

			// accuN := incoming * weight

			for ( let i = 0; i !== stride; ++ i ) {

				buffer[ offset + i ] = buffer[ i ];

			}

			currentWeight = weight;

		} else {

			// accuN := accuN + incoming * weight

			currentWeight += weight;
			let mix = weight / currentWeight;
			this._mixBufferRegion( buffer, offset, 0, mix, stride );

		}

		this.cumulativeWeight = currentWeight;

	}

	// apply the state of 'accu<i>' to the binding when accus differ
	apply ( accuIndex : number ) : void {

		let stride = this.valueSize,
			buffer = this.buffer,
			offset = accuIndex * stride + stride,

			weight = this.cumulativeWeight,

			binding = this.binding;

		this.cumulativeWeight = 0;

		if ( weight < 1 ) {

			// accuN := accuN + original * ( 1 - cumulativeWeight )

			let originalValueOffset = stride * 3;

			this._mixBufferRegion(
				buffer, offset, originalValueOffset, 1 - weight, stride );

		}

		for ( let i = stride, e = stride + stride; i !== e; ++ i ) {

			if ( buffer[ i ] !== buffer[ i + stride ] ) {

				// value has changed -> update scene graph

				binding.setValue( buffer, offset );
				break;

			}

		}

	}

	// remember the state of the bound property and copy it to both accus
	saveOriginalState () : void {

		let binding = this.binding;

		let buffer = this.buffer,
			stride = this.valueSize,

			originalValueOffset = stride * 3;
		binding.getValue( buffer, originalValueOffset );

		// accu[0..1] := orig -- initially detect changes against the original
		for ( let i = stride, e = originalValueOffset; i !== e; ++ i ) {

			buffer[ i ] = buffer[ originalValueOffset + ( i % stride ) ];

		}

		this.cumulativeWeight = 0;

	}

	// apply the state previously taken via 'saveOriginalState' to the binding
	restoreOriginalState () : void {

		let originalValueOffset = this.valueSize * 3;
		this.binding.setValue( this.buffer, originalValueOffset );

	}


	// mix functions

	_select ( buffer : any, dstOffset : number, srcOffset : number, t : number, stride : number ) : void {

		if ( t >= 0.5 ) {

			for ( let i = 0; i !== stride; ++ i ) {

				buffer[ dstOffset + i ] = buffer[ srcOffset + i ];

			}

		}

	}

	_slerp ( buffer : any, dstOffset : number, srcOffset : number, t : number ) : void {

		Quaternion.slerpFlat( buffer, dstOffset, buffer, dstOffset, buffer, srcOffset, t );

	}

	_lerp ( buffer : any, dstOffset : number, srcOffset : number, t : number, stride : number ) : void {

		let s = 1 - t;

		for ( let i = 0; i !== stride; ++ i ) {

			let j = dstOffset + i;

			buffer[ j ] = buffer[ j ] * s + buffer[ srcOffset + i ] * t;

		}

	}

}

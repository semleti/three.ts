import { InterpolateDiscrete } from '../../constants';
import { KeyframeTrack } from '../KeyframeTrack';

/**
 *
 * A Track of Boolean keyframe values.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

export class BooleanKeyframeTrack extends KeyframeTrack {

	constructor( name : string, times : Array<number>, values : Array<Boolean> ){
		super( name, times, values, null );
	}

	ValueTypeName : string = 'bool';

	DefaultInterpolation : number =  InterpolateDiscrete;

	// Note: Actually this track could have a optimized / compressed
	// representation of a single value and a custom interpolant that
	// computes "firstValue ^ isOdd( index )".

}

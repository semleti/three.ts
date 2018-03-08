import { KeyframeTrack } from '../KeyframeTrack';

/**
 *
 * A Track of numeric keyframe values.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

export class NumberKeyframeTrack extends KeyframeTrack {
	ValueTypeName : string = 'number';
	constructor( name : string, times : Array<number>, values : Array<number>, interpolation : number ){
		super( name, times, values, interpolation );
	}

}


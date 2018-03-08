import { KeyframeTrack } from '../KeyframeTrack';

/**
 *
 * A Track of vectored keyframe values.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

export class VectorKeyframeTrack extends KeyframeTrack {
	ValueTypeName : string = 'vector'
	constructor( name : string, times : Array<number>, values : Array<any>, interpolation : number ){
		super( name, times, values, interpolation );
	}

}

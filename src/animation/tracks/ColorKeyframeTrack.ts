import { KeyframeTrack } from '../KeyframeTrack';
import { Color } from '../../Three';

/**
 *
 * A Track of keyframe values that represent color.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

export class ColorKeyframeTrack extends KeyframeTrack {

	constructor(name : string, times : Array<number>, values : Array<Color>, interpolation : number )
	{
		super(name, times, values, interpolation );
	}
	ValueTypeName : string = 'color';
}

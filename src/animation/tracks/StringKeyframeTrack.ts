import { InterpolateDiscrete } from '../../constants';
import { KeyframeTrack } from '../KeyframeTrack';

/**
 *
 * A Track that interpolates Strings
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

export class StringKeyframeTrack extends KeyframeTrack {

	constructor(name : string, times : Array<number>, values : Array<string>, interpolation : number ){
		super( name, times, values, interpolation );
	}

	ValueTypeName : string = 'string';
	// FIXME:
	//ValueBufferType = new Array();
	//InterpolantFactoryMethodSmooth = undefined;

	DefaultInterpolation = InterpolateDiscrete;

}

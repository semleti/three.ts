import { InterpolateLinear } from '../../constants';
import { KeyframeTrack } from '../KeyframeTrack';
import { QuaternionLinearInterpolant } from '../../math/interpolants/QuaternionLinearInterpolant';
import { Quaternion } from '../../Three';

/**
 *
 * A Track of quaternion keyframe values.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

export class QuaternionKeyframeTrack extends KeyframeTrack {
	valueTypeName : string = 'quaternion';
	// ValueBufferType is inherited

	//DefaultInterpolation: InterpolateLinear;
	constructor( name : string, times : Array<number>, values : Array<Quaternion>, interpolation : number ){
		super( name, times, values, interpolation );
	}

	InterpolantFactoryMethodLinear ( result : any ) : QuaternionLinearInterpolant {
		return new QuaternionLinearInterpolant( this.times, this.values, this.getValueSize(), result );
	}


}
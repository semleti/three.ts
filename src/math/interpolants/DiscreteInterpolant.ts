import { Interpolant } from '../Interpolant';

/**
 *
 * Interpolant that evaluates to the sample value at the position preceeding
 * the parameter.
 *
 * @author tschw
 */

export class DiscreteInterpolant extends Interpolant {

	constructor( parameterPositions : any, sampleValues : any, sampleSize : number, resultBuffer : any ){
		super( parameterPositions, sampleValues, sampleSize, resultBuffer );
	}

	interpolate_ ( i1 : number /*, t0, t, t1 */ ) {

		return this.copySampleValue_( i1 - 1 );

	}

}

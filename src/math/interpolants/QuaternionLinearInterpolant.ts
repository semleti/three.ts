import { Interpolant } from '../Interpolant';
import { Quaternion } from '../Quaternion';

/**
 * Spherical linear unit quaternion interpolant.
 *
 * @author tschw
 */

export class QuaternionLinearInterpolant extends Interpolant {

	constructor( parameterPositions : Float32Array, sampleValues : any, sampleSize : number, resultBuffer : any ){
		super( parameterPositions, sampleValues, sampleSize, resultBuffer );
	}

	interpolate_ ( i1 : number, t0 : number, t : number, t1 : number ) {

		let result = this.resultBuffer,
			values = this.sampleValues,
			stride = this.valueSize,

			offset = i1 * stride,

			alpha = ( t - t0 ) / ( t1 - t0 );

		for ( let end = offset + stride; offset !== end; offset += 4 ) {

			Quaternion.slerpFlat( result, 0, values, offset - stride, values, offset, alpha );

		}

		return result;

	}
}

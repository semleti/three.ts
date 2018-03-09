/**
 * @author TristanVALCKE / https://github.com/Itee
 */
/* global QUnit */

import '../../../dist/src/polyfills';
import { Vector3 } from '../../../dist/src/math/Vector3';

export default QUnit.module( 'Polyfills', () => {

	// PUBLIC STUFF
	QUnit.todo( "Number.EPSILON", ( assert ) => {

		assert.ok( false, "everything's gonna be alright" );

	} );

	QUnit.todo( "Number.isInteger", ( assert ) => {

		assert.ok( false, "everything's gonna be alright" );

	} );

	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
	//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-math.sign
	/*
	 20.2.2.29 Math.sign(x)

	 Returns the sign of the x, indicating whether x is positive, negative or zero.

	 If x is NaN, the result is NaN.
	 If x is -0, the result is -0.
	 If x is +0, the result is +0.
	 If x is negative and not -0, the result is -1.
	 If x is positive and not +0, the result is +1.
	 */
	QUnit.test( "Math.sign", ( assert ) => {

		assert.ok( isNaN( Math.sign( NaN ) ), "If x is NaN<NaN>, the result is NaN." );
		assert.ok( isNaN( Math.sign( new Vector3() ) ), "If x is NaN<object>, the result is NaN." );
		assert.ok( isNaN( Math.sign() ), "If x is NaN<undefined>, the result is NaN." );
		assert.ok( isNaN( Math.sign( '--3' ) ), "If x is NaN<'--3'>, the result is NaN." );
		assert.ok( isNegativeZero( Math.sign( - 0 ) ), "If x is -0, the result is -0." );
		assert.ok( Math.sign( + 0 ) === + 0, "If x is +0, the result is +0." );
		assert.ok( Math.sign( - Infinity ) === - 1, "If x is negative<-Infinity> and not -0, the result is -1." );
		assert.ok( Math.sign( '-3' ) === - 1, "If x is negative<'-3'> and not -0, the result is -1." );
		assert.ok( Math.sign( '-1e-10' ) === - 1, "If x is negative<'-1e-10'> and not -0, the result is -1." );
		assert.ok( Math.sign( + Infinity ) === + 1, "If x is positive<+Infinity> and not +0, the result is +1." );
		assert.ok( Math.sign( '+3' ) === + 1, "If x is positive<'+3'> and not +0, the result is +1." );

		// Comparing with -0 is tricky because 0 === -0. But
		// luckily 1 / -0 === -Infinity so we can use that.

		function isNegativeZero( value ) {

			return value === 0 && 1 / value < 0;

		}

	} );

	QUnit.todo( "'name' in Function.prototype", ( assert ) => {

		assert.ok( false, "everything's gonna be alright" );

	} );

	QUnit.todo( "Object.assign", ( assert ) => {

		assert.ok( false, "everything's gonna be alright" );

	} );

} );

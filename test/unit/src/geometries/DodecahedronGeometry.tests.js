/**
 * @author TristanVALCKE / https://github.com/Itee
 * @author Anonymous
 */
/* global QUnit */

import {
	DodecahedronGeometry,
	DodecahedronBufferGeometry
} from '../../../../dist/src/geometries/DodecahedronGeometry';

export default QUnit.module( 'Geometries', () => {

	QUnit.module( 'CircleGeometry', ( hooks ) => {

		var geometries = undefined;
		hooks.beforeEach( function () {

			const parameters = {
				radius: 10,
				detail: undefined
			};

			geometries = [
				new DodecahedronGeometry(),
				new DodecahedronGeometry( parameters.radius ),
				new DodecahedronGeometry( parameters.radius, parameters.detail ),
			];

		} );

		// INHERITANCE
		QUnit.todo( "Extending", ( assert ) => {

			assert.ok( false, "everything's gonna be alright" );

		} );

		// INSTANCING
		QUnit.todo( "Instancing", ( assert ) => {

			assert.ok( false, "everything's gonna be alright" );

		} );

		// OTHERS
		QUnit.test( 'Standard geometry tests', ( assert ) => {

			runStdGeometryTests( assert, geometries );

		} );

	} );

	QUnit.module( 'CircleBufferGeometry', ( hooks ) => {

		var geometries = undefined;
		hooks.beforeEach( function () {

			const parameters = {
				radius: 10,
				detail: undefined
			};

			geometries = [
				new DodecahedronBufferGeometry(),
				new DodecahedronBufferGeometry( parameters.radius ),
				new DodecahedronBufferGeometry( parameters.radius, parameters.detail ),
			];

		} );

		// INHERITANCE
		QUnit.todo( "Extending", ( assert ) => {

			assert.ok( false, "everything's gonna be alright" );

		} );

		// INSTANCING
		QUnit.todo( "Instancing", ( assert ) => {

			assert.ok( false, "everything's gonna be alright" );

		} );

		// OTHERS
		QUnit.test( 'Standard geometry tests', ( assert ) => {

			runStdGeometryTests( assert, geometries );

		} );

	} );

} );
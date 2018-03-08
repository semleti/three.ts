import { Material } from "../../materials/Material";

/**
 * @author mrdoob / http://mrdoob.com/
 */

function absNumericalSort( a, b ) {

	return Math.abs( b[ 1 ] ) - Math.abs( a[ 1 ] );

}

export class WebGLMorphtargets {

	influencesList = {};
	morphInfluences : Float32Array = new Float32Array( 8 );

	gl : any;
	constructor( gl : any ){
		this.gl = gl;
	}

	update( object : any, geometry : any, material : any, program : any ) : void {

		let objectInfluences = object.morphTargetInfluences;

		let length = objectInfluences.length;

		let influences = this.influencesList[ geometry.id ];

		if ( influences === undefined ) {

			// initialise list

			influences = [];

			for ( let i = 0; i < length; i ++ ) {

				influences[ i ] = [ i, 0 ];

			}

			this.influencesList[ geometry.id ] = influences;

		}

		let morphTargets = material.morphTargets && geometry.morphAttributes.position;
		let morphNormals = material.morphNormals && geometry.morphAttributes.normal;

		// Remove current morphAttributes

		for ( let i = 0; i < length; i ++ ) {

			let influence = influences[ i ];

			if ( influence[ 1 ] !== 0 ) {

				if ( morphTargets ) geometry.removeAttribute( 'morphTarget' + i );
				if ( morphNormals ) geometry.removeAttribute( 'morphNormal' + i );

			}

		}

		// Collect influences

		for ( let i = 0; i < length; i ++ ) {

			let influence = influences[ i ];

			influence[ 0 ] = i;
			influence[ 1 ] = objectInfluences[ i ];

		}

		influences.sort( absNumericalSort );

		// Add morphAttributes

		for ( let i = 0; i < 8; i ++ ) {

			let influence = influences[ i ];

			if ( influence ) {

				let index = influence[ 0 ];
				let value = influence[ 1 ];

				if ( value ) {

					if ( morphTargets ) geometry.addAttribute( 'morphTarget' + i, morphTargets[ index ] );
					if ( morphNormals ) geometry.addAttribute( 'morphNormal' + i, morphNormals[ index ] );

					this.morphInfluences[ i ] = value;
					continue;

				}

			}

			this.morphInfluences[ i ] = 0;

		}

		program.getUniforms().setValue( this.gl, 'morphTargetInfluences', this.morphInfluences );

	}

}

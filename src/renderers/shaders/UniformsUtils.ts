/**
 * Uniform Utilities
 */

export abstract class UniformsUtils {

	static merge ( uniforms ) {

		let merged = {};

		for ( let u = 0; u < uniforms.length; u ++ ) {

			let tmp = this.clone( uniforms[ u ] );

			for ( let p in tmp ) {

				merged[ p ] = tmp[ p ];

			}

		}

		return merged;

	}

	static clone ( uniforms_src ) {

		let uniforms_dst = {};

		for ( let u in uniforms_src ) {

			uniforms_dst[ u ] = {};

			for ( let p in uniforms_src[ u ] ) {

				let parameter_src = uniforms_src[ u ][ p ];

				if ( parameter_src && ( parameter_src.isColor ||
					parameter_src.isMatrix3 || parameter_src.isMatrix4 ||
					parameter_src.isVector2 || parameter_src.isVector3 || parameter_src.isVector4 ||
					parameter_src.isTexture ) ) {

					uniforms_dst[ u ][ p ] = parameter_src.clone();

				} else if ( Array.isArray( parameter_src ) ) {

					uniforms_dst[ u ][ p ] = parameter_src.slice();

				} else {

					uniforms_dst[ u ][ p ] = parameter_src;

				}

			}

		}

		return uniforms_dst;

	}

}
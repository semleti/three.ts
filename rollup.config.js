function glsl() {

	return {

		transform( code, id ) {

			if ( /\.glsl$/.test( id ) === false ) return;

			var transformedCode = 'export default ' + JSON.stringify(
				code
					.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
					.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
					.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
			) + ';';
			return {
				code: transformedCode,
				map: { mappings: '' }
			};

		}

	};

}

export default {
	input: 'dist/src/Three.js',
	plugins: [
		glsl()
	],
	// sourceMap: true,
	output: [
		{
			format: 'umd',
			name: 'THREE',
			file: 'dist/three.js',
			indent: '\t'
		},
		{
			format: 'es',
			file: 'dist/three.module.js',
			indent: '\t'
		}
	],
	//prevent rewrite from 'this' to 'undefined' in class extension 
	context: "this"
};
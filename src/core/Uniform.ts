/**
 * @author mrdoob / http://mrdoob.com/
 */

export class Uniform {

	value : any;
	constructor( value : any ){
		if ( typeof value === 'string' ) {
	
			console.warn( 'THREE.Uniform: Type parameter is no longer needed.' );
			value = arguments[ 1 ];
	
		}
	
		this.value = value;

	}

	clone () : Uniform {

		return new Uniform( this.value.clone === undefined ? this.value : this.value.clone() );
	
	}
}

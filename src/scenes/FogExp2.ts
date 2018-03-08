import { Color } from '../math/Color';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

export class FogExp2 {

	name : string = '';
	color : Color;
	density : number;
	isFogExp2 : boolean = true;
	constructor( color : number, density : number ){

		this.color = new Color( color );
		this.density = ( density !== undefined ) ? density : 0.00025;
	}

	clone () : FogExp2 {

		return new FogExp2( this.color.getHex(), this.density );
	
	}

	toJSON ( /* meta */ ) {

		return {
			type: 'FogExp2',
			color: this.color.getHex(),
			density: this.density
		}
	
	}

}
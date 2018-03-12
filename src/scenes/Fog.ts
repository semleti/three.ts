import { Color } from '../math/Color';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

export class Fog {
	name : string = '';
	color;near;far;
	isFog  : boolean= true;
	constructor( color : number, near : number = 1, far : number = 1000 ){

		this.color = new Color( color );
	
		this.near = near;
		this.far = far;
	}

	clone  () : Fog {

		return new Fog( this.color.getHex(), this.near, this.far );
	
	};

	toJSON ( /* meta */ ) {

		return {
			type: 'Fog',
			color: this.color.getHex(),
			near: this.near,
			far: this.far
		}
	
	}

}
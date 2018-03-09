import { Light } from './Light';
import { Color } from '../math/Color';
import { Object3D } from '../core/Object3D';

/**
 * @author alteredq / http://alteredqualia.com/
 */

export class HemisphereLight extends Light {

	type : string = 'HemisphereLight';
	groundColor : Color;
	isHemisphereLight : boolean = true;
	constructor( skyColor : Color, groundColor : Color, intensity : number ){
		super( skyColor, intensity );
		this.castShadow = undefined;

		this.position.copy( Object3D.DefaultUp );
		this.updateMatrix();

		this.groundColor = new Color( groundColor );
	}

	clone () : HemisphereLight {
		return new HemisphereLight(this.color, this.groundColor, this.intensity).copy(this);
	}

	copy ( source : HemisphereLight ) : HemisphereLight {

		super.copy(source);

		this.groundColor.copy( source.groundColor );

		return this;

	}
	

}
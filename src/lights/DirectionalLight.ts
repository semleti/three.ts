import { Light } from './Light';
import { DirectionalLightShadow } from './DirectionalLightShadow';
import { Object3D } from '../core/Object3D';
import { Color } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

export class DirectionalLight extends Light {

	type : string = 'DirectionalLight';
	target : Object3D;
	shadow : DirectionalLightShadow;
	isDirectionalLight = true;
	constructor( color : Color, intensity : number ){
		super( color, intensity );
		this.position.copy( Object3D.DefaultUp );
		this.updateMatrix();

		this.target = new Object3D();

		this.shadow = new DirectionalLightShadow();
	}

	copy ( source : DirectionalLight ) : DirectionalLight {

		super.copy( source );

		this.target = source.target.clone();

		this.shadow = source.shadow.clone();

		return this;

	}

	

}

import { Light } from './Light';
import { SpotLightShadow } from './SpotLightShadow';
import { Object3D } from '../core/Object3D';
import { Color, LightShadow } from '../Three';

/**
 * @author alteredq / http://alteredqualia.com/
 */

export class SpotLight extends Light {

	type : string = 'SpotLight';
	target : Object3D;
	decay : number;
	shadow : LightShadow;
	isSpotLight : boolean = true;
	constructor( color : Color, intensity : number, distance : number, angle : number, penumbra : number, decay : number ){
		super(color, intensity);
		this.position.copy( Object3D.DefaultUp );
		this.updateMatrix();

		this.target = new Object3D();

		this.distance = ( distance !== undefined ) ? distance : 0;
		this.angle = ( angle !== undefined ) ? angle : Math.PI / 3;
		this.penumbra = ( penumbra !== undefined ) ? penumbra : 0;
		this.decay = ( decay !== undefined ) ? decay : 1;	// for physically correct lights, should be 2.

		this.shadow = new SpotLightShadow();
	}

	get power () : number {

		// intensity = power per solid angle.
		// ref: equation (17) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		return this.intensity * Math.PI;

	}

	set power ( power : number ) {

		// intensity = power per solid angle.
		// ref: equation (17) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		this.intensity = power / Math.PI;

	}

	clone() : SpotLight {
		return new SpotLight(this.color, this.intensity, this.distance, this.angle, this.penumbra, this.decay).copy(this);
	}

	copy ( source : SpotLight ) : SpotLight {

		super.copy( source );

		this.distance = source.distance;
		this.angle = source.angle;
		this.penumbra = source.penumbra;
		this.decay = source.decay;

		this.target = source.target.clone();

		this.shadow = source.shadow.clone();

		return this;

	}

}

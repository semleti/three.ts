import { Light } from './Light';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { LightShadow } from './LightShadow';
import { Color } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 */


export class PointLight extends Light {

	type : string = 'PointLight';
	shadow : LightShadow;
	isPointLight : boolean = true;
	constructor( color : Color, intensity : number, distance : number = 0, decay : number = 1 ){
		super( color, intensity );
		this.distance = distance;
		this.decay = decay;	// for physically correct lights, should be 2.

		this.shadow = new LightShadow( new PerspectiveCamera( 90, 1, 0.5, 500 ) );
	}

	get power () : number {

		// intensity = power per solid angle.
		// ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		return this.intensity * 4 * Math.PI;

	}

	set power ( power : number ) {

		// intensity = power per solid angle.
		// ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		this.intensity = power / ( 4 * Math.PI );

	}

	clone() : PointLight {
		return new PointLight(this.color, this.intensity, this.distance, this.decay).copy(this);
	}
	
	copy ( source : PointLight ) : PointLight {

		super.copy(source);

		this.distance = source.distance;
		this.decay = source.decay;

		this.shadow = source.shadow.clone();

		return this;
	}
}
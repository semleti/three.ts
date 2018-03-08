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
	constructor( color : Color, intensity : number, distance : number, decay : number ){
		super( color, intensity );
		this.distance = ( distance !== undefined ) ? distance : 0;
		this.decay = ( decay !== undefined ) ? decay : 1;	// for physically correct lights, should be 2.

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
	
	copy ( source : PointLight ) : PointLight {

		super.copy(source);

		this.distance = source.distance;
		this.decay = source.decay;

		this.shadow = source.shadow.clone();

		return this;
	}
}
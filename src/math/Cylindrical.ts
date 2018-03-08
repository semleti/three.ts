import { Vector3 } from "../Three";

/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Ref: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system
 *
 */

export class Cylindrical {

	radius : number;
	theta : number;
	y : number;
	constructor( radius? : number, theta? : number, y? : number ){
		this.radius = ( radius !== undefined ) ? radius : 1.0; // distance from the origin to a point in the x-z plane
		this.theta = ( theta !== undefined ) ? theta : 0; // counterclockwise angle in the x-z plane measured in radians from the positive z-axis
		this.y = ( y !== undefined ) ? y : 0; // height above the x-z plane
	}
	
	set ( radius : number, theta : number, y : number ) {

		this.radius = radius;
		this.theta = theta;
		this.y = y;

		return this;

	}

	clone () : Cylindrical {

		return new Cylindrical().copy( this );

	}

	copy ( other : Cylindrical ) : Cylindrical {

		this.radius = other.radius;
		this.theta = other.theta;
		this.y = other.y;

		return this;

	}

	setFromVector3 ( vec3 : Vector3 ) : Cylindrical {

		this.radius = Math.sqrt( vec3.x * vec3.x + vec3.z * vec3.z );
		this.theta = Math.atan2( vec3.x, vec3.z );
		this.y = vec3.y;

		return this;

	}

}

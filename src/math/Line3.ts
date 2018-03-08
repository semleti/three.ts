import { Vector3 } from './Vector3';
import { _Math } from './Math';
import { Matrix3, Matrix4, Line } from '../Three';

/**
 * @author bhouston / http://clara.io
 */

export class Line3 {
	start : Vector3;
	end : Vector3;
	constructor( start? : Vector3, end? : Vector3 ){
		this.start = ( start !== undefined ) ? start : new Vector3();
		this.end = ( end !== undefined ) ? end : new Vector3();
	}
	
	set ( start : Vector3, end : Vector3 ) {

		this.start.copy( start );
		this.end.copy( end );

		return this;

	}

	clone () : Line3 {

		return new Line3().copy( this );

	}

	copy ( line : Line3 ) : Line3 {

		this.start.copy( line.start );
		this.end.copy( line.end );

		return this;

	}

	getCenter ( optionalTarget : Vector3 ) : Vector3 {

		let result = optionalTarget || new Vector3();
		return result.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

	}

	delta ( optionalTarget? : Vector3 ) : Vector3 {

		let result = optionalTarget || new Vector3();
		return result.subVectors( this.end, this.start );

	}

	distanceSq () : number {

		return this.start.distanceToSquared( this.end );

	}

	distance () : number {

		return this.start.distanceTo( this.end );

	}

	at ( t : number, optionalTarget? : Vector3 ) : Vector3 {

		let result = optionalTarget || new Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	}

	closestPointToPointParameter( point : Vector3, clampToLine : boolean ) : number {
		let startP = new Vector3();
		let startEnd = new Vector3();
		startP.subVectors( point, this.start );
		startEnd.subVectors( this.end, this.start );

		let startEnd2 = startEnd.dot( startEnd );
		let startEnd_startP = startEnd.dot( startP );

		let t = startEnd_startP / startEnd2;

		if ( clampToLine ) {

			t = _Math.clamp( t, 0, 1 );

		}

		return t;

	}

	closestPointToPoint ( point : Vector3, clampToLine : boolean, optionalTarget? : Vector3 ) : Vector3 {

		let t = this.closestPointToPointParameter( point, clampToLine );

		let result = optionalTarget || new Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	}

	applyMatrix4 ( matrix : Matrix4 ) : Line3 {

		this.start.applyMatrix4( matrix );
		this.end.applyMatrix4( matrix );

		return this;

	}

	equals ( line : Line3 ) : boolean {

		return line.start.equals( this.start ) && line.end.equals( this.end );

	}
}

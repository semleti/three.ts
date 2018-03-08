import { Vector3 } from '../../math/Vector3';
import { Curve } from '../core/Curve';


export class LineCurve3 extends Curve {
	type = 'LineCurve3';
	v1 : Vector3;
	v2 : Vector3;
	isLineCurve3 : boolean = true;
	constructor( v1? : Vector3, v2? : Vector3 ){
		super();
		this.v1 = v1 || new Vector3();
		this.v2 = v2 || new Vector3();
	}

	getPoint ( t : number, optionalTarget? : Vector3 ) : Vector3 {

		let point = optionalTarget || new Vector3();

		if ( t === 1 ) {

			point.copy( this.v2 );

		} else {

			point.copy( this.v2 ).sub( this.v1 );
			point.multiplyScalar( t ).add( this.v1 );

		}

		return point;

	}

	// Line curve is linear, so we can overwrite default getPointAt

	getPointAt ( u : number, optionalTarget? : Vector3 ) : Vector3 {

		return this.getPoint( u, optionalTarget );

	}

	copy ( source : LineCurve3 ) : LineCurve3 {

		super.copy(source);

		this.v1.copy( source.v1 );
		this.v2.copy( source.v2 );

		return this;

	}

	toJSON () : LineCurve3.Data {

		let data = super.toJSON() as LineCurve3.Data;

		data.v1 = this.v1.toArray();
		data.v2 = this.v2.toArray();

		return data;

	}

	fromJSON ( json : LineCurve3.Data ) {

		super.fromJSON(json);

		this.v1.fromArray( json.v1 );
		this.v2.fromArray( json.v2 );

		return this;

	}

}

export module LineCurve3{
	export class Data extends Curve.Data{
		v1;
		v2;
	}
}

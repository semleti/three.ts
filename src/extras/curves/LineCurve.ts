import { Vector2 } from '../../math/Vector2';
import { Curve } from '../core/Curve';
import { Vector3, Line } from '../../Three';


export class LineCurve extends Curve {
	type : string = 'LineCurve';
	v1 : Vector2;
	v2 : Vector2;
	isLineCurve : boolean = true;
	constructor( v1? : Vector2, v2? : Vector2 ){
		super();
		this.v1 = v1 || new Vector2();
		this.v2 = v2 || new Vector2();
	}

	getPoint ( t : number, optionalTarget? : Vector2 ) : Vector2 {

		let point = optionalTarget || new Vector2();

		if ( t === 1 ) {

			point.copy( this.v2 );

		} else {

			point.copy( this.v2 ).sub( this.v1 );
			point.multiplyScalar( t ).add( this.v1 );

		}

		return point;

	}

	// Line curve is linear, so we can overwrite default getPointAt

	getPointAt ( u : number, optionalTarget? : Vector2 ) : Vector2 {

		return this.getPoint( u, optionalTarget );

	}

	getTangent ( /* t */ ) : Vector2 {

		let tangent = this.v2.clone().sub( this.v1 );

		return tangent.normalize();

	}

	copy ( source : LineCurve ) : LineCurve {

		super.copy(source);

		this.v1.copy( source.v1 );
		this.v2.copy( source.v2 );

		return this;

	}

	toJSON () : LineCurve.Data {

		let data = super.toJSON() as LineCurve.Data;

		data.v1 = this.v1.toArray();
		data.v2 = this.v2.toArray();

		return data;

	}

	fromJSON ( json : LineCurve.Data ) : LineCurve {

		super.fromJSON(json);

		this.v1.fromArray( json.v1 );
		this.v2.fromArray( json.v2 );

		return this;

	}

}

export module LineCurve{
	export class Data extends Curve.Data{
		v1;
		v2;
	}
}

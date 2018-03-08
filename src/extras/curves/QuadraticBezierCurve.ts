import { Curve } from '../core/Curve';
import { QuadraticBezier } from '../core/Interpolations';
import { Vector2 } from '../../math/Vector2';


export class QuadraticBezierCurve extends Curve {
	type = 'QuadraticBezierCurve';
	v0 : Vector2;
	v1 : Vector2;
	v2 : Vector2;
	isQuadraticBezierCurve : boolean = true;
	constructor( v0? : Vector2, v1? : Vector2, v2? : Vector2 ){
		super();
		this.v0 = v0 || new Vector2();
		this.v1 = v1 || new Vector2();
		this.v2 = v2 || new Vector2();
	}

	getPoint ( t : number, optionalTarget? : Vector2 ) : Vector2 {

		let point = optionalTarget || new Vector2();

		let v0 = this.v0, v1 = this.v1, v2 = this.v2;

		point.set(
			QuadraticBezier( t, v0.x, v1.x, v2.x ),
			QuadraticBezier( t, v0.y, v1.y, v2.y )
		);

		return point;

	}

	copy ( source : QuadraticBezierCurve ) : QuadraticBezierCurve {

		super.copy(source);

		this.v0.copy( source.v0 );
		this.v1.copy( source.v1 );
		this.v2.copy( source.v2 );

		return this;

	}

	toJSON () : QuadraticBezierCurve.Data {

		let data = super.toJSON() as QuadraticBezierCurve.Data;

		data.v0 = this.v0.toArray();
		data.v1 = this.v1.toArray();
		data.v2 = this.v2.toArray();

		return data;

	}

	fromJSON ( json : QuadraticBezierCurve.Data ) {

		super.fromJSON(json);

		this.v0.fromArray( json.v0 );
		this.v1.fromArray( json.v1 );
		this.v2.fromArray( json.v2 );

		return this;

	}

}

export module QuadraticBezierCurve{
	export class Data extends Curve.Data{
		v0;
		v1;
		v2;
	}
}
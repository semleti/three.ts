import { Curve } from '../core/Curve';
import { QuadraticBezier } from '../core/Interpolations';
import { Vector3 } from '../../math/Vector3';


export class QuadraticBezierCurve3 extends Curve {
	type = 'QuadraticBezierCurve3';
	v0 : Vector3;
	v1 : Vector3;
	v2 : Vector3;
	isQuadraticBezierCurve3 : boolean = true;
	constructor( v0 : Vector3, v1 : Vector3, v2 : Vector3 ){
		super();
		this.v0 = v0 || new Vector3();
		this.v1 = v1 || new Vector3();
		this.v2 = v2 || new Vector3();
	}

	getPoint ( t : number, optionalTarget? : Vector3 ) : Vector3 {

		let point = optionalTarget || new Vector3();

		let v0 = this.v0, v1 = this.v1, v2 = this.v2;

		point.set(
			QuadraticBezier( t, v0.x, v1.x, v2.x ),
			QuadraticBezier( t, v0.y, v1.y, v2.y ),
			QuadraticBezier( t, v0.z, v1.z, v2.z )
		);

		return point;

	}

	copy ( source : QuadraticBezierCurve3 ) : QuadraticBezierCurve3 {

		super.copy(source);

		this.v0.copy( source.v0 );
		this.v1.copy( source.v1 );
		this.v2.copy( source.v2 );

		return this;

	}

	toJSON () : QuadraticBezierCurve3.Data {

		let data = super.toJSON() as QuadraticBezierCurve3.Data;

		data.v0 = this.v0.toArray();
		data.v1 = this.v1.toArray();
		data.v2 = this.v2.toArray();

		return data;

	}

	fromJSON ( json : QuadraticBezierCurve3.Data ) : QuadraticBezierCurve3 {

		super.fromJSON(json);

		this.v0.fromArray( json.v0 );
		this.v1.fromArray( json.v1 );
		this.v2.fromArray( json.v2 );

		return this;

	}

}

export module QuadraticBezierCurve3{
	export class Data extends Curve.Data{
		v0;
		v1;
		v2;
	}
}

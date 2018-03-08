import { Curve } from '../core/Curve';
import { CubicBezier } from '../core/Interpolations';
import { Vector3 } from '../../math/Vector3';


export class CubicBezierCurve3 extends Curve {
	type = 'CubicBezierCurve3';
	v0 : Vector3;
	v1 : Vector3;
	v2 : Vector3;
	v3 : Vector3;
	isCubicBezierCurve3 : boolean = true;
	constructor( v0 : Vector3, v1 : Vector3, v2 : Vector3, v3 : Vector3 ){
		super();
		this.v0 = v0 || new Vector3();
		this.v1 = v1 || new Vector3();
		this.v2 = v2 || new Vector3();
		this.v3 = v3 || new Vector3();
	}

	getPoint ( t : number, optionalTarget? : Vector3 ) : Vector3 {

		let point = optionalTarget || new Vector3();

		let v0 = this.v0, v1 = this.v1, v2 = this.v2, v3 = this.v3;

		point.set(
			CubicBezier( t, v0.x, v1.x, v2.x, v3.x ),
			CubicBezier( t, v0.y, v1.y, v2.y, v3.y ),
			CubicBezier( t, v0.z, v1.z, v2.z, v3.z )
		);

		return point;

	}

	copy ( source : CubicBezierCurve3 ) : CubicBezierCurve3 {

		super.copy(source);

		this.v0.copy( source.v0 );
		this.v1.copy( source.v1 );
		this.v2.copy( source.v2 );
		this.v3.copy( source.v3 );

		return this;

	}

	toJSON () : CubicBezierCurve3.Data {

		let data = super.toJSON() as CubicBezierCurve3.Data;

		data.v0 = this.v0.toArray();
		data.v1 = this.v1.toArray();
		data.v2 = this.v2.toArray();
		data.v3 = this.v3.toArray();

		return data;

	}

	fromJSON ( json : CubicBezierCurve3.Data ) : CubicBezierCurve3 {

		super.fromJSON(json);

		this.v0.fromArray( json.v0 );
		this.v1.fromArray( json.v1 );
		this.v2.fromArray( json.v2 );
		this.v3.fromArray( json.v3 );

		return this;

	}

}

export module CubicBezierCurve3{
	export class Data extends Curve.Data{
		v0;
		v1;
		v2;
		v3;
	}
}

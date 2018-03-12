import { Curve } from '../core/Curve';
import { CatmullRom } from '../core/Interpolations';
import { Vector2 } from '../../math/Vector2';
import { Vector3 } from '../../math/Vector3';


export class SplineCurve extends Curve {
	type : string = 'SplineCurve';
	points : Array<Vector2>;
	isSplineCurve : boolean = true;
	constructor( points : Array<Vector2> = [] ){
		super();
		this.points = points;
	}

	getPoint ( t : number, optionalTarget? : Vector2 ) : Vector2 {

		let point = optionalTarget || new Vector2();

		let points = this.points;
		let p = ( points.length - 1 ) * t;

		let intPoint = Math.floor( p );
		let weight = p - intPoint;

		let p0 = points[ intPoint === 0 ? intPoint : intPoint - 1 ];
		let p1 = points[ intPoint ];
		let p2 = points[ intPoint > points.length - 2 ? points.length - 1 : intPoint + 1 ];
		let p3 = points[ intPoint > points.length - 3 ? points.length - 1 : intPoint + 2 ];

		point.set(
			CatmullRom( weight, p0.x, p1.x, p2.x, p3.x ),
			CatmullRom( weight, p0.y, p1.y, p2.y, p3.y )
		);

		return point;

	}

	copy ( source : SplineCurve ) : SplineCurve {

		super.copy(source);

		this.points = [];

		for ( let i = 0, l = source.points.length; i < l; i ++ ) {

			let point = source.points[ i ];

			this.points.push( point.clone() );

		}

		return this;

	}

	toJSON () : SplineCurve.Data {

		let data = super.toJSON() as SplineCurve.Data;

		data.points = [];

		for ( let i = 0, l = this.points.length; i < l; i ++ ) {

			let point = this.points[ i ];
			data.points.push( point.toArray() );

		}

		return data;

	}

	fromJSON ( json : SplineCurve.Data ) {

		super.fromJSON(json);

		this.points = [];

		for ( let i = 0, l = json.points.length; i < l; i ++ ) {

			let point = json.points[ i ];
			this.points.push( new Vector2().fromArray( point ) );

		}

		return this;

	}

}

export module SplineCurve{
	export class Data extends Curve.Data{
		points;
	}
}
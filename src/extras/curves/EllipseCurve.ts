import { Curve } from '../core/Curve';
import { Vector2 } from '../../math/Vector2';


export class EllipseCurve extends Curve {
	type : string = 'EllipseCurve';
	aX : number;
	aY : number;
	xRadius : number;
	yRadius : number;
	aStartAngle : number;
	aEndAngle : number;
	aClockwise : boolean;
	aRotation : number;
	isEllipseCurve : boolean = true;
	constructor( aX : number = 0, aY : number = 0, xRadius : number = 1, yRadius : number = 1, aStartAngle : number = 0,
		aEndAngle : number = 2 * Math.PI, aClockwise : boolean = false, aRotation : number = 0 ){
		super();
		this.aX = aX;
		this.aY = aY;

		this.xRadius = xRadius;
		this.yRadius = yRadius;

		this.aStartAngle = aStartAngle;
		this.aEndAngle = aEndAngle;

		this.aClockwise = aClockwise;

		this.aRotation = aRotation;

	}


	getPoint ( t : number, optionalTarget? : Vector2 ) : Vector2 {

		let point = optionalTarget || new Vector2();

		let twoPi = Math.PI * 2;
		let deltaAngle = this.aEndAngle - this.aStartAngle;
		let samePoints = Math.abs( deltaAngle ) < (Number as any).EPSILON;

		// ensures that deltaAngle is 0 .. 2 PI
		while ( deltaAngle < 0 ) deltaAngle += twoPi;
		while ( deltaAngle > twoPi ) deltaAngle -= twoPi;

		if ( deltaAngle < (Number as any).EPSILON ) {

			if ( samePoints ) {

				deltaAngle = 0;

			} else {

				deltaAngle = twoPi;

			}

		}

		if ( this.aClockwise === true && ! samePoints ) {

			if ( deltaAngle === twoPi ) {

				deltaAngle = - twoPi;

			} else {

				deltaAngle = deltaAngle - twoPi;

			}

		}

		let angle = this.aStartAngle + t * deltaAngle;
		let x = this.aX + this.xRadius * Math.cos( angle );
		let y = this.aY + this.yRadius * Math.sin( angle );

		if ( this.aRotation !== 0 ) {

			let cos = Math.cos( this.aRotation );
			let sin = Math.sin( this.aRotation );

			let tx = x - this.aX;
			let ty = y - this.aY;

			// Rotate the point about the center of the ellipse.
			x = tx * cos - ty * sin + this.aX;
			y = tx * sin + ty * cos + this.aY;

		}

		return point.set( x, y );

	}

	copy ( source : EllipseCurve ) : EllipseCurve {

		super.copy(source);

		this.aX = source.aX;
		this.aY = source.aY;

		this.xRadius = source.xRadius;
		this.yRadius = source.yRadius;

		this.aStartAngle = source.aStartAngle;
		this.aEndAngle = source.aEndAngle;

		this.aClockwise = source.aClockwise;

		this.aRotation = source.aRotation;

		return this;

	}


	toJSON () : EllipseCurve.Data {

		let data = super.toJSON() as EllipseCurve.Data;

		data.aX = this.aX;
		data.aY = this.aY;

		data.xRadius = this.xRadius;
		data.yRadius = this.yRadius;

		data.aStartAngle = this.aStartAngle;
		data.aEndAngle = this.aEndAngle;

		data.aClockwise = this.aClockwise;

		data.aRotation = this.aRotation;

		return data;

	}

	fromJSON ( json : EllipseCurve.Data ) : EllipseCurve {

		super.fromJSON(json);

		this.aX = json.aX;
		this.aY = json.aY;

		this.xRadius = json.xRadius;
		this.yRadius = json.yRadius;

		this.aStartAngle = json.aStartAngle;
		this.aEndAngle = json.aEndAngle;

		this.aClockwise = json.aClockwise;

		this.aRotation = json.aRotation;

		return this;

	}
}

export module EllipseCurve{
	export class Data extends Curve.Data{
		aX : number;
		aY : number;
		xRadius : number;
		yRadius : number;
		aStartAngle : number;
		aEndAngle : number;
		aClockwise : boolean;
		aRotation : number;
	}
}

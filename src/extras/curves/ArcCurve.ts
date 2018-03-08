import { EllipseCurve } from './EllipseCurve';


export class ArcCurve extends EllipseCurve {
	type : string = 'ArcCurve';
	isArcCurve : boolean = true;
	constructor( aX : number, aY : number, aRadius : number, aStartAngle : number, aEndAngle : number, aClockwise : number ){
		super( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise );
	}
}

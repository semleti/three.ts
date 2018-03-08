/**
 * @author abelnation / http://github.com/abelnation
 */

import { CylinderGeometry } from './CylinderGeometry';
import { CylinderBufferGeometry } from './CylinderGeometry';

// ConeGeometry

export class ConeGeometry extends CylinderGeometry {
	type : string = 'ConeGeometry';
	constructor( radius : number, height : number, radialSegments : number, heightSegments : number, openEnded : boolean, thetaStart : number, thetaLength : number )
	{
		super(0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength );
		this.parameters = {
			radius: radius,
			height: height,
			radialSegments: radialSegments,
			heightSegments: heightSegments,
			openEnded: openEnded,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
	}

}


// ConeBufferGeometry

export class ConeBufferGeometry extends CylinderBufferGeometry {
	type : string = 'ConeBufferGeometry';
	constructor( radius : number, height : number, radialSegments : number, heightSegments : number, openEnded : boolean, thetaStart : number, thetaLength : number )
	{
		super(0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength );
		this.parameters = {
			radius: radius,
			height: height,
			radialSegments: radialSegments,
			heightSegments: heightSegments,
			openEnded: openEnded,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
	}

}


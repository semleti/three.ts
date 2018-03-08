/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

import { Earcut } from './Earcut';
import { Vector2 } from '../math/Vector2';

export abstract class ShapeUtils{

	// calculate area of the contour polygon

	static area ( contour : Array<Vector2> ) : number {

		let n = contour.length;
		let a = 0.0;

		for ( let p = n - 1, q = 0; q < n; p = q ++ ) {

			a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

		}

		return a * 0.5;

	}

	static isClockWise ( pts : Array<Vector2> ) : boolean {

		return ShapeUtils.area( pts ) < 0;

	}

	static triangulateShape ( contour : Array<Vector2>, holes : Array<Array<Vector2>> ) : Array<Vector2> {

		let vertices = []; // flat array of vertices like [ x0,y0, x1,y1, x2,y2, ... ]
		let holeIndices = []; // array of hole indices
		let faces = []; // final array of vertex indices like [ [ a,b,d ], [ b,c,d ] ]

		removeDupEndPts( contour );
		addContour( vertices, contour );

		//

		let holeIndex = contour.length;

		holes.forEach( removeDupEndPts );

		for ( let i = 0; i < holes.length; i ++ ) {

			holeIndices.push( holeIndex );
			holeIndex += holes[ i ].length;
			addContour( vertices, holes[ i ] );

		}

		//

		let triangles = Earcut.triangulate( vertices, holeIndices );

		//

		for ( let i = 0; i < triangles.length; i += 3 ) {

			faces.push( triangles.slice( i, i + 3 ) );

		}

		return faces;

	}

}

function removeDupEndPts( points : Array<Vector2> ) : void {

	let l = points.length;

	if ( l > 2 && points[ l - 1 ].equals( points[ 0 ] ) ) {

		points.pop();

	}

}

function addContour( vertices : Array<number>, contour : Array<Vector2> ) : void {

	for ( let i = 0; i < contour.length; i ++ ) {

		vertices.push( contour[ i ].x );
		vertices.push( contour[ i ].y );

	}

}
import { Path } from './Path';
import { _Math } from '../../math/Math';
import { Curve } from './Curve';
import { Vector3 } from '../../math/Vector3';
import { Vector2 } from '../../math/Vector2';
import { ShapePath } from './ShapePath';

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Defines a 2d shape plane using paths.
 **/

// STEP 1 Create a path.
// STEP 2 Turn path into shape.
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// STEP 3a - Extract points from each shape, turn to vertices
// STEP 3b - Triangulate each shape, add faces.

export class Shape extends Path {
	uuid : string = _Math.generateUUID();
	type : string = 'Shape';
	holes : Array<Curve> = [];
	curves : Array<Curve>;

	constructor( points? : Array<Vector3> ){
		super(points);
	}

	

	getPointsHoles ( divisions : number ) : Array<Array<Vector2>> {

		let holesPts = [];

		for ( let i = 0, l = this.holes.length; i < l; i ++ ) {

			holesPts[ i ] = this.holes[ i ].getPoints( divisions );

		}

		return holesPts;

	}

	// get points of shape and holes (keypoints based on segments parameter)

	extractPoints ( divisions : number ) {

		return {

			shape: this.getPoints( divisions ),
			holes: this.getPointsHoles( divisions )

		};

	}

	copy ( source : Shape ) : Shape {

		super.copy( source );

		this.holes = [];

		for ( let i = 0, l = source.holes.length; i < l; i ++ ) {

			let hole = source.holes[ i ];

			this.holes.push( hole.clone() );

		}

		return this;

	}

	toJSON () {

		let data = super.toJSON( ) as Shape.Data;

		data.uuid = this.uuid;
		data.holes = [];

		for ( let i = 0, l = this.holes.length; i < l; i ++ ) {

			let hole = this.holes[ i ];
			data.holes.push( hole.toJSON() );

		}

		return data;

	}

	fromJSON ( json ) : Shape {

		super.fromJSON( json );

		this.uuid = json.uuid;
		this.holes = [];

		for ( let i = 0, l = json.holes.length; i < l; i ++ ) {

			let hole = json.holes[ i ];
			this.holes.push( new Path().fromJSON( hole ) );

		}

		return this;

	}

}

export module Shape{
	export class Data extends Path.Data{
		uuid : string;
		holes;
	}
}

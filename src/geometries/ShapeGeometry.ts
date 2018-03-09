/**
 * @author jonobr1 / http://jonobr1.com
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { ShapeUtils } from '../extras/ShapeUtils';
import { Shape } from '../extras/core/Shape';

// ShapeGeometry

export class ShapeGeometry extends Geometry {

	type : string = 'ShapeGeometry';
	constructor( shapes : Array<Shape>, curveSegments : number | any ){
		super();
		if ( typeof curveSegments === 'object' ) {

			console.warn( 'THREE.ShapeGeometry: Options parameter has been removed.' );
	
			curveSegments = curveSegments.curveSegments;
	
		}
	
		this.parameters = {
			shapes: shapes,
			curveSegments: curveSegments
		};
	
		this.fromBufferGeometry( new ShapeBufferGeometry( shapes, curveSegments ) );
		this.mergeVertices();
	}

	toJSON () {

		let data = super.toJSON();
	
		let shapes = this.parameters.shapes;
	
		return toJSON( shapes, data );
	
	}

}

// ShapeBufferGeometry

export class ShapeBufferGeometry extends BufferGeometry {

	type : string = 'ShapeBufferGeometry';
	// buffers
	
	indices : Array<number> = [];
	vertices : Array<number> = [];
	normals : Array<number> = [];
	uvs : Array<number> = [];
	// helper variables
	
	groupStart : number = 0;
	groupCount : number = 0;
	curveSegments : number;
	constructor( shapes : Shape | Array<Shape>, curveSegments? : number ){
		super();
		this.parameters = {
			shapes: shapes,
			curveSegments: curveSegments
		};
	
		this.curveSegments = curveSegments || 12;
	
		
	
		
	
		// allow single and array values for "shapes" parameter
	
		if ( Array.isArray( shapes ) === false ) {
	
			this.addShape( shapes as Shape );
	
		} else {
	
			for ( let i = 0; i < (shapes as Array<Shape>).length; i ++ ) {
	
				this.addShape( shapes[ i ] );
	
				this.addGroup( this.groupStart, this.groupCount, i ); // enables MultiMaterial support
	
				this.groupStart += this.groupCount;
				this.groupCount = 0;
	
			}
	
		}
	
		// build geometry
	
		this.setIndex( this.indices );
		this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );
	}

	clone() : ShapeBufferGeometry {
		return new ShapeBufferGeometry(this.parameters.shapes,this.parameters.curveSegments).copy(this);
	}

	copy( source : ShapeBufferGeometry) : ShapeBufferGeometry {
		super.copy(source);
		this.vertices = source.vertices;
		this.indices = source.indices;
		return this;
	}

	


	// helper functions

	addShape( shape : Shape ) : void {

		let i, l, shapeHole;

		let indexOffset = this.vertices.length / 3;
		let points = shape.extractPoints( this.curveSegments );

		let shapeVertices = points.shape;
		let shapeHoles = points.holes;

		// check direction of vertices

		if ( ShapeUtils.isClockWise( shapeVertices ) === false ) {

			shapeVertices = shapeVertices.reverse();

			// also check if holes are in the opposite direction

			for ( i = 0, l = shapeHoles.length; i < l; i ++ ) {

				shapeHole = shapeHoles[ i ];

				if ( ShapeUtils.isClockWise( shapeHole ) === true ) {

					shapeHoles[ i ] = shapeHole.reverse();

				}

			}

		}

		let faces = ShapeUtils.triangulateShape( shapeVertices, shapeHoles );

		// join vertices of inner and outer paths to a single array

		for ( i = 0, l = shapeHoles.length; i < l; i ++ ) {

			shapeHole = shapeHoles[ i ];
			shapeVertices = shapeVertices.concat( shapeHole );

		}

		// vertices, normals, uvs

		for ( i = 0, l = shapeVertices.length; i < l; i ++ ) {

			let vertex = shapeVertices[ i ];

			this.vertices.push( vertex.x, vertex.y, 0 );
			this.normals.push( 0, 0, 1 );
			this.uvs.push( vertex.x, vertex.y ); // world uvs

		}

		// incides

		for ( i = 0, l = faces.length; i < l; i ++ ) {

			let face = faces[ i ];

			let a = face[ 0 ] + indexOffset;
			let b = face[ 1 ] + indexOffset;
			let c = face[ 2 ] + indexOffset;

			this.indices.push( a, b, c );
			this.groupCount += 3;

		}

	}

	toJSON () {

		let data = super.toJSON();
	
		let shapes = this.parameters.shapes;
	
		return toJSON( shapes, data );
	
	}

}

//

function toJSON( shapes : Shape | Array<Shape>, data : any ) {

	data.shapes = [];

	if ( Array.isArray( shapes ) ) {

		for ( let i = 0, l = shapes.length; i < l; i ++ ) {

			let shape = shapes[ i ];

			data.shapes.push( shape.uuid );

		}

	} else {

		data.shapes.push( shapes.uuid );

	}

	return data;

}
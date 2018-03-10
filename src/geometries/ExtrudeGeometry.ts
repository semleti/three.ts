/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Creates extruded geometry from a path shape.
 *
 * parameters = {
 *
 *  curveSegments: <int>, // number of points on the curves
 *  steps: <int>, // number of points for z-side extrusions / used for subdividing segments of extrude spline too
 *  amount: <int>, // Depth to extrude the shape
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into the original shape bevel goes
 *  bevelSize: <float>, // how far from shape outline is bevel
 *  bevelSegments: <int>, // number of bevel layers
 *
 *  extrudePath: <THREE.Curve> // curve to extrude shape along
 *  frames: <Object> // containing arrays of tangents, normals, binormals
 *
 *  UVGenerator: <Object> // object that provides UV generator functions
 *
 * }
 */

import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { ShapeUtils } from '../extras/ShapeUtils';
import { Shape } from '../extras/core/Shape';

// ExtrudeGeometry

export class ExtrudeGeometry extends Geometry {

	type : string = 'ExtrudeGeometry';
	//TODO: create class
	constructor( shapes : Array<Shape>, options : any ){
		super();


		this.parameters = {
			shapes: shapes,
			options: options
		};

		this.fromBufferGeometry( new ExtrudeBufferGeometry( shapes, options ) );
		this.mergeVertices();
	}

	static WorldUVGenerator = {

		generateTopUV ( geometry : Geometry, vertices : Array<number>, indexA : number, indexB : number, indexC : number ) : Array<Vector2> {
	
			let a_x = vertices[ indexA * 3 ];
			let a_y = vertices[ indexA * 3 + 1 ];
			let b_x = vertices[ indexB * 3 ];
			let b_y = vertices[ indexB * 3 + 1 ];
			let c_x = vertices[ indexC * 3 ];
			let c_y = vertices[ indexC * 3 + 1 ];
	
			return [
				new Vector2( a_x, a_y ),
				new Vector2( b_x, b_y ),
				new Vector2( c_x, c_y )
			];
	
		},
	
		generateSideWallUV ( geometry : Geometry, vertices : Array<number>, indexA : number, indexB : number, indexC : number,
			 indexD : number ) : Array<Vector2> {
	
			let a_x = vertices[ indexA * 3 ];
			let a_y = vertices[ indexA * 3 + 1 ];
			let a_z = vertices[ indexA * 3 + 2 ];
			let b_x = vertices[ indexB * 3 ];
			let b_y = vertices[ indexB * 3 + 1 ];
			let b_z = vertices[ indexB * 3 + 2 ];
			let c_x = vertices[ indexC * 3 ];
			let c_y = vertices[ indexC * 3 + 1 ];
			let c_z = vertices[ indexC * 3 + 2 ];
			let d_x = vertices[ indexD * 3 ];
			let d_y = vertices[ indexD * 3 + 1 ];
			let d_z = vertices[ indexD * 3 + 2 ];
	
			if ( Math.abs( a_y - b_y ) < 0.01 ) {
	
				return [
					new Vector2( a_x, 1 - a_z ),
					new Vector2( b_x, 1 - b_z ),
					new Vector2( c_x, 1 - c_z ),
					new Vector2( d_x, 1 - d_z )
				];
	
			} else {
	
				return [
					new Vector2( a_y, 1 - a_z ),
					new Vector2( b_y, 1 - b_z ),
					new Vector2( c_y, 1 - c_z ),
					new Vector2( d_y, 1 - d_z )
				];
	
			}
	
		}
	}

}

// ExtrudeBufferGeometry

export class ExtrudeBufferGeometry extends BufferGeometry {
	type : string = 'ExtrudeBufferGeometry';
	shapes : Array<Shape>;
	constructor( shapes : Array<Shape>, options : any ){
		super();
		if ( typeof ( shapes ) === "undefined" ) {

			return;
	
		}
		this.shapes = Array.isArray( shapes ) ? shapes : [ shapes ];
		this.addShapeList( this.shapes, options );
		this.computeVertexNormals();
	}
	



	// can't really use automatic vertex normals
	// as then front and back sides get smoothed too
	// should do separate smoothing just for sides

	//this.computeVertexNormals();

	//console.log( "took", ( Date.now() - startTime ) );

	getArrays () {

		let positionAttribute = this.getAttribute( "position" );
		let verticesArray = positionAttribute ? Array.prototype.slice.call( positionAttribute.array ) : [];
	
		let uvAttribute = this.getAttribute( "uv" );
		let uvArray = uvAttribute ? Array.prototype.slice.call( uvAttribute.array ) : [];
	
		let IndexAttribute = this.index;
		let indicesArray = IndexAttribute ? Array.prototype.slice.call( IndexAttribute.array ) : [];
	
		return {
			position: verticesArray,
			uv: uvArray,
			index: indicesArray
		};
	
	}

	addShapeList ( shapes : Array<Shape>, options : any ) : void {

		let sl = shapes.length;
		options.arrays = this.getArrays();
	
		for ( let s = 0; s < sl; s ++ ) {
	
			let shape = shapes[ s ];
			this.addShape( shape, options );
	
		}
	
		this.setIndex( options.arrays.index );
		this.addAttribute( 'position', new Float32BufferAttribute( options.arrays.position, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( options.arrays.uv, 2 ) );
	
	}

	addShape ( shape : Shape, options : any ) : void {

		let arrays = options.arrays ? options.arrays : this.getArrays();
		let verticesArray = arrays.position;
		let indicesArray = arrays.index;
		let uvArray = arrays.uv;
	
		let placeholder = [];
	
	
		let amount = options.amount !== undefined ? options.amount : 100;
	
		let bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 6; // 10
		let bevelSize = options.bevelSize !== undefined ? options.bevelSize : bevelThickness - 2; // 8
		let bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 3;
	
		let bevelEnabled = options.bevelEnabled !== undefined ? options.bevelEnabled : true; // false
	
		let curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;
	
		let steps = options.steps !== undefined ? options.steps : 1;
	
		let extrudePath = options.extrudePath;
		let extrudePts, extrudeByPath = false;
	
		// Use default WorldUVGenerator if no UV generators are specified.
		let uvgen = options.UVGenerator !== undefined ? options.UVGenerator : ExtrudeGeometry.WorldUVGenerator;
	
		let splineTube, binormal, normal, position2;
		if ( extrudePath ) {
	
			extrudePts = extrudePath.getSpacedPoints( steps );
	
			extrudeByPath = true;
			bevelEnabled = false; // bevels not supported for path extrusion
	
			// SETUP TNB variables
	
			// TODO1 - have a .isClosed in spline?
	
			splineTube = options.frames !== undefined ? options.frames : extrudePath.computeFrenetFrames( steps, false );
	
			// console.log(splineTube, 'splineTube', splineTube.normals.length, 'steps', steps, 'extrudePts', extrudePts.length);
	
			binormal = new Vector3();
			normal = new Vector3();
			position2 = new Vector3();
	
		}
	
		// Safeguards if bevels are not enabled
	
		if ( ! bevelEnabled ) {
	
			bevelSegments = 0;
			bevelThickness = 0;
			bevelSize = 0;
	
		}
	
		// Variables initialization
	
		let ahole, h, hl; // looping of holes
		let scope = this;
	
		let shapePoints = shape.extractPoints( curveSegments );
	
		let vertices = shapePoints.shape;
		let holes = shapePoints.holes;
	
		let reverse = ! ShapeUtils.isClockWise( vertices );
	
		if ( reverse ) {
	
			vertices = vertices.reverse();
	
			// Maybe we should also check if holes are in the opposite direction, just to be safe ...
	
			for ( h = 0, hl = holes.length; h < hl; h ++ ) {
	
				ahole = holes[ h ];
	
				if ( ShapeUtils.isClockWise( ahole ) ) {
	
					holes[ h ] = ahole.reverse();
	
				}
	
			}
	
		}
	
	
		let faces = ShapeUtils.triangulateShape( vertices, holes );
	
		/* Vertices */
	
		let contour = vertices; // vertices has all points but contour has only points of circumference
	
		for ( h = 0, hl = holes.length; h < hl; h ++ ) {
	
			ahole = holes[ h ];
	
			vertices = vertices.concat( ahole );
	
		}
	
	
		function scalePt2( pt : Vector2, vec : Vector2, size : number ) : Vector2 {
	
			if ( ! vec ) console.error( "THREE.ExtrudeGeometry: vec does not exist" );
	
			return vec.clone().multiplyScalar( size ).add( pt );
	
		}
	
		let b, bs, t, z,
			vert, vlen = vertices.length,
			face, flen = faces.length;
	
	
		// Find directions for point movement
	
	
		function getBevelVec( inPt : Vector2, inPrev : Vector2, inNext : Vector2 ) : Vector2 {
	
			// computes for inPt the corresponding point inPt' on a new contour
			//   shifted by 1 unit (length of normalized vector) to the left
			// if we walk along contour clockwise, this new contour is outside the old one
			//
			// inPt' is the intersection of the two lines parallel to the two
			//  adjacent edges of inPt at a distance of 1 unit on the left side.
	
			let v_trans_x, v_trans_y, shrink_by; // resulting translation vector for inPt
	
			// good reading for geometry algorithms (here: line-line intersection)
			// http://geomalgorithms.com/a05-_intersect-1.html
	
			let v_prev_x = inPt.x - inPrev.x,
				v_prev_y = inPt.y - inPrev.y;
			let v_next_x = inNext.x - inPt.x,
				v_next_y = inNext.y - inPt.y;
	
			let v_prev_lensq = ( v_prev_x * v_prev_x + v_prev_y * v_prev_y );
	
			// check for collinear edges
			let collinear0 = ( v_prev_x * v_next_y - v_prev_y * v_next_x );
	
			if ( Math.abs( collinear0 ) > (Number as any).EPSILON ) {
	
				// not collinear
	
				// length of vectors for normalizing
	
				let v_prev_len = Math.sqrt( v_prev_lensq );
				let v_next_len = Math.sqrt( v_next_x * v_next_x + v_next_y * v_next_y );
	
				// shift adjacent points by unit vectors to the left
	
				let ptPrevShift_x = ( inPrev.x - v_prev_y / v_prev_len );
				let ptPrevShift_y = ( inPrev.y + v_prev_x / v_prev_len );
	
				let ptNextShift_x = ( inNext.x - v_next_y / v_next_len );
				let ptNextShift_y = ( inNext.y + v_next_x / v_next_len );
	
				// scaling factor for v_prev to intersection point
	
				let sf = ( ( ptNextShift_x - ptPrevShift_x ) * v_next_y -
						( ptNextShift_y - ptPrevShift_y ) * v_next_x ) /
					( v_prev_x * v_next_y - v_prev_y * v_next_x );
	
				// vector from inPt to intersection point
	
				v_trans_x = ( ptPrevShift_x + v_prev_x * sf - inPt.x );
				v_trans_y = ( ptPrevShift_y + v_prev_y * sf - inPt.y );
	
				// Don't normalize!, otherwise sharp corners become ugly
				//  but prevent crazy spikes
				let v_trans_lensq = ( v_trans_x * v_trans_x + v_trans_y * v_trans_y );
				if ( v_trans_lensq <= 2 ) {
	
					return new Vector2( v_trans_x, v_trans_y );
	
				} else {
	
					shrink_by = Math.sqrt( v_trans_lensq / 2 );
	
				}
	
			} else {
	
				// handle special case of collinear edges
	
				let direction_eq = false; // assumes: opposite
				if ( v_prev_x > (Number as any).EPSILON ) {
	
					if ( v_next_x > (Number as any).EPSILON ) {
	
						direction_eq = true;
	
					}
	
				} else {
	
					if ( v_prev_x < - (Number as any).EPSILON ) {
	
						if ( v_next_x < - (Number as any).EPSILON ) {
	
							direction_eq = true;
	
						}
	
					} else {
	
						if ( (Math as any).sign( v_prev_y ) === (Math as any).sign( v_next_y ) ) {
	
							direction_eq = true;
	
						}
	
					}
	
				}
	
				if ( direction_eq ) {
	
					// console.log("Warning: lines are a straight sequence");
					v_trans_x = - v_prev_y;
					v_trans_y = v_prev_x;
					shrink_by = Math.sqrt( v_prev_lensq );
	
				} else {
	
					// console.log("Warning: lines are a straight spike");
					v_trans_x = v_prev_x;
					v_trans_y = v_prev_y;
					shrink_by = Math.sqrt( v_prev_lensq / 2 );
	
				}
	
			}
	
			return new Vector2( v_trans_x / shrink_by, v_trans_y / shrink_by );
	
		}
	
	
		let contourMovements : Array<Vector2> = [];
	
		for ( let i = 0, il = contour.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++ ) {
	
			if ( j === il ) j = 0;
			if ( k === il ) k = 0;
	
			//  (j)---(i)---(k)
			// console.log('i,j,k', i, j , k)
	
			contourMovements[ i ] = getBevelVec( contour[ i ], contour[ j ], contour[ k ] );
	
		}
	
		let holesMovements = [],
			oneHoleMovements, verticesMovements = contourMovements.concat();
	
		for ( h = 0, hl = holes.length; h < hl; h ++ ) {
	
			ahole = holes[ h ];
	
			oneHoleMovements = [];
	
			for ( let i = 0, il = ahole.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++ ) {
	
				if ( j === il ) j = 0;
				if ( k === il ) k = 0;
	
				//  (j)---(i)---(k)
				oneHoleMovements[ i ] = getBevelVec( ahole[ i ], ahole[ j ], ahole[ k ] );
	
			}
	
			holesMovements.push( oneHoleMovements );
			verticesMovements = verticesMovements.concat( oneHoleMovements );
	
		}
	
	
		// Loop bevelSegments, 1 for the front, 1 for the back
	
		for ( b = 0; b < bevelSegments; b ++ ) {
	
			//for ( b = bevelSegments; b > 0; b -- ) {
	
			t = b / bevelSegments;
			z = bevelThickness * Math.cos( t * Math.PI / 2 );
			bs = bevelSize * Math.sin( t * Math.PI / 2 );
	
			// contract shape
	
			for ( let i = 0, il = contour.length; i < il; i ++ ) {
	
				vert = scalePt2( contour[ i ], contourMovements[ i ], bs );
	
				v( vert.x, vert.y, - z );
	
			}
	
			// expand holes
	
			for ( h = 0, hl = holes.length; h < hl; h ++ ) {
	
				ahole = holes[ h ];
				oneHoleMovements = holesMovements[ h ];
	
				for ( let i = 0, il = ahole.length; i < il; i ++ ) {
	
					vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );
	
					v( vert.x, vert.y, - z );
	
				}
	
			}
	
		}
	
		bs = bevelSize;
	
		// Back facing vertices
	
		for ( let i = 0; i < vlen; i ++ ) {
	
			vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];
	
			if ( ! extrudeByPath ) {
	
				v( vert.x, vert.y, 0 );
	
			} else {
	
				// v( vert.x, vert.y + extrudePts[ 0 ].y, extrudePts[ 0 ].x );
	
				normal.copy( splineTube.normals[ 0 ] ).multiplyScalar( vert.x );
				binormal.copy( splineTube.binormals[ 0 ] ).multiplyScalar( vert.y );
	
				position2.copy( extrudePts[ 0 ] ).add( normal ).add( binormal );
	
				v( position2.x, position2.y, position2.z );
	
			}
	
		}
	
		// Add stepped vertices...
		// Including front facing vertices
	
		let s : number;
	
		for ( s = 1; s <= steps; s ++ ) {
	
			for ( let i = 0; i < vlen; i ++ ) {
	
				vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];
	
				if ( ! extrudeByPath ) {
	
					v( vert.x, vert.y, amount / steps * s );
	
				} else {
	
					// v( vert.x, vert.y + extrudePts[ s - 1 ].y, extrudePts[ s - 1 ].x );
	
					normal.copy( splineTube.normals[ s ] ).multiplyScalar( vert.x );
					binormal.copy( splineTube.binormals[ s ] ).multiplyScalar( vert.y );
	
					position2.copy( extrudePts[ s ] ).add( normal ).add( binormal );
	
					v( position2.x, position2.y, position2.z );
	
				}
	
			}
	
		}
	
	
		// Add bevel segments planes
	
		//for ( b = 1; b <= bevelSegments; b ++ ) {
		for ( b = bevelSegments - 1; b >= 0; b -- ) {
	
			t = b / bevelSegments;
			z = bevelThickness * Math.cos( t * Math.PI / 2 );
			bs = bevelSize * Math.sin( t * Math.PI / 2 );
	
			// contract shape
	
			for ( let i = 0, il = contour.length; i < il; i ++ ) {
	
				vert = scalePt2( contour[ i ], contourMovements[ i ], bs );
				v( vert.x, vert.y, amount + z );
	
			}
	
			// expand holes
	
			for ( h = 0, hl = holes.length; h < hl; h ++ ) {
	
				ahole = holes[ h ];
				oneHoleMovements = holesMovements[ h ];
	
				for ( let i = 0, il = ahole.length; i < il; i ++ ) {
	
					vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );
	
					if ( ! extrudeByPath ) {
	
						v( vert.x, vert.y, amount + z );
	
					} else {
	
						v( vert.x, vert.y + extrudePts[ steps - 1 ].y, extrudePts[ steps - 1 ].x + z );
	
					}
	
				}
	
			}
	
		}
	
		/* Faces */
	
		// Top and bottom faces
	
		buildLidFaces();
	
		// Sides faces
	
		buildSideFaces();
	
	
		/////  Internal functions
	
		function buildLidFaces() : void {
	
			let start = verticesArray.length / 3;
	
			if ( bevelEnabled ) {
	
				let layer = 0; // steps + 1
				let offset = vlen * layer;
	
				// Bottom faces
	
				for ( let i = 0; i < flen; i ++ ) {
	
					face = faces[ i ];
					f3( face[ 2 ] + offset, face[ 1 ] + offset, face[ 0 ] + offset );
	
				}
	
				layer = steps + bevelSegments * 2;
				offset = vlen * layer;
	
				// Top faces
	
				for ( let i = 0; i < flen; i ++ ) {
	
					face = faces[ i ];
					f3( face[ 0 ] + offset, face[ 1 ] + offset, face[ 2 ] + offset );
	
				}
	
			} else {
	
				// Bottom faces
	
				for ( let i = 0; i < flen; i ++ ) {
	
					face = faces[ i ];
					f3( face[ 2 ], face[ 1 ], face[ 0 ] );
	
				}
	
				// Top faces
	
				for ( let i = 0; i < flen; i ++ ) {
	
					face = faces[ i ];
					f3( face[ 0 ] + vlen * steps, face[ 1 ] + vlen * steps, face[ 2 ] + vlen * steps );
	
				}
	
			}
	
			scope.addGroup( start, verticesArray.length / 3 - start, options.material !== undefined ? options.material : 0 );
	
		}
	
		// Create faces for the z-sides of the shape
	
		function buildSideFaces() : void {
	
			let start = verticesArray.length / 3;
			let layeroffset = 0;
			sidewalls( contour, layeroffset );
			layeroffset += contour.length;
	
			for ( h = 0, hl = holes.length; h < hl; h ++ ) {
	
				ahole = holes[ h ];
				sidewalls( ahole, layeroffset );
	
				//, true
				layeroffset += ahole.length;
	
			}
	
	
			scope.addGroup( start, verticesArray.length / 3 - start, options.extrudeMaterial !== undefined ? options.extrudeMaterial : 1 );
	
	
		}
	
		function sidewalls( contour : Array<Vector2>, layeroffset : number ) : void {
	
			let j, k;
			let i = contour.length;
	
			while ( -- i >= 0 ) {
	
				j = i;
				k = i - 1;
				if ( k < 0 ) k = contour.length - 1;
	
				//console.log('b', i,j, i-1, k,vertices.length);
	
				let s = 0,
					sl = steps + bevelSegments * 2;
	
				for ( s = 0; s < sl; s ++ ) {
	
					let slen1 = vlen * s;
					let slen2 = vlen * ( s + 1 );
	
					let a = layeroffset + j + slen1,
						b = layeroffset + k + slen1,
						c = layeroffset + k + slen2,
						d = layeroffset + j + slen2;
	
					f4( a, b, c, d );
	
				}
	
			}
	
		}
	
		function v( x : number, y : number, z : number ) : void {
	
			placeholder.push( x );
			placeholder.push( y );
			placeholder.push( z );
	
		}
	
	
		function f3( a : number, b : number, c : number ) : void {
	
			addVertex( a );
			addVertex( b );
			addVertex( c );
	
			let nextIndex = verticesArray.length / 3;
			let uvs = uvgen.generateTopUV( scope, verticesArray, nextIndex - 3, nextIndex - 2, nextIndex - 1 );
	
			addUV( uvs[ 0 ] );
			addUV( uvs[ 1 ] );
			addUV( uvs[ 2 ] );
	
		}
	
		function f4( a : number, b : number, c : number, d : number ) : void {
	
			addVertex( a );
			addVertex( b );
			addVertex( d );
	
			addVertex( b );
			addVertex( c );
			addVertex( d );
	
	
			let nextIndex = verticesArray.length / 3;
			let uvs = uvgen.generateSideWallUV( scope, verticesArray, nextIndex - 6, nextIndex - 3, nextIndex - 2, nextIndex - 1 );
	
			addUV( uvs[ 0 ] );
			addUV( uvs[ 1 ] );
			addUV( uvs[ 3 ] );
	
			addUV( uvs[ 1 ] );
			addUV( uvs[ 2 ] );
			addUV( uvs[ 3 ] );
	
		}
	
		function addVertex( index : number ) : void {
	
			indicesArray.push( verticesArray.length / 3 );
			verticesArray.push( placeholder[ index * 3 + 0 ] );
			verticesArray.push( placeholder[ index * 3 + 1 ] );
			verticesArray.push( placeholder[ index * 3 + 2 ] );
	
		}
	
	
		function addUV( vector2 : Vector2 ) : void {
	
			uvArray.push( vector2.x );
			uvArray.push( vector2.y );
	
		}
	
		if ( ! options.arrays ) {
	
			this.setIndex( indicesArray );
			this.addAttribute( 'position', new Float32BufferAttribute( verticesArray, 3 ) );
			this.addAttribute( 'uv', new Float32BufferAttribute( uvArray, 2 ) );
	
		}
	
	}

}

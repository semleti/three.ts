import { Sphere } from '../math/Sphere';
import { Ray } from '../math/Ray';
import { Matrix4 } from '../math/Matrix4';
import { Object3D } from '../core/Object3D';
import { Vector3 } from '../math/Vector3';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { BufferGeometry } from '../core/BufferGeometry';
import { LineSegments } from './LineSegments';
import {Float32BufferAttribute} from '../core/BufferAttribute'
import { Raycaster } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class Line extends Object3D {

	isLine : boolean =  true;
	constructor( geometry : any, material : any, mode? : number ){
		super();
		if ( mode === 1 ) {

			console.warn( 'THREE.Line: parameter THREE.LinePieces no longer supported. Created THREE.LineSegments instead.' );
			return new LineSegments( geometry, material );
	
		}
	
		this.type = 'Line';
	
		this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
		this.material = material !== undefined ? material : new LineBasicMaterial( { color: Math.random() * 0xffffff } );
	}

	computeLineDistances () : Line {
		let start = new Vector3();
		let end = new Vector3();
		let geometry = this.geometry;

		let lineDistances;
		if ( geometry.isBufferGeometry ) {

			// we assume non-indexed geometry
			if ( geometry.index === null ) {

				let positionAttribute = geometry.attributes.position;
				lineDistances = [ 0 ];

				for ( let i = 1, l = positionAttribute.count; i < l; i ++ ) {

					start.fromBufferAttribute( positionAttribute, i - 1 );
					end.fromBufferAttribute( positionAttribute, i );

					lineDistances[ i ] = lineDistances[ i - 1 ];
					lineDistances[ i ] += start.distanceTo( end );

				}

				geometry.addAttribute( 'lineDistance', new Float32BufferAttribute( lineDistances, 1 ) );

			} else {

				console.warn( 'THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

			}

		} else if ( geometry.isGeometry ) {

			let vertices = geometry.vertices;
			lineDistances = geometry.lineDistances;

			lineDistances[ 0 ] = 0;

			for ( let i = 1, l = vertices.length; i < l; i ++ ) {

				lineDistances[ i ] = lineDistances[ i - 1 ];
				lineDistances[ i ] += vertices[ i - 1 ].distanceTo( vertices[ i ] );

			}

		}

		return this;

	}

	raycast ( raycaster : Raycaster, intersects : Array<any> ) : Array<any> {
		let inverseMatrix = new Matrix4();
		let ray = new Ray();
		let sphere = new Sphere();
		let precision = raycaster.linePrecision;
		let precisionSq = precision * precision;

		let geometry = this.geometry;
		let matrixWorld = this.matrixWorld;

		// Checking boundingSphere distance to ray

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( matrixWorld );

		if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

		//

		inverseMatrix.getInverse( matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		let vStart = new Vector3();
		let vEnd = new Vector3();
		let interSegment = new Vector3();
		let interRay = new Vector3();
		let step = ( this && (this as any as LineSegments).isLineSegments ) ? 2 : 1;

		if ( geometry.isBufferGeometry ) {

			let index = geometry.index;
			let attributes = geometry.attributes;
			let positions = attributes.position.array;

			if ( index !== null ) {

				let indices = index.array;

				for ( let i = 0, l = indices.length - 1; i < l; i += step ) {

					let a = indices[ i ];
					let b = indices[ i + 1 ];

					vStart.fromArray( positions, a * 3 );
					vEnd.fromArray( positions, b * 3 );

					let distSq = ray.distanceSqToSegment( vStart, vEnd, interRay, interSegment );

					if ( distSq > precisionSq ) continue;

					interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

					let distance = raycaster.ray.origin.distanceTo( interRay );

					if ( distance < raycaster.near || distance > raycaster.far ) continue;

					intersects.push( {

						distance: distance,
						// What do we want? intersection point on the ray or on the segment??
						// point: raycaster.ray.at( distance ),
						point: interSegment.clone().applyMatrix4( this.matrixWorld ),
						index: i,
						face: null,
						faceIndex: null,
						object: this

					} );

				}

			} else {

				for ( let i = 0, l = positions.length / 3 - 1; i < l; i += step ) {

					vStart.fromArray( positions, 3 * i );
					vEnd.fromArray( positions, 3 * i + 3 );

					let distSq = ray.distanceSqToSegment( vStart, vEnd, interRay, interSegment );

					if ( distSq > precisionSq ) continue;

					interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

					let distance = raycaster.ray.origin.distanceTo( interRay );

					if ( distance < raycaster.near || distance > raycaster.far ) continue;

					intersects.push( {

						distance: distance,
						// What do we want? intersection point on the ray or on the segment??
						// point: raycaster.ray.at( distance ),
						point: interSegment.clone().applyMatrix4( this.matrixWorld ),
						index: i,
						face: null,
						faceIndex: null,
						object: this

					} );

				}

			}

		} else if ( geometry.isGeometry ) {

			let vertices = geometry.vertices;
			let nbVertices = vertices.length;

			for ( let i = 0; i < nbVertices - 1; i += step ) {

				let distSq = ray.distanceSqToSegment( vertices[ i ], vertices[ i + 1 ], interRay, interSegment );

				if ( distSq > precisionSq ) continue;

				interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

				let distance = raycaster.ray.origin.distanceTo( interRay );

				if ( distance < raycaster.near || distance > raycaster.far ) continue;

				intersects.push( {

					distance: distance,
					// What do we want? intersection point on the ray or on the segment??
					// point: raycaster.ray.at( distance ),
					point: interSegment.clone().applyMatrix4( this.matrixWorld ),
					index: i,
					face: null,
					faceIndex: null,
					object: this

				} );

			}

		}

	}

	clone () : Line {

		return new Line( this.geometry, this.material ).copy( this );

	}

	copy(source : Line){
		return super.copy(source) as Line;
	}

}
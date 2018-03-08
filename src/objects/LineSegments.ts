import { Line } from './Line';
import { Vector3 } from '../math/Vector3';
import {Float32BufferAttribute} from '../core/BufferAttribute'

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class LineSegments extends Line {

	type : string = 'LineSegments';
	isLineSegments : boolean =  true;
	constructor( geometry : any, material : any ){
		super(geometry, material);
	}

	computeLineDistances() : LineSegments {
		let start = new Vector3();
		let end = new Vector3();
		let geometry = this.geometry;

		let lineDistances;
		if ( geometry.isBufferGeometry ) {

			// we assume non-indexed geometry

			if ( geometry.index === null ) {

				let positionAttribute = geometry.attributes.position;
				lineDistances = [];

				for ( let i = 0, l = positionAttribute.count; i < l; i += 2 ) {

					start.fromBufferAttribute( positionAttribute, i );
					end.fromBufferAttribute( positionAttribute, i + 1 );

					lineDistances[ i ] = ( i === 0 ) ? 0 : lineDistances[ i - 1 ];
					lineDistances[ i + 1 ] = lineDistances[ i ] + start.distanceTo( end );

				}

				geometry.addAttribute( 'lineDistance', new Float32BufferAttribute( lineDistances, 1 ) );

			} else {

				console.warn( 'THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

			}

		} else if ( geometry.isGeometry ) {

			let vertices = geometry.vertices;
			lineDistances = geometry.lineDistances;

			for ( let i = 0, l = vertices.length; i < l; i += 2 ) {

				start.copy( vertices[ i ] );
				end.copy( vertices[ i + 1 ] );

				lineDistances[ i ] = ( i === 0 ) ? 0 : lineDistances[ i - 1 ];
				lineDistances[ i + 1 ] = lineDistances[ i ] + start.distanceTo( end );

			}

		}

		return this;

	}

}


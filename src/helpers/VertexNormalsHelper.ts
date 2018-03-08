/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 */

import { Matrix3 } from '../math/Matrix3';
import { Vector3 } from '../math/Vector3';
import { LineSegments } from '../objects/LineSegments';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Object3D, Geometry } from '../Three';

export class VertexNormalsHelper extends LineSegments {
	object : Object3D;
	size : number;
	constructor( object : Object3D, size : number, hex : number, linewidth : number ){
		super(VertexNormalsHelper.constructGeom(object),new LineBasicMaterial( { color: hex || 0xff0000, linewidth: linewidth || 1 } ));
		this.object = object;

		this.size = ( size !== undefined ) ? size : 1;

		this.matrixAutoUpdate = false;

		this.update();
	}

	static constructGeom(object : Object3D) : BufferGeometry{
		let nNormals = 0;

		let objGeometry = object.geometry;

		if ( objGeometry && objGeometry.isGeometry ) {

			nNormals = objGeometry.faces.length * 3;

		} else if ( objGeometry && objGeometry.isBufferGeometry ) {

			nNormals = objGeometry.attributes.normal.count;

		}
		let geometry = new BufferGeometry();

		let positions = new Float32BufferAttribute( nNormals * 2 * 3, 3 );

		geometry.addAttribute( 'position', positions );
		return geometry;
	}

	update() : void {
		let v1 = new Vector3();
		let v2 = new Vector3();
		let normalMatrix = new Matrix3();
		let keys = [ 'a', 'b', 'c' ];

		this.object.updateMatrixWorld( true );

		normalMatrix.getNormalMatrix( this.object.matrixWorld );

		let matrixWorld = this.object.matrixWorld;

		let position = this.geometry.attributes.position;

		//

		let objGeometry = this.object.geometry;

		if ( objGeometry && objGeometry.isGeometry ) {

			let vertices = objGeometry.vertices;

			let faces = objGeometry.faces;

			let idx = 0;

			for ( let i = 0, l = faces.length; i < l; i ++ ) {

				let face = faces[ i ];

				for ( let j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

					let vertex = vertices[ face[ keys[ j ] ] ];

					let normal = face.vertexNormals[ j ];

					v1.copy( vertex ).applyMatrix4( matrixWorld );

					v2.copy( normal ).applyMatrix3( normalMatrix ).normalize().multiplyScalar( this.size ).add( v1 );

					position.setXYZ( idx, v1.x, v1.y, v1.z );

					idx = idx + 1;

					position.setXYZ( idx, v2.x, v2.y, v2.z );

					idx = idx + 1;

				}

			}

		} else if ( objGeometry && objGeometry.isBufferGeometry ) {

			let objPos = objGeometry.attributes.position;

			let objNorm = objGeometry.attributes.normal;

			let idx = 0;

			// for simplicity, ignore index and drawcalls, and render every normal

			for ( let j = 0, jl = objPos.count; j < jl; j ++ ) {

				v1.set( objPos.getX( j ), objPos.getY( j ), objPos.getZ( j ) ).applyMatrix4( matrixWorld );

				v2.set( objNorm.getX( j ), objNorm.getY( j ), objNorm.getZ( j ) );

				v2.applyMatrix3( normalMatrix ).normalize().multiplyScalar( this.size ).add( v1 );

				position.setXYZ( idx, v1.x, v1.y, v1.z );

				idx = idx + 1;

				position.setXYZ( idx, v2.x, v2.y, v2.z );

				idx = idx + 1;

			}

		}

		position.needsUpdate = true;

	}

}
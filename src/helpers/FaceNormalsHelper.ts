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
import { Object3D } from '../Three';

export class FaceNormalsHelper extends LineSegments {

	object : Object3D;
	size : number;
	constructor( object : Object3D, size : number, hex : number, linewidth : number ){
		super(FaceNormalsHelper.constructGeom(object), new LineBasicMaterial( { color: hex || 0xffff00, linewidth: linewidth || 1 } ));
		this.size = ( size !== undefined ) ? size : 1;

		this.object = object;

		this.matrixAutoUpdate = false;
		this.update();
	}

	static constructGeom(object : Object3D) : BufferGeometry
	{

		let nNormals = 0;

		let objGeometry = object.geometry;

		if ( objGeometry && objGeometry.isGeometry ) {

			nNormals = objGeometry.faces.length;

		} else {

			console.warn( 'THREE.FaceNormalsHelper: only THREE.Geometry is supported. Use THREE.VertexNormalsHelper, instead.' );

		}

		//

		let geometry = new BufferGeometry();

		let positions = new Float32BufferAttribute( nNormals * 2 * 3, 3 );

		geometry.addAttribute( 'position', positions );
		return geometry;
	}
	
	
	update() : void {
		let v1 = new Vector3();
		let v2 = new Vector3();
		let normalMatrix = new Matrix3();
		this.object.updateMatrixWorld( true );

		normalMatrix.getNormalMatrix( this.object.matrixWorld );

		let matrixWorld = this.object.matrixWorld;

		let position = this.geometry.attributes.position;

		//

		let objGeometry = this.object.geometry;

		let vertices = objGeometry.vertices;

		let faces = objGeometry.faces;

		let idx = 0;

		for ( let i = 0, l = faces.length; i < l; i ++ ) {

			let face = faces[ i ];

			let normal = face.normal;

			v1.copy( vertices[ face.a ] )
				.add( vertices[ face.b ] )
				.add( vertices[ face.c ] )
				.divideScalar( 3 )
				.applyMatrix4( matrixWorld );

			v2.copy( normal ).applyMatrix3( normalMatrix ).normalize().multiplyScalar( this.size ).add( v1 );

			position.setXYZ( idx, v1.x, v1.y, v1.z );

			idx = idx + 1;

			position.setXYZ( idx, v2.x, v2.y, v2.z );

			idx = idx + 1;

		}

		position.needsUpdate = true;

	}

}
/**
 * @author Sean Griffin / http://twitter.com/sgrif
 * @author Michael Guerrero / http://realitymeltdown.com
 * @author mrdoob / http://mrdoob.com/
 * @author ikerr / http://verold.com
 * @author Mugen87 / https://github.com/Mugen87
 */

import { LineSegments } from '../objects/LineSegments';
import { Matrix4 } from '../math/Matrix4';
import { VertexColors } from '../constants';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Object3D } from '../core/Object3D';
import { Bone } from '../Three';

function getBoneList( object : Object3D ) {

	let boneList = [];

	if ( object && (object as Bone).isBone ) {

		boneList.push( object );

	}

	for ( let i = 0; i < object.children.length; i ++ ) {

		boneList.push.apply( boneList, getBoneList( object.children[ i ] ) );

	}

	return boneList;

}

export class SkeletonHelper extends LineSegments {
	static tempBones;
	root : Object3D;
	bones : Array<Bone>;
	constructor( object : Object3D ){
		super(SkeletonHelper.constructGeom(object),new LineBasicMaterial( { vertexColors: VertexColors, depthTest: false, depthWrite: false, transparent: true } ));

		this.root = object;
		this.bones = SkeletonHelper.tempBones;

		this.matrix = object.matrixWorld;
		this.matrixAutoUpdate = false;
	}

	static constructGeom(object : Object3D){
		let bones = getBoneList( object );
		let geometry = new BufferGeometry();

		let vertices = [];
		let colors = [];
	
		let color1 = new Color( 0, 0, 1 );
		let color2 = new Color( 0, 1, 0 );
	
		for ( let i = 0; i < bones.length; i ++ ) {
	
			let bone = bones[ i ];
	
			if ( bone.parent && bone.parent.isBone ) {
	
				vertices.push( 0, 0, 0 );
				vertices.push( 0, 0, 0 );
				colors.push( color1.r, color1.g, color1.b );
				colors.push( color2.r, color2.g, color2.b );
	
			}
	
		}
	
		geometry.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		geometry.addAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

		SkeletonHelper.tempBones = bones;
		return geometry;
	}

	updateMatrixWorld( force : boolean ) : void {
		let vector = new Vector3();

		let boneMatrix = new Matrix4();
		let matrixWorldInv = new Matrix4();
		let bones = this.bones;

		let geometry = this.geometry;
		let position = geometry.getAttribute( 'position' );

		matrixWorldInv.getInverse( this.root.matrixWorld );

		for ( let i = 0, j = 0; i < bones.length; i ++ ) {

			let bone = bones[ i ];

			if ( bone.parent && (bone.parent as Bone).isBone ) {

				boneMatrix.multiplyMatrices( matrixWorldInv, bone.matrixWorld );
				vector.setFromMatrixPosition( boneMatrix );
				position.setXYZ( j, vector.x, vector.y, vector.z );

				boneMatrix.multiplyMatrices( matrixWorldInv, bone.parent.matrixWorld );
				vector.setFromMatrixPosition( boneMatrix );
				position.setXYZ( j + 1, vector.x, vector.y, vector.z );

				j += 2;

			}

		}

		geometry.getAttribute( 'position' ).needsUpdate = true;

		super.updateMatrixWorld(force);

	}

}

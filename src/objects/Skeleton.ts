import { Matrix4 } from '../math/Matrix4';
import { Bone } from './Bone';

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author michael guerrero / http://realitymeltdown.com
 * @author ikerr / http://verold.com
 */

export class Skeleton{

	bones;boneMatrices;boneInverses;boneTexture;
	constructor( bones? : Array<Bone>, boneInverses? : Array<Matrix4> ) {
		// copy the bone array

		bones = bones || [];

		this.bones = bones.slice( 0 );
		this.boneMatrices = new Float32Array( this.bones.length * 16 );

		// use the supplied bone inverses or calculate the inverses

		if ( boneInverses === undefined ) {

			this.calculateInverses();

		} else {

			if ( this.bones.length === boneInverses.length ) {

				this.boneInverses = boneInverses.slice( 0 );

			} else {

				console.warn( 'THREE.Skeleton boneInverses is the wrong length.' );

				this.boneInverses = [];

				for ( let i = 0, il = this.bones.length; i < il; i ++ ) {

					this.boneInverses.push( new Matrix4() );

				}

			}

		}
	}
	
	calculateInverses () : void {

		this.boneInverses = [];

		for ( let i = 0, il = this.bones.length; i < il; i ++ ) {

			let inverse = new Matrix4();

			if ( this.bones[ i ] ) {

				inverse.getInverse( this.bones[ i ].matrixWorld );

			}

			this.boneInverses.push( inverse );

		}

	}

	pose () : void {

		let bone, i, il;

		// recover the bind-time world matrices

		for ( i = 0, il = this.bones.length; i < il; i ++ ) {

			bone = this.bones[ i ];

			if ( bone ) {

				bone.matrixWorld.getInverse( this.boneInverses[ i ] );

			}

		}

		// compute the local matrices, positions, rotations and scales

		for ( i = 0, il = this.bones.length; i < il; i ++ ) {

			bone = this.bones[ i ];

			if ( bone ) {

				if ( bone.parent && bone.parent.isBone ) {

					bone.matrix.getInverse( bone.parent.matrixWorld );
					bone.matrix.multiply( bone.matrixWorld );

				} else {

					bone.matrix.copy( bone.matrixWorld );

				}

				bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

			}

		}

	}

	update() : void {
		let offsetMatrix = new Matrix4();
		let identityMatrix = new Matrix4();
		let bones = this.bones;
		let boneInverses = this.boneInverses;
		let boneMatrices = this.boneMatrices;
		let boneTexture = this.boneTexture;

		// flatten bone matrices to array

		for ( let i = 0, il = bones.length; i < il; i ++ ) {

			// compute the offset between the current and the original transform

			let matrix = bones[ i ] ? bones[ i ].matrixWorld : identityMatrix;

			offsetMatrix.multiplyMatrices( matrix, boneInverses[ i ] );
			offsetMatrix.toArray( boneMatrices, i * 16 );

		}

		if ( boneTexture !== undefined ) {

			boneTexture.needsUpdate = true;

		}

	}

	clone ()  : Skeleton{

		return new Skeleton( this.bones, this.boneInverses );

	}

	getBoneByName ( name : string ) : Bone {

		for ( let i = 0, il = this.bones.length; i < il; i ++ ) {

			let bone = this.bones[ i ];

			if ( bone.name === name ) {

				return bone;

			}

		}

		return undefined;

	}

}


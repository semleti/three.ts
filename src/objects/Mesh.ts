import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';
import { Sphere } from '../math/Sphere';
import { Ray } from '../math/Ray';
import { Matrix4 } from '../math/Matrix4';
import { Object3D } from '../core/Object3D';
import { Triangle } from '../math/Triangle';
import { Face3 } from '../core/Face3';
import { DoubleSide, BackSide, TrianglesDrawMode } from '../constants';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { BufferGeometry } from '../core/BufferGeometry';
import { Material } from '../materials/Material';
import { Raycaster } from '../core/Raycaster';
import { BufferAttribute } from '../core/BufferAttribute';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */

export class Mesh extends Object3D {

	type : string = 'Mesh';
	drawMode : number;
	morphTargetInfluences;morphTargetDictionary;
	isMesh : boolean = true;
	constructor( geometry : BufferGeometry, material : Material ){
		super();

		this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
		this.material = material !== undefined ? material : new MeshBasicMaterial( { color: Math.random() * 0xffffff } );
	
		this.drawMode = TrianglesDrawMode;
	
		this.updateMorphTargets();
	}

	setDrawMode ( value : number ) : void {

		this.drawMode = value;

	}

	copy ( source : Mesh ) : Mesh {

		super.copy(source);

		this.drawMode = source.drawMode;

		if ( source.morphTargetInfluences !== undefined ) {

			this.morphTargetInfluences = source.morphTargetInfluences.slice();

		}

		if ( source.morphTargetDictionary !== undefined ) {

			this.morphTargetDictionary = (Object as any).assign( {}, source.morphTargetDictionary );

		}

		return this;

	}

	updateMorphTargets () : void {

		let geometry = this.geometry;
		let m, ml, name;

		if ( geometry.isBufferGeometry ) {

			let morphAttributes = geometry.morphAttributes;
			let keys = Object.keys( morphAttributes );

			if ( keys.length > 0 ) {

				let morphAttribute = morphAttributes[ keys[ 0 ] ];

				if ( morphAttribute !== undefined ) {

					this.morphTargetInfluences = [];
					this.morphTargetDictionary = {};

					for ( m = 0, ml = morphAttribute.length; m < ml; m ++ ) {

						name = morphAttribute[ m ].name || String( m );

						this.morphTargetInfluences.push( 0 );
						this.morphTargetDictionary[ name ] = m;

					}

				}

			}

		} else {

			let morphTargets = geometry.morphTargets;

			if ( morphTargets !== undefined && morphTargets.length > 0 ) {

				this.morphTargetInfluences = [];
				this.morphTargetDictionary = {};

				for ( m = 0, ml = morphTargets.length; m < ml; m ++ ) {

					name = morphTargets[ m ].name || String( m );

					this.morphTargetInfluences.push( 0 );
					this.morphTargetDictionary[ name ] = m;

				}

			}

		}

	}

	raycast( raycaster : Raycaster, intersects : Array<any> ) : Array<any>{

		let inverseMatrix = new Matrix4();
		let ray = new Ray();
		let sphere = new Sphere();

		let vA = new Vector3();
		let vB = new Vector3();
		let vC = new Vector3();

		let tempA = new Vector3();
		let tempB = new Vector3();
		let tempC = new Vector3();

		let uvA = new Vector2();
		let uvB = new Vector2();
		let uvC = new Vector2();

		let barycoord = new Vector3();

		let intersectionPoint = new Vector3();
		let intersectionPointWorld = new Vector3();

		function uvIntersection( point, p1, p2, p3, uv1, uv2, uv3 ) {

			Triangle.barycoordFromPoint( point, p1, p2, p3, barycoord );

			uv1.multiplyScalar( barycoord.x );
			uv2.multiplyScalar( barycoord.y );
			uv3.multiplyScalar( barycoord.z );

			uv1.add( uv2 ).add( uv3 );

			return uv1.clone();

		}

		function checkIntersection( object : Object3D, material : Material, raycaster : Raycaster, ray : Ray, pA : Vector3, pB : Vector3, pC : Vector3, point : Vector3 ) {

			let intersect;

			if ( material.side === BackSide ) {

				intersect = ray.intersectTriangle( pC, pB, pA, true, point );

			} else {

				intersect = ray.intersectTriangle( pA, pB, pC, material.side !== DoubleSide, point );

			}

			if ( intersect === null ) return null;

			intersectionPointWorld.copy( point );
			intersectionPointWorld.applyMatrix4( object.matrixWorld );

			let distance = raycaster.ray.origin.distanceTo( intersectionPointWorld );

			if ( distance < raycaster.near || distance > raycaster.far ) return null;

			return {
				distance: distance,
				point: intersectionPointWorld.clone(),
				object: object
			};

		}

		function checkBufferGeometryIntersection( object : Object3D, raycaster : Raycaster, ray : Ray, position : BufferAttribute,
				 uv? : BufferAttribute, a? : number, b? : number, c? : number ) {

			vA.fromBufferAttribute( position, a );
			vB.fromBufferAttribute( position, b );
			vC.fromBufferAttribute( position, c );

			//TODO: create class
			let intersection = checkIntersection( object, object.material, raycaster, ray, vA, vB, vC, intersectionPoint );

			if ( intersection ) {

				if ( uv ) {

					uvA.fromBufferAttribute( uv, a );
					uvB.fromBufferAttribute( uv, b );
					uvC.fromBufferAttribute( uv, c );

					(intersection as any).uv = uvIntersection( intersectionPoint, vA, vB, vC, uvA, uvB, uvC );

				}

				(intersection as any).face = new Face3( a, b, c, Triangle.normal( vA, vB, vC ) );
				(intersection as any).faceIndex = a;

			}

			return intersection;

		}

		

			let geometry = this.geometry;
			let material = this.material;
			let matrixWorld = this.matrixWorld;

			if ( material === undefined ) return;

			// Checking boundingSphere distance to ray

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			sphere.copy( geometry.boundingSphere );
			sphere.applyMatrix4( matrixWorld );

			if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

			//

			inverseMatrix.getInverse( matrixWorld );
			ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

			// Check boundingBox before continuing

			if ( geometry.boundingBox !== null ) {

				if ( ray.intersectsBox( geometry.boundingBox ) === false ) return;

			}

			let intersection;

			if ( geometry.isBufferGeometry ) {

				let a, b, c;
				let index = geometry.index;
				let position = geometry.attributes.position;
				let uv = geometry.attributes.uv;
				let i, l;

				if ( index !== null ) {

					// indexed buffer geometry

					for ( i = 0, l = index.count; i < l; i += 3 ) {

						a = index.getX( i );
						b = index.getX( i + 1 );
						c = index.getX( i + 2 );

						intersection = checkBufferGeometryIntersection( this, raycaster, ray, position, uv, a, b, c );

						if ( intersection ) {

							intersection.faceIndex = Math.floor( i / 3 ); // triangle number in indices buffer semantics
							intersects.push( intersection );

						}

					}

				} else if ( position !== undefined ) {

					// non-indexed buffer geometry

					for ( i = 0, l = position.count; i < l; i += 3 ) {

						a = i;
						b = i + 1;
						c = i + 2;

						intersection = checkBufferGeometryIntersection( this, raycaster, ray, position, uv, a, b, c );

						if ( intersection ) {

							intersection.index = a; // triangle number in positions buffer semantics
							intersects.push( intersection );

						}

					}

				}

			} else if ( geometry.isGeometry ) {

				let fvA, fvB, fvC;
				let isMultiMaterial = Array.isArray( material );

				let vertices = geometry.vertices;
				let faces = geometry.faces;
				let uvs;

				let faceVertexUvs = geometry.faceVertexUvs[ 0 ];
				if ( faceVertexUvs.length > 0 ) uvs = faceVertexUvs;

				for ( let f = 0, fl = faces.length; f < fl; f ++ ) {

					let face = faces[ f ];
					let faceMaterial = isMultiMaterial ? material[ face.materialIndex ] : material;

					if ( faceMaterial === undefined ) continue;

					fvA = vertices[ face.a ];
					fvB = vertices[ face.b ];
					fvC = vertices[ face.c ];

					if ( faceMaterial.morphTargets === true ) {

						let morphTargets = geometry.morphTargets;
						let morphInfluences = this.morphTargetInfluences;

						vA.set( 0, 0, 0 );
						vB.set( 0, 0, 0 );
						vC.set( 0, 0, 0 );

						for ( let t = 0, tl = morphTargets.length; t < tl; t ++ ) {

							let influence = morphInfluences[ t ];

							if ( influence === 0 ) continue;

							let targets = morphTargets[ t ].vertices;

							vA.addScaledVector( tempA.subVectors( targets[ face.a ], fvA ), influence );
							vB.addScaledVector( tempB.subVectors( targets[ face.b ], fvB ), influence );
							vC.addScaledVector( tempC.subVectors( targets[ face.c ], fvC ), influence );

						}

						vA.add( fvA );
						vB.add( fvB );
						vC.add( fvC );

						fvA = vA;
						fvB = vB;
						fvC = vC;

					}

					intersection = checkIntersection( this, faceMaterial, raycaster, ray, fvA, fvB, fvC, intersectionPoint );

					if ( intersection ) {

						if ( uvs && uvs[ f ] ) {

							let uvs_f = uvs[ f ];
							uvA.copy( uvs_f[ 0 ] );
							uvB.copy( uvs_f[ 1 ] );
							uvC.copy( uvs_f[ 2 ] );

							intersection.uv = uvIntersection( intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC );

						}

						intersection.face = face;
						intersection.faceIndex = f;
						intersects.push( intersection );

					}

				}

			}

		}

	clone () : Mesh {

		return new Mesh( this.geometry, this.material ).copy( this );

	}

}


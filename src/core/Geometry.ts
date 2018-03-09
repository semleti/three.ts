import { EventDispatcher } from './EventDispatcher';
import { Face3 } from './Face3';
import { Matrix3 } from '../math/Matrix3';
import { Sphere } from '../math/Sphere';
import { Box3 } from '../math/Box3';
import { Vector3 } from '../math/Vector3';
import { Matrix4 } from '../math/Matrix4';
import { Vector2 } from '../math/Vector2';
import { Color } from '../math/Color';
import { Object3D } from './Object3D';
import { _Math } from '../math/Math';
import { DirectGeometry } from './DirectGeometry';
import { BufferGeometry, Vector4 } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author bhouston / http://clara.io
 */


export class Geometry extends EventDispatcher {
	static geometryId : number = 0; // Geometry uses even numbers as Id
	id : number;
	uuid : string = _Math.generateUUID();
	name : string = '';
	type : string = 'Geometry';
	vertices : Array<Vector3> = [];
	colors : Array<Color> = [];
	faces : Array<Face3> = [];
	faceVertexUvs : Array<Array<Array<Vector2>>> = [[]];
	//TODO: create morphtarget class
	morphTargets : Array<any> = [];
	//TODO: create class
	morphNormals : Array<any> = [];
	skinWeights : Array<Vector4> = [];
	skinIndices : Array<any> = [];
	lineDistances : Array<number> = [];
	boundingBox = null;
	boundingSphere = null;
	// update flags
	elementsNeedUpdate : boolean = false;
	verticesNeedUpdate : boolean = false;
	uvsNeedUpdate : boolean = false;
	normalsNeedUpdate : boolean = false;
	colorsNeedUpdate : boolean = false;
	lineDistancesNeedUpdate : boolean = false;
	groupsNeedUpdate : boolean = false;
	__directGeometry : DirectGeometry;
	_bufferGeometry : BufferGeometry;

	isGeometry : boolean = true;
	constructor(){
		super();
		this.id = Geometry.geometryId += 2;

	}


	applyMatrix ( matrix : Matrix4 ) : Geometry {

		let normalMatrix = new Matrix3().getNormalMatrix( matrix );

		for ( let i = 0, il = this.vertices.length; i < il; i ++ ) {

			let vertex = this.vertices[ i ];
			vertex.applyMatrix4( matrix );

		}

		for ( let i = 0, il = this.faces.length; i < il; i ++ ) {

			let face = this.faces[ i ];
			face.normal.applyMatrix3( normalMatrix ).normalize();

			for ( let j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

				face.vertexNormals[ j ].applyMatrix3( normalMatrix ).normalize();

			}

		}

		if ( this.boundingBox !== null ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere !== null ) {

			this.computeBoundingSphere();

		}

		this.verticesNeedUpdate = true;
		this.normalsNeedUpdate = true;

		return this;

	}

	rotateX( angle : number ) : Geometry {
		let m1 = new Matrix4();
		m1.makeRotationX( angle );

		this.applyMatrix( m1 );

		return this;

	}

	rotateY( angle : number ) : Geometry {
		let m1 = new Matrix4();
		m1.makeRotationY( angle );

		this.applyMatrix( m1 );

		return this;

	}

	rotateZ( angle : number ) : Geometry {
		let m1 = new Matrix4();
		m1.makeRotationZ( angle );

		this.applyMatrix( m1 );

		return this;

	}

	translate( x : number, y : number, z : number ) : Geometry {
		let m1 = new Matrix4();
		m1.makeTranslation( x, y, z );

		this.applyMatrix( m1 );

		return this;

	}

	scale( x : number, y : number, z : number ) : Geometry {
		let m1 = new Matrix4();
		m1.makeScale( x, y, z );

		this.applyMatrix( m1 );

		return this;

	}

	lookAt( vector : Vector3 ) {
		let obj = new Object3D();
		obj.lookAt( vector );

		obj.updateMatrix();

		this.applyMatrix( obj.matrix );

	}

	fromBufferGeometry ( geometry : BufferGeometry ) : Geometry {

		let scope = this;

		let indices = geometry.index !== null ? geometry.index.array : undefined;
		let attributes = geometry.attributes;

		let positions = attributes.position.array;
		let normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
		let colors = attributes.color !== undefined ? attributes.color.array : undefined;
		let uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;
		let uvs2 = attributes.uv2 !== undefined ? attributes.uv2.array : undefined;

		if ( uvs2 !== undefined ) this.faceVertexUvs[ 1 ] = [];

		let tempNormals = [];
		let tempUVs = [];
		let tempUVs2 = [];

		for ( let i = 0, j = 0; i < positions.length; i += 3, j += 2 ) {

			scope.vertices.push( new Vector3( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] ) );

			if ( normals !== undefined ) {

				tempNormals.push( new Vector3( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] ) );

			}

			if ( colors !== undefined ) {

				scope.colors.push( new Color( colors[ i ], colors[ i + 1 ], colors[ i + 2 ] ) );

			}

			if ( uvs !== undefined ) {

				tempUVs.push( new Vector2( uvs[ j ], uvs[ j + 1 ] ) );

			}

			if ( uvs2 !== undefined ) {

				tempUVs2.push( new Vector2( uvs2[ j ], uvs2[ j + 1 ] ) );

			}

		}

		function addFace( a, b, c, materialIndex? ) {

			let vertexNormals = normals !== undefined ? [ tempNormals[ a ].clone(), tempNormals[ b ].clone(), tempNormals[ c ].clone() ] : [];
			let vertexColors = colors !== undefined ? [ scope.colors[ a ].clone(), scope.colors[ b ].clone(), scope.colors[ c ].clone() ] : [];

			let face = new Face3( a, b, c, vertexNormals, vertexColors, materialIndex );

			scope.faces.push( face );

			if ( uvs !== undefined ) {

				scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ].clone(), tempUVs[ b ].clone(), tempUVs[ c ].clone() ] );

			}

			if ( uvs2 !== undefined ) {

				scope.faceVertexUvs[ 1 ].push( [ tempUVs2[ a ].clone(), tempUVs2[ b ].clone(), tempUVs2[ c ].clone() ] );

			}

		}

		let groups = geometry.groups;

		if ( groups.length > 0 ) {

			for ( let i = 0; i < groups.length; i ++ ) {

				let group = groups[ i ];

				let start = group.start;
				let count = group.count;

				for ( let jt = start, jl = start + count; jt < jl; jt += 3 ) {

					if ( indices !== undefined ) {

						addFace( indices[ jt ], indices[ jt + 1 ], indices[ jt + 2 ], group.materialIndex );

					} else {

						addFace( jt, jt + 1, jt + 2, group.materialIndex );

					}

				}

			}

		} else {

			if ( indices !== undefined ) {

				for ( let i = 0; i < indices.length; i += 3 ) {

					addFace( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

				}

			} else {

				for ( let i = 0; i < positions.length / 3; i += 3 ) {

					addFace( i, i + 1, i + 2 );

				}

			}

		}

		this.computeFaceNormals();

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		return this;

	}

	center () : number {

		this.computeBoundingBox();

		let offset = this.boundingBox.getCenter().negate();

		this.translate( offset.x, offset.y, offset.z );

		return offset;

	}

	normalize () : Geometry {

		this.computeBoundingSphere();

		let center = this.boundingSphere.center;
		let radius = this.boundingSphere.radius;

		let s = radius === 0 ? 1 : 1.0 / radius;

		let matrix = new Matrix4();
		matrix.set(
			s, 0, 0, - s * center.x,
			0, s, 0, - s * center.y,
			0, 0, s, - s * center.z,
			0, 0, 0, 1
		);

		this.applyMatrix( matrix );

		return this;

	}

	computeFaceNormals () : void {

		let cb = new Vector3(), ab = new Vector3();

		for ( let f = 0, fl = this.faces.length; f < fl; f ++ ) {

			let face = this.faces[ f ];

			let vA = this.vertices[ face.a ];
			let vB = this.vertices[ face.b ];
			let vC = this.vertices[ face.c ];

			cb.subVectors( vC, vB );
			ab.subVectors( vA, vB );
			cb.cross( ab );

			cb.normalize();

			face.normal.copy( cb );

		}

	}

	computeVertexNormals ( areaWeighted? : boolean ) : void {

		if ( areaWeighted === undefined ) areaWeighted = true;

		let v, vl, f, fl, face, vertices;

		vertices = new Array( this.vertices.length );

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ] = new Vector3();

		}

		if ( areaWeighted ) {

			// vertex normals weighted by triangle areas
			// http://www.iquilezles.org/www/articles/normals/normals.htm

			let vA, vB, vC;
			let cb = new Vector3(), ab = new Vector3();

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vA = this.vertices[ face.a ];
				vB = this.vertices[ face.b ];
				vC = this.vertices[ face.c ];

				cb.subVectors( vC, vB );
				ab.subVectors( vA, vB );
				cb.cross( ab );

				vertices[ face.a ].add( cb );
				vertices[ face.b ].add( cb );
				vertices[ face.c ].add( cb );

			}

		} else {

			this.computeFaceNormals();

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vertices[ face.a ].add( face.normal );
				vertices[ face.b ].add( face.normal );
				vertices[ face.c ].add( face.normal );

			}

		}

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ].normalize();

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			let vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				vertexNormals[ 0 ].copy( vertices[ face.a ] );
				vertexNormals[ 1 ].copy( vertices[ face.b ] );
				vertexNormals[ 2 ].copy( vertices[ face.c ] );

			} else {

				vertexNormals[ 0 ] = vertices[ face.a ].clone();
				vertexNormals[ 1 ] = vertices[ face.b ].clone();
				vertexNormals[ 2 ] = vertices[ face.c ].clone();

			}

		}

		if ( this.faces.length > 0 ) {

			this.normalsNeedUpdate = true;

		}

	}

	computeFlatVertexNormals () : void {

		let f, fl, face;

		this.computeFaceNormals();

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			let vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				vertexNormals[ 0 ].copy( face.normal );
				vertexNormals[ 1 ].copy( face.normal );
				vertexNormals[ 2 ].copy( face.normal );

			} else {

				vertexNormals[ 0 ] = face.normal.clone();
				vertexNormals[ 1 ] = face.normal.clone();
				vertexNormals[ 2 ] = face.normal.clone();

			}

		}

		if ( this.faces.length > 0 ) {

			this.normalsNeedUpdate = true;

		}

	}

	computeMorphNormals () : void {

		let i, il, f, fl, face;

		// save original normals
		// - create temp variables on first access
		//   otherwise just copy (for faster repeated calls)

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			if ( ! face.__originalFaceNormal ) {

				face.__originalFaceNormal = face.normal.clone();

			} else {

				face.__originalFaceNormal.copy( face.normal );

			}

			if ( ! face.__originalVertexNormals ) face.__originalVertexNormals = [];

			for ( i = 0, il = face.vertexNormals.length; i < il; i ++ ) {

				if ( ! face.__originalVertexNormals[ i ] ) {

					face.__originalVertexNormals[ i ] = face.vertexNormals[ i ].clone();

				} else {

					face.__originalVertexNormals[ i ].copy( face.vertexNormals[ i ] );

				}

			}

		}

		// use temp geometry to compute face and vertex normals for each morph

		let tmpGeo = new Geometry();
		tmpGeo.faces = this.faces;

		for ( i = 0, il = this.morphTargets.length; i < il; i ++ ) {

			// create on first access

			if ( ! this.morphNormals[ i ] ) {

				this.morphNormals[ i ] = {};
				this.morphNormals[ i ].faceNormals = [];
				this.morphNormals[ i ].vertexNormals = [];

				let dstNormalsFace = this.morphNormals[ i ].faceNormals;
				let dstNormalsVertex = this.morphNormals[ i ].vertexNormals;

				let faceNormal, vertexNormals;

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					faceNormal = new Vector3();
					vertexNormals = { a: new Vector3(), b: new Vector3(), c: new Vector3() };

					dstNormalsFace.push( faceNormal );
					dstNormalsVertex.push( vertexNormals );

				}

			}

			let morphNormals = this.morphNormals[ i ];

			// set vertices to morph target

			tmpGeo.vertices = this.morphTargets[ i ].vertices;

			// compute morph normals

			tmpGeo.computeFaceNormals();
			tmpGeo.computeVertexNormals();

			// store morph normals

			let faceNormal, vertexNormals;

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				faceNormal = morphNormals.faceNormals[ f ];
				vertexNormals = morphNormals.vertexNormals[ f ];

				faceNormal.copy( face.normal );

				vertexNormals.a.copy( face.vertexNormals[ 0 ] );
				vertexNormals.b.copy( face.vertexNormals[ 1 ] );
				vertexNormals.c.copy( face.vertexNormals[ 2 ] );

			}

		}

		// restore original normals

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			face.normal = face.__originalFaceNormal;
			face.vertexNormals = face.__originalVertexNormals;

		}

	}

	computeLineDistances () : void {

		let d = 0;
		let vertices = this.vertices;

		for ( let i = 0, il = vertices.length; i < il; i ++ ) {

			if ( i > 0 ) {

				d += vertices[ i ].distanceTo( vertices[ i - 1 ] );

			}

			this.lineDistances[ i ] = d;

		}

	}

	computeBoundingBox () : void {

		if ( this.boundingBox === null ) {

			this.boundingBox = new Box3();

		}

		this.boundingBox.setFromPoints( this.vertices );

	}

	computeBoundingSphere () : void {

		if ( this.boundingSphere === null ) {

			this.boundingSphere = new Sphere();

		}

		this.boundingSphere.setFromPoints( this.vertices );

	}

	merge ( geometry, matrix : Matrix4, materialIndexOffset? : number ) : void {

		if ( ! ( geometry && geometry.isGeometry ) ) {

			console.error( 'THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.', geometry );
			return;

		}

		let normalMatrix,
			vertexOffset = this.vertices.length,
			vertices1 = this.vertices,
			vertices2 = geometry.vertices,
			faces1 = this.faces,
			faces2 = geometry.faces,
			uvs1 = this.faceVertexUvs[ 0 ],
			uvs2 = geometry.faceVertexUvs[ 0 ],
			colors1 = this.colors,
			colors2 = geometry.colors;

		if ( materialIndexOffset === undefined ) materialIndexOffset = 0;

		if ( matrix !== undefined ) {

			normalMatrix = new Matrix3().getNormalMatrix( matrix );

		}

		// vertices

		for ( let i = 0, il = vertices2.length; i < il; i ++ ) {

			let vertex = vertices2[ i ];

			let vertexCopy = vertex.clone();

			if ( matrix !== undefined ) vertexCopy.applyMatrix4( matrix );

			vertices1.push( vertexCopy );

		}

		// colors

		for ( let i = 0, il = colors2.length; i < il; i ++ ) {

			colors1.push( colors2[ i ].clone() );

		}

		// faces

		for ( let i = 0, il = faces2.length; i < il; i ++ ) {

			let face = faces2[ i ], faceCopy, normal, color,
				faceVertexNormals = face.vertexNormals,
				faceVertexColors = face.vertexColors;

			faceCopy = new Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );
			faceCopy.normal.copy( face.normal );

			if ( normalMatrix !== undefined ) {

				faceCopy.normal.applyMatrix3( normalMatrix ).normalize();

			}

			for ( let j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ].clone();

				if ( normalMatrix !== undefined ) {

					normal.applyMatrix3( normalMatrix ).normalize();

				}

				faceCopy.vertexNormals.push( normal );

			}

			faceCopy.color.copy( face.color );

			for ( let j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

			faces1.push( faceCopy );

		}

		// uvs

		for ( let i = 0, il = uvs2.length; i < il; i ++ ) {

			let uv = uvs2[ i ], uvCopy = [];

			if ( uv === undefined ) {

				continue;

			}

			for ( let j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( uv[ j ].clone() );

			}

			uvs1.push( uvCopy );

		}

	}

	mergeMesh ( mesh ) : void {

		if ( ! ( mesh && mesh.isMesh ) ) {

			console.error( 'THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.', mesh );
			return;

		}

		mesh.matrixAutoUpdate && mesh.updateMatrix();

		this.merge( mesh.geometry, mesh.matrix );

	}

	/*
	 * Checks for duplicate vertices with hashmap.
	 * Duplicated vertices are removed
	 * and faces' vertices are updated.
	 */

	mergeVertices () : number {

		let verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
		let unique = [], changes = [];

		let v, key;
		let precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
		let precision = Math.pow( 10, precisionPoints );
		let i, il, face;
		let indices, j, jl;

		for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

			v = this.vertices[ i ];
			key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

			if ( verticesMap[ key ] === undefined ) {

				verticesMap[ key ] = i;
				unique.push( this.vertices[ i ] );
				changes[ i ] = unique.length - 1;

			} else {

				//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
				changes[ i ] = changes[ verticesMap[ key ] ];

			}

		}


		// if faces are completely degenerate after merging vertices, we
		// have to remove them from the geometry.
		let faceIndicesToRemove = [];

		for ( i = 0, il = this.faces.length; i < il; i ++ ) {

			face = this.faces[ i ];

			face.a = changes[ face.a ];
			face.b = changes[ face.b ];
			face.c = changes[ face.c ];

			indices = [ face.a, face.b, face.c ];

			// if any duplicate vertices are found in a Face3
			// we have to remove the face as nothing can be saved
			for ( let n = 0; n < 3; n ++ ) {

				if ( indices[ n ] === indices[ ( n + 1 ) % 3 ] ) {

					faceIndicesToRemove.push( i );
					break;

				}

			}

		}

		for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {

			let idx = faceIndicesToRemove[ i ];

			this.faces.splice( idx, 1 );

			for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

				this.faceVertexUvs[ j ].splice( idx, 1 );

			}

		}

		// Use unique set of vertices

		let diff = this.vertices.length - unique.length;
		this.vertices = unique;
		return diff;

	}

	setFromPoints ( points : Array<Vector3> ) : Geometry {

		this.vertices = [];

		for ( let i = 0, l = points.length; i < l; i ++ ) {

			let point = points[ i ];
			this.vertices.push( new Vector3( point.x, point.y, point.z || 0 ) );

		}

		return this;

	}

	sortFacesByMaterialIndex () : void {

		let faces = this.faces;
		let length = faces.length;

		// tag faces

		for ( let i = 0; i < length; i ++ ) {

			faces[ i ]._id = i;

		}

		// sort faces

		function materialIndexSort( a, b ) {

			return a.materialIndex - b.materialIndex;

		}

		faces.sort( materialIndexSort );

		// sort uvs

		let uvs1 = this.faceVertexUvs[ 0 ];
		let uvs2 = this.faceVertexUvs[ 1 ];

		let newUvs1, newUvs2;

		if ( uvs1 && uvs1.length === length ) newUvs1 = [];
		if ( uvs2 && uvs2.length === length ) newUvs2 = [];

		for ( let i = 0; i < length; i ++ ) {

			let id = faces[ i ]._id;

			if ( newUvs1 ) newUvs1.push( uvs1[ id ] );
			if ( newUvs2 ) newUvs2.push( uvs2[ id ] );

		}

		if ( newUvs1 ) this.faceVertexUvs[ 0 ] = newUvs1;
		if ( newUvs2 ) this.faceVertexUvs[ 1 ] = newUvs2;

	}

	//TODO: create class
	parameters : any;

	toJSON () : Geometry.Data {

		let data = new Geometry.Data();
		data.metadata = {
			version: 4.5,
			type: 'Geometry',
			generator: 'Geometry.toJSON'
		};
		// standard Geometry serialization
		data.uuid = this.uuid;
		data.type = this.type;
		data.data = new Geometry.DataData();

		if ( this.name !== ''  ) data.name = this.name;

		if ( this.parameters !== undefined ) {

			let parameters = this.parameters;

			for ( let key in parameters ) {

				if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

			}

			return data;

		}

		let vertices = [];

		for ( let i = 0; i < this.vertices.length; i ++ ) {

			let vertex = this.vertices[ i ];
			vertices.push( vertex.x, vertex.y, vertex.z );

		}

		let faces = [];
		let normals = [];
		let normalsHash = {};
		let colors = [];
		let colorsHash = {};
		let uvs = [];
		let uvsHash = {};

		for ( let i = 0; i < this.faces.length; i ++ ) {

			let face = this.faces[ i ];

			let hasMaterial = true;
			let hasFaceUv = false; // deprecated
			let hasFaceVertexUv = this.faceVertexUvs[ 0 ][ i ] !== undefined;
			let hasFaceNormal = face.normal.length() > 0;
			let hasFaceVertexNormal = face.vertexNormals.length > 0;
			let hasFaceColor = face.color.r !== 1 || face.color.g !== 1 || face.color.b !== 1;
			let hasFaceVertexColor = face.vertexColors.length > 0;

			let faceType = 0;

			faceType = setBit( faceType, 0, 0 ); // isQuad
			faceType = setBit( faceType, 1, hasMaterial );
			faceType = setBit( faceType, 2, hasFaceUv );
			faceType = setBit( faceType, 3, hasFaceVertexUv );
			faceType = setBit( faceType, 4, hasFaceNormal );
			faceType = setBit( faceType, 5, hasFaceVertexNormal );
			faceType = setBit( faceType, 6, hasFaceColor );
			faceType = setBit( faceType, 7, hasFaceVertexColor );

			faces.push( faceType );
			faces.push( face.a, face.b, face.c );
			faces.push( face.materialIndex );

			if ( hasFaceVertexUv ) {

				let faceVertexUvs = this.faceVertexUvs[ 0 ][ i ];

				faces.push(
					getUvIndex( faceVertexUvs[ 0 ] ),
					getUvIndex( faceVertexUvs[ 1 ] ),
					getUvIndex( faceVertexUvs[ 2 ] )
				);

			}

			if ( hasFaceNormal ) {

				faces.push( getNormalIndex( face.normal ) );

			}

			if ( hasFaceVertexNormal ) {

				let vertexNormals = face.vertexNormals;

				faces.push(
					getNormalIndex( vertexNormals[ 0 ] ),
					getNormalIndex( vertexNormals[ 1 ] ),
					getNormalIndex( vertexNormals[ 2 ] )
				);

			}

			if ( hasFaceColor ) {

				faces.push( getColorIndex( face.color ) );

			}

			if ( hasFaceVertexColor ) {

				let vertexColors = face.vertexColors;

				faces.push(
					getColorIndex( vertexColors[ 0 ] ),
					getColorIndex( vertexColors[ 1 ] ),
					getColorIndex( vertexColors[ 2 ] )
				);

			}

		}

		function setBit( value, position, enabled ) {

			return enabled ? value | ( 1 << position ) : value & ( ~ ( 1 << position ) );

		}

		function getNormalIndex( normal ) {

			let hash = normal.x.toString() + normal.y.toString() + normal.z.toString();

			if ( normalsHash[ hash ] !== undefined ) {

				return normalsHash[ hash ];

			}

			normalsHash[ hash ] = normals.length / 3;
			normals.push( normal.x, normal.y, normal.z );

			return normalsHash[ hash ];

		}

		function getColorIndex( color ) {

			let hash = color.r.toString() + color.g.toString() + color.b.toString();

			if ( colorsHash[ hash ] !== undefined ) {

				return colorsHash[ hash ];

			}

			colorsHash[ hash ] = colors.length;
			colors.push( color.getHex() );

			return colorsHash[ hash ];

		}

		function getUvIndex( uv ) {

			let hash = uv.x.toString() + uv.y.toString();

			if ( uvsHash[ hash ] !== undefined ) {

				return uvsHash[ hash ];

			}

			uvsHash[ hash ] = uvs.length / 2;
			uvs.push( uv.x, uv.y );

			return uvsHash[ hash ];

		}

		data.data.vertices = vertices;
		data.data.normals = normals;
		if ( colors.length > 0 ) data.data.colors = colors;
		if ( uvs.length > 0 ) data.data.uvs = [ uvs ]; // temporal backward compatibility
		data.data.faces = faces;

		return data;

	}

	clone () : Geometry {

		/*
		 // Handle primitives

		 let parameters = this.parameters;

		 if ( parameters !== undefined ) {

		 let values = [];

		 for ( let key in parameters ) {

		 values.push( parameters[ key ] );

		 }

		 let geometry = Object.create( this.constructor.prototype );
		 this.constructor.apply( geometry, values );
		 return geometry;

		 }

		 return new this.constructor().copy( this );
		 */

		return new Geometry().copy( this );

	}

	copy ( source : Geometry ) : Geometry {

		let i, il, j, jl, k, kl;

		// reset

		this.vertices = [];
		this.colors = [];
		this.faces = [];
		this.faceVertexUvs = [[]];
		this.morphTargets = [];
		this.morphNormals = [];
		this.skinWeights = [];
		this.skinIndices = [];
		this.lineDistances = [];
		this.boundingBox = null;
		this.boundingSphere = null;

		// name

		this.name = source.name;

		// vertices

		let vertices = source.vertices;

		for ( i = 0, il = vertices.length; i < il; i ++ ) {

			this.vertices.push( vertices[ i ].clone() );

		}

		// colors

		let colors = source.colors;

		for ( i = 0, il = colors.length; i < il; i ++ ) {

			this.colors.push( colors[ i ].clone() );

		}

		// faces

		let faces = source.faces;

		for ( i = 0, il = faces.length; i < il; i ++ ) {

			this.faces.push( faces[ i ].clone() );

		}

		// face vertex uvs

		for ( i = 0, il = source.faceVertexUvs.length; i < il; i ++ ) {

			let faceVertexUvs = source.faceVertexUvs[ i ];

			if ( this.faceVertexUvs[ i ] === undefined ) {

				this.faceVertexUvs[ i ] = [];

			}

			for ( j = 0, jl = faceVertexUvs.length; j < jl; j ++ ) {

				let uvs = faceVertexUvs[ j ], uvsCopy = [];

				for ( k = 0, kl = uvs.length; k < kl; k ++ ) {

					let uv = uvs[ k ];

					uvsCopy.push( uv.clone() );

				}

				this.faceVertexUvs[ i ].push( uvsCopy );

			}

		}

		// morph targets

		let morphTargets = source.morphTargets;

		for ( i = 0, il = morphTargets.length; i < il; i ++ ) {

			let morphTarget = new Geometry.MorphTarget();
			morphTarget.name = morphTargets[ i ].name;

			// vertices

			if ( morphTargets[ i ].vertices !== undefined ) {

				morphTarget.vertices = [];

				for ( j = 0, jl = morphTargets[ i ].vertices.length; j < jl; j ++ ) {

					morphTarget.vertices.push( morphTargets[ i ].vertices[ j ].clone() );

				}

			}

			// normals

			if ( morphTargets[ i ].normals !== undefined ) {

				morphTarget.normals = [];

				for ( j = 0, jl = morphTargets[ i ].normals.length; j < jl; j ++ ) {

					morphTarget.normals.push( morphTargets[ i ].normals[ j ].clone() );

				}

			}

			this.morphTargets.push( morphTarget );

		}

		// morph normals

		let morphNormals = source.morphNormals;

		for ( i = 0, il = morphNormals.length; i < il; i ++ ) {

			let morphNormal = {} as any;

			// vertex normals

			if ( morphNormals[ i ].vertexNormals !== undefined ) {

				morphNormal.vertexNormals = [];

				for ( j = 0, jl = morphNormals[ i ].vertexNormals.length; j < jl; j ++ ) {

					let srcVertexNormal = morphNormals[ i ].vertexNormals[ j ];
					//TODO: create class
					let destVertexNormal = {} as any;

					destVertexNormal.a = srcVertexNormal.a.clone();
					destVertexNormal.b = srcVertexNormal.b.clone();
					destVertexNormal.c = srcVertexNormal.c.clone();

					morphNormal.vertexNormals.push( destVertexNormal );

				}

			}

			// face normals

			if ( morphNormals[ i ].faceNormals !== undefined ) {

				morphNormal.faceNormals = [];

				for ( j = 0, jl = morphNormals[ i ].faceNormals.length; j < jl; j ++ ) {

					morphNormal.faceNormals.push( morphNormals[ i ].faceNormals[ j ].clone() );

				}

			}

			this.morphNormals.push( morphNormal );

		}

		// skin weights

		let skinWeights = source.skinWeights;

		for ( i = 0, il = skinWeights.length; i < il; i ++ ) {

			this.skinWeights.push( skinWeights[ i ].clone() );

		}

		// skin indices

		let skinIndices = source.skinIndices;

		for ( i = 0, il = skinIndices.length; i < il; i ++ ) {

			this.skinIndices.push( skinIndices[ i ].clone() );

		}

		// line distances

		let lineDistances = source.lineDistances;

		for ( i = 0, il = lineDistances.length; i < il; i ++ ) {

			this.lineDistances.push( lineDistances[ i ] );

		}

		// bounding box

		let boundingBox = source.boundingBox;

		if ( boundingBox !== null ) {

			this.boundingBox = boundingBox.clone();

		}

		// bounding sphere

		let boundingSphere = source.boundingSphere;

		if ( boundingSphere !== null ) {

			this.boundingSphere = boundingSphere.clone();

		}

		// update flags

		this.elementsNeedUpdate = source.elementsNeedUpdate;
		this.verticesNeedUpdate = source.verticesNeedUpdate;
		this.uvsNeedUpdate = source.uvsNeedUpdate;
		this.normalsNeedUpdate = source.normalsNeedUpdate;
		this.colorsNeedUpdate = source.colorsNeedUpdate;
		this.lineDistancesNeedUpdate = source.lineDistancesNeedUpdate;
		this.groupsNeedUpdate = source.groupsNeedUpdate;

		return this;

	}

	dispose () : void {

		this.dispatchEvent( { type: 'dispose' } );

	}

}

export module Geometry{
	export class MorphTarget{
		name : string;
		vertices : Array<Vector3>;
		normals : Array<Vector3>;
	}
	export class Data{
		metadata : any;
		// standard Geometry serialization
		uuid : string;
		type : string;
		name : string;
		data : DataData;
	}
	export class DataData{
		vertices;
		normals;
		colors;
		uvs;
		faces;
	}
}
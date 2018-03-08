import { Vector3 } from '../math/Vector3';
import { Box3 } from '../math/Box3';
import { EventDispatcher } from './EventDispatcher';
import { BufferAttribute, Float32BufferAttribute, Uint16BufferAttribute, Uint32BufferAttribute } from './BufferAttribute';
import { Sphere } from '../math/Sphere';
import { DirectGeometry } from './DirectGeometry';
import { Object3D } from './Object3D';
import { Matrix4 } from '../math/Matrix4';
import { Matrix3 } from '../math/Matrix3';
import { _Math } from '../math/Math';
import { arrayMax } from '../utils';
import { InterleavedBufferAttribute, Points, Line, Mesh, Geometry } from '../Three';

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */



export class BufferGeometry extends EventDispatcher {
	static bufferGeometryId : number = 1; // BufferGeometry uses odd numbers as Id
	id;
	uuid : string = _Math.generateUUID();
	name : string = '';
	type : string = 'BufferGeometry';
	index : BufferAttribute = null;
	//TODO: create class
	attributes = {} as any;
	morphAttributes = {};
	//TODO: create class
	groups : Array<any> = [];
	boundingBox = null;
	boundingSphere = null;
	drawRange = { start: 0, count: Infinity };

	isBufferGeometry : boolean = true;
	constructor(){
		super();
		this.id = BufferGeometry.bufferGeometryId += 2;

	}



	getIndex () : BufferAttribute {

		return this.index;

	}

	setIndex ( index : BufferAttribute | Array<number> ) : void {

		if ( Array.isArray( index ) ) {

			this.index = new ( arrayMax( index ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( index, 1, null );

		} else {

			this.index = index;

		}

	}

	//TODO: check if InterleavedBufferAttribute should be accepted
	addAttribute ( name : string, attribute : BufferAttribute ) : BufferGeometry {

		if ( ! ( attribute && attribute.isBufferAttribute ) && ! ( attribute && (attribute as any as InterleavedBufferAttribute).isInterleavedBufferAttribute ) ) {

			console.warn( 'THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).' );

			this.addAttribute( name, new BufferAttribute( arguments[ 1 ], arguments[ 2 ] ) );

			return;

		}

		if ( name === 'index' ) {

			console.warn( 'THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute.' );
			this.setIndex( attribute );

			return;

		}

		this.attributes[ name ] = attribute;

		return this;

	}

	getAttribute ( name : string ) : BufferAttribute {

		return this.attributes[ name ];

	}

	removeAttribute ( name : string ) : BufferGeometry {

		delete this.attributes[ name ];

		return this;

	}

	addGroup ( start : number, count : number, materialIndex? : number ) : void {

		this.groups.push( {

			start: start,
			count: count,
			materialIndex: materialIndex !== undefined ? materialIndex : 0

		} );

	}

	clearGroups () : void {

		this.groups = [];

	}

	setDrawRange ( start : number, count : number ) {

		this.drawRange.start = start;
		this.drawRange.count = count;

	}

	applyMatrix ( matrix : Matrix4 ) : BufferGeometry {

		let position = this.attributes.position;

		if ( position !== undefined ) {

			matrix.applyToBufferAttribute( position );
			position.needsUpdate = true;

		}

		let normal = this.attributes.normal;

		if ( normal !== undefined ) {

			let normalMatrix = new Matrix3().getNormalMatrix( matrix );

			normalMatrix.applyToBufferAttribute( normal );
			normal.needsUpdate = true;

		}

		if ( this.boundingBox !== null ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere !== null ) {

			this.computeBoundingSphere();

		}

		return this;

	}

	rotateX( angle : number ) : BufferGeometry {
			let m1 = new Matrix4()
			m1.makeRotationX( angle );

			this.applyMatrix( m1 );

			return this;


	}

	rotateY( angle : number ) : BufferGeometry {
			let m1 = new Matrix4();
			m1.makeRotationY( angle );

			this.applyMatrix( m1 );

			return this;

	}

	rotateZ( angle : number ) : BufferGeometry {
		let m1 = new Matrix4();
		m1.makeRotationZ( angle );

		this.applyMatrix( m1 );

		return this;


	}

	translate( x : number, y : number, z : number ) : BufferGeometry {
		let m1 = new Matrix4();
		m1.makeTranslation( x, y, z );

		this.applyMatrix( m1 );

		return this;

	}

	scale( x : number, y : number, z : number ) : BufferGeometry {
			let m1 = new Matrix4();
			m1.makeScale( x, y, z );

			this.applyMatrix( m1 );

			return this;

		}

	lookAt( vector : Vector3 ) : void {
		let obj = new Object3D();
		obj.lookAt( vector );

		obj.updateMatrix();

		this.applyMatrix( obj.matrix );

	}

	center () : number {

		this.computeBoundingBox();

		let offset = this.boundingBox.getCenter().negate();

		this.translate( offset.x, offset.y, offset.z );

		return offset;

	}

	setFromObject ( object : Object3D ) : BufferGeometry {

		// console.log( 'THREE.BufferGeometry.setFromObject(). Converting', object, this );

		let geometry = object.geometry;

		if ( (object as Points).isPoints || (object as Line).isLine ) {

			let positions = new Float32BufferAttribute( geometry.vertices.length * 3, 3 );
			let colors = new Float32BufferAttribute( geometry.colors.length * 3, 3 );

			this.addAttribute( 'position', positions.copyVector3sArray( geometry.vertices ) );
			this.addAttribute( 'color', colors.copyColorsArray( geometry.colors ) );

			if ( geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length ) {

				let lineDistances = new Float32BufferAttribute( geometry.lineDistances.length, 1 );

				this.addAttribute( 'lineDistance', lineDistances.copyArray( geometry.lineDistances ) );

			}

			if ( geometry.boundingSphere !== null ) {

				this.boundingSphere = geometry.boundingSphere.clone();

			}

			if ( geometry.boundingBox !== null ) {

				this.boundingBox = geometry.boundingBox.clone();

			}

		} else if ( (object as Mesh).isMesh ) {

			if ( geometry && (geometry as Geometry).isGeometry ) {

				this.fromGeometry( geometry as Geometry );

			}

		}

		return this;

	}

	setFromPoints ( points : Array<Vector3> ) : BufferGeometry {

		let position = [];

		for ( let i = 0, l = points.length; i < l; i ++ ) {

			let point = points[ i ];
			position.push( point.x, point.y, point.z || 0 );

		}

		this.addAttribute( 'position', new Float32BufferAttribute( position, 3 ) );

		return this;

	}

	updateFromObject ( object : Object3D ) : BufferGeometry {

		let geometry = object.geometry;

		if ( (object as Mesh).isMesh ) {

			let direct = geometry.__directGeometry;

			if ( geometry.elementsNeedUpdate === true ) {

				direct = undefined;
				geometry.elementsNeedUpdate = false;

			}

			if ( direct === undefined ) {

				return this.fromGeometry( geometry );

			}

			direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
			direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
			direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
			direct.uvsNeedUpdate = geometry.uvsNeedUpdate;
			direct.groupsNeedUpdate = geometry.groupsNeedUpdate;

			geometry.verticesNeedUpdate = false;
			geometry.normalsNeedUpdate = false;
			geometry.colorsNeedUpdate = false;
			geometry.uvsNeedUpdate = false;
			geometry.groupsNeedUpdate = false;

			geometry = direct;

		}

		let attribute;

		if ( geometry.verticesNeedUpdate === true ) {

			attribute = this.attributes.position;

			if ( attribute !== undefined ) {

				attribute.copyVector3sArray( geometry.vertices );
				attribute.needsUpdate = true;

			}

			geometry.verticesNeedUpdate = false;

		}

		if ( geometry.normalsNeedUpdate === true ) {

			attribute = this.attributes.normal;

			if ( attribute !== undefined ) {

				attribute.copyVector3sArray( geometry.normals );
				attribute.needsUpdate = true;

			}

			geometry.normalsNeedUpdate = false;

		}

		if ( geometry.colorsNeedUpdate === true ) {

			attribute = this.attributes.color;

			if ( attribute !== undefined ) {

				attribute.copyColorsArray( geometry.colors );
				attribute.needsUpdate = true;

			}

			geometry.colorsNeedUpdate = false;

		}

		if ( geometry.uvsNeedUpdate ) {

			attribute = this.attributes.uv;

			if ( attribute !== undefined ) {

				attribute.copyVector2sArray( geometry.uvs );
				attribute.needsUpdate = true;

			}

			geometry.uvsNeedUpdate = false;

		}

		if ( geometry.lineDistancesNeedUpdate ) {

			attribute = this.attributes.lineDistance;

			if ( attribute !== undefined ) {

				attribute.copyArray( geometry.lineDistances );
				attribute.needsUpdate = true;

			}

			geometry.lineDistancesNeedUpdate = false;

		}

		if ( geometry.groupsNeedUpdate ) {

			geometry.computeGroups( object.geometry );
			this.groups = geometry.groups;

			geometry.groupsNeedUpdate = false;

		}

		return this;

	}

	fromGeometry ( geometry : Geometry ) : BufferGeometry {

		geometry.__directGeometry = new DirectGeometry().fromGeometry( geometry );

		return this.fromDirectGeometry( geometry.__directGeometry );

	}

	fromDirectGeometry ( geometry : DirectGeometry ) : BufferGeometry {

		let positions = new Float32Array( geometry.vertices.length * 3 );
		this.addAttribute( 'position', new BufferAttribute( positions, 3 ).copyVector3sArray( geometry.vertices ) );

		if ( geometry.normals.length > 0 ) {

			let normals = new Float32Array( geometry.normals.length * 3 );
			this.addAttribute( 'normal', new BufferAttribute( normals, 3 ).copyVector3sArray( geometry.normals ) );

		}

		if ( geometry.colors.length > 0 ) {

			let colors = new Float32Array( geometry.colors.length * 3 );
			this.addAttribute( 'color', new BufferAttribute( colors, 3 ).copyColorsArray( geometry.colors ) );

		}

		if ( geometry.uvs.length > 0 ) {

			let uvs = new Float32Array( geometry.uvs.length * 2 );
			this.addAttribute( 'uv', new BufferAttribute( uvs, 2 ).copyVector2sArray( geometry.uvs ) );

		}

		if ( geometry.uvs2.length > 0 ) {

			let uvs2 = new Float32Array( geometry.uvs2.length * 2 );
			this.addAttribute( 'uv2', new BufferAttribute( uvs2, 2 ).copyVector2sArray( geometry.uvs2 ) );

		}

		if ( geometry.indices.length > 0 ) {

			let TypeArray = arrayMax( geometry.indices ) > 65535 ? Uint32Array : Uint16Array;
			let indices = new TypeArray( geometry.indices.length * 3 );
			this.setIndex( new BufferAttribute( indices, 1 ).copyIndicesArray( geometry.indices ) );

		}

		// groups

		this.groups = geometry.groups;

		// morphs

		for ( let name in geometry.morphTargets ) {

			let array = [];
			let morphTargets = geometry.morphTargets[ name ];

			for ( let i = 0, l = morphTargets.length; i < l; i ++ ) {

				let morphTarget = morphTargets[ i ];

				let attribute = new Float32BufferAttribute( morphTarget.length * 3, 3 );

				array.push( attribute.copyVector3sArray( morphTarget ) );

			}

			this.morphAttributes[ name ] = array;

		}

		// skinning

		if ( geometry.skinIndices.length > 0 ) {

			let skinIndices = new Float32BufferAttribute( geometry.skinIndices.length * 4, 4 );
			this.addAttribute( 'skinIndex', skinIndices.copyVector4sArray( geometry.skinIndices ) );

		}

		if ( geometry.skinWeights.length > 0 ) {

			let skinWeights = new Float32BufferAttribute( geometry.skinWeights.length * 4, 4 );
			this.addAttribute( 'skinWeight', skinWeights.copyVector4sArray( geometry.skinWeights ) );

		}

		//

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		return this;

	}

	computeBoundingBox () : void {

		if ( this.boundingBox === null ) {

			this.boundingBox = new Box3();

		}

		let position = this.attributes.position;

		if ( position !== undefined ) {

			this.boundingBox.setFromBufferAttribute( position );

		} else {

			this.boundingBox.makeEmpty();

		}

		if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

			console.error( 'THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

		}

	}

	computeBoundingSphere() : void {
		let box = new Box3();
		let vector = new Vector3();
		if ( this.boundingSphere === null ) {

			this.boundingSphere = new Sphere();

		}

		let position = this.attributes.position;

		if ( position ) {

			let center = this.boundingSphere.center;

			box.setFromBufferAttribute( position );
			box.getCenter( center );

			// hoping to find a boundingSphere with a radius smaller than the
			// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

			let maxRadiusSq = 0;

			for ( let i = 0, il = position.count; i < il; i ++ ) {

				vector.x = position.getX( i );
				vector.y = position.getY( i );
				vector.z = position.getZ( i );
				maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

			}

			this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

			if ( isNaN( this.boundingSphere.radius ) ) {

				console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

			}

		}

	}

	computeFaceNormals () : void {

		// backwards compatibility

	}

	computeVertexNormals () : void {

		let index = this.index;
		let attributes = this.attributes;
		let groups = this.groups;

		if ( attributes.position ) {

			let positions = attributes.position.array;

			if ( attributes.normal === undefined ) {

				this.addAttribute( 'normal', new BufferAttribute( new Float32Array( positions.length ), 3 ) );

			} else {

				// reset existing normals to zero

				let array = attributes.normal.array;

				for ( let i = 0, il = array.length; i < il; i ++ ) {

					array[ i ] = 0;

				}

			}

			let normals = attributes.normal.array;

			let vA, vB, vC;
			let pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
			let cb = new Vector3(), ab = new Vector3();

			// indexed elements

			if ( index ) {

				let indices = index.array;

				if ( groups.length === 0 ) {

					this.addGroup( 0, indices.length );

				}

				for ( let j = 0, jl = groups.length; j < jl; ++ j ) {

					let group = groups[ j ];

					let start = group.start;
					let count = group.count;

					for ( let i = start, il = start + count; i < il; i += 3 ) {

						vA = indices[ i + 0 ] * 3;
						vB = indices[ i + 1 ] * 3;
						vC = indices[ i + 2 ] * 3;

						pA.fromArray( positions, vA );
						pB.fromArray( positions, vB );
						pC.fromArray( positions, vC );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normals[ vA ] += cb.x;
						normals[ vA + 1 ] += cb.y;
						normals[ vA + 2 ] += cb.z;

						normals[ vB ] += cb.x;
						normals[ vB + 1 ] += cb.y;
						normals[ vB + 2 ] += cb.z;

						normals[ vC ] += cb.x;
						normals[ vC + 1 ] += cb.y;
						normals[ vC + 2 ] += cb.z;

					}

				}

			} else {

				// non-indexed elements (unconnected triangle soup)

				for ( let i = 0, il = positions.length; i < il; i += 9 ) {

					pA.fromArray( positions, i );
					pB.fromArray( positions, i + 3 );
					pC.fromArray( positions, i + 6 );

					cb.subVectors( pC, pB );
					ab.subVectors( pA, pB );
					cb.cross( ab );

					normals[ i ] = cb.x;
					normals[ i + 1 ] = cb.y;
					normals[ i + 2 ] = cb.z;

					normals[ i + 3 ] = cb.x;
					normals[ i + 4 ] = cb.y;
					normals[ i + 5 ] = cb.z;

					normals[ i + 6 ] = cb.x;
					normals[ i + 7 ] = cb.y;
					normals[ i + 8 ] = cb.z;

				}

			}

			this.normalizeNormals();

			attributes.normal.needsUpdate = true;

		}

	}

	merge ( geometry : BufferGeometry, offset : number ) : BufferGeometry {

		if ( ! ( geometry && geometry.isBufferGeometry ) ) {

			console.error( 'THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry );
			return;

		}

		if ( offset === undefined ) offset = 0;

		let attributes = this.attributes;

		for ( let key in attributes ) {

			if ( geometry.attributes[ key ] === undefined ) continue;

			let attribute1 = attributes[ key ];
			let attributeArray1 = attribute1.array;

			let attribute2 = geometry.attributes[ key ];
			let attributeArray2 = attribute2.array;

			let attributeSize = attribute2.itemSize;

			for ( let i = 0, j = attributeSize * offset; i < attributeArray2.length; i ++, j ++ ) {

				attributeArray1[ j ] = attributeArray2[ i ];

			}

		}

		return this;

	}

	normalizeNormals() : void {
			let vector = new Vector3();
			let normals = this.attributes.normal;

			for ( let i = 0, il = normals.count; i < il; i ++ ) {

				vector.x = normals.getX( i );
				vector.y = normals.getY( i );
				vector.z = normals.getZ( i );

				vector.normalize();

				normals.setXYZ( i, vector.x, vector.y, vector.z );

			}

		}

	toNonIndexed () : BufferGeometry {

		if ( this.index === null ) {

			console.warn( 'THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.' );
			return this;

		}

		let geometry2 = new BufferGeometry();

		let indices = this.index.array;
		let attributes = this.attributes;

		for ( let name in attributes ) {

			let attribute = attributes[ name ];

			let array = attribute.array;
			let itemSize = attribute.itemSize;

			let array2 = new array.constructor( indices.length * itemSize );

			let index = 0, index2 = 0;

			for ( let i = 0, l = indices.length; i < l; i ++ ) {

				index = indices[ i ] * itemSize;

				for ( let j = 0; j < itemSize; j ++ ) {

					array2[ index2 ++ ] = array[ index ++ ];

				}

			}

			geometry2.addAttribute( name, new BufferAttribute( array2, itemSize ) );

		}

		return geometry2;

	}

	//TODO/ create class
	parameters : any;

	toJSON () : BufferGeometry.Data {

		let data = new BufferGeometry.Data();
		data.metadata = {
			version: 4.5,
			type: 'BufferGeometry',
			generator: 'BufferGeometry.toJSON'
		};
		// standard BufferGeometry serialization
		data.uuid = this.uuid;
		data.type = this.type;
		data.name = '';


		
		if ( this.name !== '' ) data.name = this.name;

		if ( this.parameters !== undefined ) {

			let parameters = this.parameters;

			for ( let key in parameters ) {

				if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

			}

			return data;

		}

		data.data = new BufferGeometry.DataData();

		let index = this.index;

		if ( index !== null ) {

			let array = Array.prototype.slice.call( index.array );

			data.data.index = {
				type: index.array.constructor.name,
				array: array
			};

		}

		let attributes = this.attributes;

		for ( let key in attributes ) {

			let attribute = attributes[ key ];

			let array = Array.prototype.slice.call( attribute.array );

			data.data.attributes[ key ] = {
				itemSize: attribute.itemSize,
				type: attribute.array.constructor.name,
				array: array,
				normalized: attribute.normalized
			};

		}

		let groups = this.groups;

		if ( groups.length > 0 ) {

			data.data.groups = JSON.parse( JSON.stringify( groups ) );

		}

		let boundingSphere = this.boundingSphere;

		if ( boundingSphere !== null ) {

			data.data.boundingSphere = {
				center: boundingSphere.center.toArray(),
				radius: boundingSphere.radius
			};

		}

		return data;

	}

	clone () : BufferGeometry {

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

		return new BufferGeometry().copy( this );

	}

	copy ( source : BufferGeometry ) : BufferGeometry {

		let name, i, l;

		// reset

		this.index = null;
		this.attributes = {};
		this.morphAttributes = {};
		this.groups = [];
		this.boundingBox = null;
		this.boundingSphere = null;

		// name

		this.name = source.name;

		// index

		let index = source.index;

		if ( index !== null ) {

			this.setIndex( index.clone() );

		}

		// attributes

		let attributes = source.attributes;

		for ( name in attributes ) {

			let attribute = attributes[ name ];
			this.addAttribute( name, attribute.clone() );

		}

		// morph attributes

		let morphAttributes = source.morphAttributes;

		for ( name in morphAttributes ) {

			let array = [];
			let morphAttribute = morphAttributes[ name ]; // morphAttribute: array of Float32BufferAttributes

			for ( i = 0, l = morphAttribute.length; i < l; i ++ ) {

				array.push( morphAttribute[ i ].clone() );

			}

			this.morphAttributes[ name ] = array;

		}

		// groups

		let groups = source.groups;

		for ( i = 0, l = groups.length; i < l; i ++ ) {

			let group = groups[ i ];
			this.addGroup( group.start, group.count, group.materialIndex );

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

		// draw range

		this.drawRange.start = source.drawRange.start;
		this.drawRange.count = source.drawRange.count;

		return this;

	}

	dispose () : void {

		this.dispatchEvent( { type: 'dispose' } );

	}

}

export module BufferGeometry{
	export class Data{
		metadata : any;
		uuid : string;
		name : string;
		type : string;
		data : DataData;
	}
	export class DataData{
		index;
		attributes = {};
		groups;
		boundingSphere;
	}
}
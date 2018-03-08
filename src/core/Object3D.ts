import { Quaternion } from '../math/Quaternion';
import { Vector3 } from '../math/Vector3';
import { Matrix4 } from '../math/Matrix4';
import { EventDispatcher } from './EventDispatcher';
import { Euler } from '../math/Euler';
import { Layers } from './Layers';
import { Matrix3 } from '../math/Matrix3';
import { _Math } from '../math/Math';
import {Raycaster} from '../core/Raycaster'
import { Material, Camera, Geometry, BufferGeometry } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author elephantatwork / www.elephantatwork.ch
 */


export class Object3D extends EventDispatcher {
	static object3DId : number = 0;
	static DefaultUp : Vector3 = new Vector3( 0, 1, 0 );
	static DefaultMatrixAutoUpdate : boolean = true;
	id : number;
	uuid : string = _Math.generateUUID();
	name : string = '';
	type : string = 'Object3D';
	parent : Object3D = null;
	children : Array<Object3D> = [];
	up : Vector3 = Object3D.DefaultUp.clone();
	position : Vector3 = new Vector3();
	rotation : Euler = new Euler();
	quaternion : Quaternion = new Quaternion();
	scale : Vector3 = new Vector3( 1, 1, 1 );
	matrix : Matrix4 = new Matrix4();
	matrixWorld : Matrix4 = new Matrix4();

	matrixAutoUpdate : boolean = Object3D.DefaultMatrixAutoUpdate;
	matrixWorldNeedsUpdate : boolean = false;

	layers : Layers = new Layers();
	visible : boolean = true;

	castShadow : boolean = false;
	receiveShadow  : boolean= false;

	frustumCulled : boolean = true;
	renderOrder : number = 0;

	//TODO: create class
	userData = {};

	geometry : Geometry|BufferGeometry|any;
	material : Material;

	isObject3D : boolean = true;
	constructor(){
		super();
		this.id = Object3D.object3DId++;

		var scope = this;
		this.rotation.onChange( function(){scope.onRotationChange();} );
		this.quaternion.onChange( function(){scope.onQuaternionChange();} );

	}

	onRotationChange() : void {

		this.quaternion.setFromEuler( this.rotation, false );

	}

	onQuaternionChange() : void {

		this.rotation.setFromQuaternion( this.quaternion, undefined, false );

	}

	modelViewMatrix =  new Matrix4();
	normalMatrix = new Matrix3();


	onBeforeRender : Function = function(){};
	onAfterRender : Function = function(){};

	applyMatrix ( matrix : Matrix4 ) : void {

		this.matrix.multiplyMatrices( matrix, this.matrix );

		this.matrix.decompose( this.position, this.quaternion, this.scale );

	}

	applyQuaternion ( q : Quaternion )  : Object3D{

		this.quaternion.premultiply( q );

		return this;

	}

	setRotationFromAxisAngle ( axis : Vector3, angle : number ) : void {

		// assumes axis is normalized

		this.quaternion.setFromAxisAngle( axis, angle );

	}

	setRotationFromEuler ( euler : Euler ) : void {

		this.quaternion.setFromEuler( euler, true );

	}

	setRotationFromMatrix ( m : Matrix4 ) : void {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		this.quaternion.setFromRotationMatrix( m );

	}

	setRotationFromQuaternion ( q : Quaternion ) : void {

		// assumes q is normalized

		this.quaternion.copy( q );

	}


	// rotate object on axis in object space
	// axis is assumed to be normalized

	rotateOnAxis( axis : Vector3, angle : number ) : Object3D {
		let q1 = new Quaternion();
		q1.setFromAxisAngle( axis, angle );

		this.quaternion.multiply( q1 );

		return this;

	}


	// rotate object on axis in world space
	// axis is assumed to be normalized
	// method assumes no rotated parent
	rotateOnWorldAxis( axis : Vector3, angle : number ) : Object3D {
		let q1 = new Quaternion();
		q1.setFromAxisAngle( axis, angle );

		this.quaternion.premultiply( q1 );

		return this;

	}

	rotateX( angle : number ) : Object3D {
		let v1 = new Vector3( 1, 0, 0 );
		return this.rotateOnAxis( v1, angle );

	}

	rotateY( angle : number ) : Object3D {
		let v1 = new Vector3( 0, 1, 0 );
		return this.rotateOnAxis( v1, angle );

	}

	rotateZ( angle : number ) : Object3D {
		let v1 = new Vector3( 0, 0, 1 );
		return this.rotateOnAxis( v1, angle );

	}

	// translate object by distance along axis in object space
	// axis is assumed to be normalized
	translateOnAxis( axis : Vector3, distance : number ) : Object3D {
		let v1 = new Vector3();
		v1.copy( axis ).applyQuaternion( this.quaternion );

		this.position.add( v1.multiplyScalar( distance ) );

		return this;

	}

	translateX( distance : number ) : Object3D {
		let v1 = new Vector3( 1, 0, 0 );
		return this.translateOnAxis( v1, distance );

	}

	translateY( distance : number ) : Object3D {
		let v1 = new Vector3( 0, 1, 0 );
		return this.translateOnAxis( v1, distance );

	}

	translateZ( distance : number ) : Object3D {
		let v1 = new Vector3( 0, 0, 1 );
		return this.translateOnAxis( v1, distance );

	}

	localToWorld ( vector : Vector3 ) : Vector3 {

		return vector.applyMatrix4( this.matrixWorld );

	}

	worldToLocal( vector : Vector3 ) : Vector3 {
		let m1 = new Matrix4();
		return vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );

	}

	lookAt( x : number | Vector3, y? : number, z? : number ) : void {
		let m1 = new Matrix4();
		let vector = new Vector3();
		if ( (x as Vector3).isVector3 ) {

			vector.copy( x as Vector3 );

		} else {

			vector.set( x as number, y, z );

		}

		if ( (this as any as Camera).isCamera ) {

			m1.lookAt( this.position, vector, this.up );

		} else {

			m1.lookAt( vector, this.position, this.up );

		}

		this.quaternion.setFromRotationMatrix( m1 );


	}

	add ( object : Object3D ): Object3D {

		if ( arguments.length > 1 ) {

			for ( let i = 0; i < arguments.length; i ++ ) {

				this.add( arguments[ i ] );

			}

			return this;

		}

		if ( object === this ) {

			console.error( "THREE.Object3D.add: object can't be added as a child of itself.", object );
			return this;

		}

		if ( ( object && object.isObject3D ) ) {

			if ( object.parent !== null ) {

				object.parent.remove( object );

			}

			object.parent = this;
			object.dispatchEvent( { type: 'added' } );

			this.children.push( object );

		} else {

			console.error( "THREE.Object3D.add: object not an instance of THREE.Object3D.", object );

		}

		return this;

	}

	remove ( object : Object3D ) : Object3D {

		if ( arguments.length > 1 ) {

			for ( let i = 0; i < arguments.length; i ++ ) {

				this.remove( arguments[ i ] );

			}

			return this;

		}

		let index = this.children.indexOf( object );

		if ( index !== - 1 ) {

			object.parent = null;

			object.dispatchEvent( { type: 'removed' } );

			this.children.splice( index, 1 );

		}

		return this;

	}

	getObjectById ( id : number ) : Object3D {

		return this.getObjectByProperty( 'id', id );

	}

	getObjectByName ( name : string ) : Object3D {

		return this.getObjectByProperty( 'name', name );

	}

	getObjectByProperty ( name : string, value : any ) : Object3D {

		if ( this[ name ] === value ) return this;

		for ( let i = 0, l = this.children.length; i < l; i ++ ) {

			let child = this.children[ i ];
			let object = child.getObjectByProperty( name, value );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	}

	getWorldPosition ( optionalTarget? : Vector3 ) : Vector3 {

		let result = optionalTarget || new Vector3();

		this.updateMatrixWorld( true );

		return result.setFromMatrixPosition( this.matrixWorld );

	}

	getWorldQuaternion( optionalTarget? : Quaternion ) : Quaternion {
		let position = new Vector3();
		let scale = new Vector3();
		let result = optionalTarget || new Quaternion();

		this.updateMatrixWorld( true );

		this.matrixWorld.decompose( position, result, scale );

		return result;

	}

	getWorldRotation( optionalTarget? : Euler ) : Euler {
		let quaternion = new Quaternion();
		let result = optionalTarget || new Euler();

		this.getWorldQuaternion( quaternion );

		return result.setFromQuaternion( quaternion, this.rotation.order, false );

	}

	getWorldScale( optionalTarget? : Vector3 ) : Vector3 {
		let position = new Vector3();
		let quaternion = new Quaternion();
		let result = optionalTarget || new Vector3();

		this.updateMatrixWorld( true );

		this.matrixWorld.decompose( position, quaternion, result );

		return result;

	}

	getWorldDirection( optionalTarget? : Vector3 ) : Vector3 {

			let quaternion = new Quaternion();
			let result = optionalTarget || new Vector3();

			this.getWorldQuaternion( quaternion );

			return result.set( 0, 0, 1 ).applyQuaternion( quaternion );


	}

	raycast(raycaster : Raycaster, intersects : Array<any>) : Array<any> { return null};

	traverse ( callback : Function ) : void {

		callback( this );

		let children = this.children;

		for ( let i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].traverse( callback );

		}

	}

	traverseVisible ( callback : Function ) : void {

		if ( this.visible === false ) return;

		callback( this );

		let children = this.children;

		for ( let i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].traverseVisible( callback );

		}

	}

	traverseAncestors ( callback : Function ) : void {

		let parent = this.parent;

		if ( parent !== null ) {

			callback( parent );

			parent.traverseAncestors( callback );

		}

	}

	updateMatrix () : void {

		this.matrix.compose( this.position, this.quaternion, this.scale );

		this.matrixWorldNeedsUpdate = true;

	}

	updateMatrixWorld ( force? : boolean ) : void {

		if ( this.matrixAutoUpdate ) this.updateMatrix();

		if ( this.matrixWorldNeedsUpdate || force ) {

			if ( this.parent === null ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		let children = this.children;

		for ( let i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].updateMatrixWorld( force );

		}

	}

	toJSON ( meta? : Object3D.MetaData ) : Object3D.Data {

		// meta is a string when called from JSON.stringify
		let isRootObject = ( meta === undefined || typeof meta === 'string' );

		//TODO: create class
		let output = new Object3D.Data();

		// meta is a hash used to collect geometries, materials.
		// not providing it implies that this is the root object
		// being serialized.
		if ( isRootObject ) {

			// initialize meta obj
			meta = new Object3D.MetaData();

			output.metadata = {
				version: 4.5,
				type: 'Object',
				generator: 'Object3D.toJSON'
			};

		}

		// standard Object3D serialization

		//TODO: create class
		let object = new Object3D.Obj();

		object.uuid = this.uuid;
		object.type = this.type;
		
		if ( this.name !== '' ) object.name = this.name;
		if ( this.castShadow === true ) object.castShadow = true;
		if ( this.receiveShadow === true ) object.receiveShadow = true;
		if ( this.visible === false ) object.visible = false;
		if ( JSON.stringify( this.userData ) !== '{}' ) object.userData = this.userData;

		object.matrix = this.matrix.toArray();

		//

		function serialize( library, element ) : string {

			if ( library[ element.uuid ] === undefined ) {

				library[ element.uuid ] = element.toJSON( meta );

			}

			return element.uuid;

		}

		if ( this.geometry !== undefined ) {

			object.geometry = serialize( meta.geometries, this.geometry );

			let parameters = this.geometry.parameters;

			if ( parameters !== undefined && parameters.shapes !== undefined ) {

				let shapes = parameters.shapes;

				if ( Array.isArray( shapes ) ) {

					for ( let i = 0, l = shapes.length; i < l; i ++ ) {

						let shape = shapes[ i ];

						serialize( meta.shapes, shape );

					}

				} else {

					serialize( meta.shapes, shapes );

				}

			}

		}

		if ( this.material !== undefined ) {

			if ( Array.isArray( this.material ) ) {

				let uuids = [];

				for ( let i = 0, l = this.material.length; i < l; i ++ ) {

					uuids.push( serialize( meta.materials, this.material[ i ] ) );

				}

				object.material = uuids;

			} else {

				object.material = serialize( meta.materials, this.material );

			}

		}

		//

		if ( this.children.length > 0 ) {

			object.children = [];

			for ( let i = 0; i < this.children.length; i ++ ) {

				object.children.push( this.children[ i ].toJSON( meta ).object );

			}

		}

		if ( isRootObject ) {

			let geometries = extractFromCache( meta.geometries );
			let materials = extractFromCache( meta.materials );
			let textures = extractFromCache( meta.textures );
			let images = extractFromCache( meta.images );
			let shapest = extractFromCache( meta.shapes );

			if ( geometries.length > 0 ) output.geometries = geometries;
			if ( materials.length > 0 ) output.materials = materials;
			if ( textures.length > 0 ) output.textures = textures;
			if ( images.length > 0 ) output.images = images;
			if ( shapest.length > 0 ) output.shapes = shapest;

		}

		output.object = object;

		return output;

		// extract data from the cache hash
		// remove metadata on each item
		// and return as array
		function extractFromCache( cache ) {

			let values = [];
			for ( let key in cache ) {

				let data = cache[ key ];
				delete data.metadata;
				values.push( data );

			}
			return values;

		}

	}

	clone ( recursive? : boolean ) : Object3D {

		return new Object3D().copy( this, recursive );

	}

	copy ( source : Object3D, recursive? : boolean ) : Object3D {

		if ( recursive === undefined ) recursive = true;

		this.name = source.name;

		this.up.copy( source.up );

		this.position.copy( source.position );
		this.quaternion.copy( source.quaternion );
		this.scale.copy( source.scale );

		this.matrix.copy( source.matrix );
		this.matrixWorld.copy( source.matrixWorld );

		this.matrixAutoUpdate = source.matrixAutoUpdate;
		this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

		this.layers.mask = source.layers.mask;
		this.visible = source.visible;

		this.castShadow = source.castShadow;
		this.receiveShadow = source.receiveShadow;

		this.frustumCulled = source.frustumCulled;
		this.renderOrder = source.renderOrder;

		this.userData = JSON.parse( JSON.stringify( source.userData ) );

		if ( recursive === true ) {

			for ( let i = 0; i < source.children.length; i ++ ) {

				let child = source.children[ i ];
				this.add( child.clone() );

			}

		}

		return this;

	}

}

export module Object3D{
	export class MetaData{
		geometries = {};
		materials = {};
		textures = {};
		images = {};
		shapes = {};
	}
	export class Data{
		metadata;
		object : Obj;
		geometries;
		materials;
		textures;
		images;
		shapes;
	}
	export class Obj{
		uuid : string;
		type : string;
		name : string;
		castShadow : boolean;
		receiveShadow : boolean;
		visible : boolean;
		userData : any;
		matrix : Array<number>;
		geometry : string;
		material : string|Array<string>;
		children : Array<Obj>;
	}
}
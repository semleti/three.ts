import {
	UVMapping,
	CubeReflectionMapping,
	CubeRefractionMapping,
	EquirectangularReflectionMapping,
	EquirectangularRefractionMapping,
	SphericalReflectionMapping,
	CubeUVReflectionMapping,
	CubeUVRefractionMapping,

	RepeatWrapping,
	ClampToEdgeWrapping,
	MirroredRepeatWrapping,

	NearestFilter,
	NearestMipMapNearestFilter,
	NearestMipMapLinearFilter,
	LinearFilter,
	LinearMipMapNearestFilter,
	LinearMipMapLinearFilter
} from '../constants';
import { Color } from '../math/Color';
import { Object3D } from '../core/Object3D';
import { Group } from '../objects/Group';
import { Sprite } from '../objects/Sprite';
import { Points } from '../objects/Points';
import { Line } from '../objects/Line';
import { LineLoop } from '../objects/LineLoop';
import { LineSegments } from '../objects/LineSegments';
import { LOD } from '../objects/LOD';
import { Mesh } from '../objects/Mesh';
import { SkinnedMesh } from '../objects/SkinnedMesh';
import { Shape } from '../extras/core/Shape';
import { Fog } from '../scenes/Fog';
import { FogExp2 } from '../scenes/FogExp2';
import { HemisphereLight } from '../lights/HemisphereLight';
import { SpotLight } from '../lights/SpotLight';
import { PointLight } from '../lights/PointLight';
import { DirectionalLight } from '../lights/DirectionalLight';
import { AmbientLight } from '../lights/AmbientLight';
import { RectAreaLight } from '../lights/RectAreaLight';
import { OrthographicCamera } from '../cameras/OrthographicCamera';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { Scene } from '../scenes/Scene';
import { Texture } from '../textures/Texture';
import { ImageLoader } from './ImageLoader';
import { LoadingManager, DefaultLoadingManager } from './LoadingManager';
import { AnimationClip } from '../animation/AnimationClip';
import { MaterialLoader } from './MaterialLoader';
import { BufferGeometryLoader } from './BufferGeometryLoader';
import { JSONLoader } from './JSONLoader';
import { FileLoader } from './FileLoader';
import * as Geometries from '../geometries/Geometries';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class ObjectLoader {

	manager : LoadingManager;
	texturePath : string;
	crossOrigin : string;
	constructor( manager : LoadingManager = DefaultLoadingManager ){

		this.manager = manager;
		this.texturePath = '';
	}

	load ( url : string, onLoad : Function, onProgress : Function, onError : Function ) : void {

		if ( this.texturePath === '' ) {

			this.texturePath = url.substring( 0, url.lastIndexOf( '/' ) + 1 );

		}

		let scope = this;

		let loader = new FileLoader( scope.manager );
		loader.load( url, function ( text ) {

			let json = null;

			try {

				json = JSON.parse( text );

			} catch ( error ) {

				if ( onError !== undefined ) onError( error );

				console.error( 'THREE:ObjectLoader: Can\'t parse ' + url + '.', error.message );

				return;

			}

			let metadata = json.metadata;

			if ( metadata === undefined || metadata.type === undefined || metadata.type.toLowerCase() === 'geometry' ) {

				console.error( 'THREE.ObjectLoader: Can\'t load ' + url + '. Use THREEONLoader instead.' );
				return;

			}

			scope.parse( json, onLoad );

		}, onProgress, onError );

	}

	setTexturePath ( value : string ) : void {

		this.texturePath = value;

	}

	setCrossOrigin ( value : string ) : void {

		this.crossOrigin = value;

	}

	parse ( json : any, onLoad : Function ) : any {

		let shapes = this.parseShape( json.shapes );
		let geometries = this.parseGeometries( json.geometries, shapes );

		let images = this.parseImages( json.images, function () {

			if ( onLoad !== undefined ) onLoad( object );

		} );

		let textures = this.parseTextures( json.textures, images );
		let materials = this.parseMaterials( json.materials, textures );

		let object = this.parseObject( json.object, geometries, materials );

		if ( json.animations ) {

			object.animations = this.parseAnimations( json.animations );

		}

		if ( json.images === undefined || json.images.length === 0 ) {

			if ( onLoad !== undefined ) onLoad( object );

		}

		return object;

	}

	parseShape ( json : any ) {

		let shapes = {};

		if ( json !== undefined ) {

			for ( let i = 0, l = json.length; i < l; i ++ ) {

				let shape = new Shape().fromJSON( json[ i ] );

				shapes[ shape.uuid ] = shape;

			}

		}

		return shapes;

	}

	parseGeometries ( json : any, shapes : any ) : any {

		let geometries = {};

		if ( json !== undefined ) {

			let geometryLoader = new JSONLoader();
			let bufferGeometryLoader = new BufferGeometryLoader();

			for ( let i = 0, l = json.length; i < l; i ++ ) {

				let geometry;
				let data = json[ i ];

				switch ( data.type ) {

					case 'PlaneGeometry':
					case 'PlaneBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.width,
							data.height,
							data.widthSegments,
							data.heightSegments
						);

						break;

					case 'BoxGeometry':
					case 'BoxBufferGeometry':
					case 'CubeGeometry': // backwards compatible

						geometry = new Geometries[ data.type ](
							data.width,
							data.height,
							data.depth,
							data.widthSegments,
							data.heightSegments,
							data.depthSegments
						);

						break;

					case 'CircleGeometry':
					case 'CircleBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.segments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'CylinderGeometry':
					case 'CylinderBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radiusTop,
							data.radiusBottom,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'ConeGeometry':
					case 'ConeBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'SphereGeometry':
					case 'SphereBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.widthSegments,
							data.heightSegments,
							data.phiStart,
							data.phiLength,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'DodecahedronGeometry':
					case 'DodecahedronBufferGeometry':
					case 'IcosahedronGeometry':
					case 'IcosahedronBufferGeometry':
					case 'OctahedronGeometry':
					case 'OctahedronBufferGeometry':
					case 'TetrahedronGeometry':
					case 'TetrahedronBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.detail
						);

						break;

					case 'RingGeometry':
					case 'RingBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.innerRadius,
							data.outerRadius,
							data.thetaSegments,
							data.phiSegments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'TorusGeometry':
					case 'TorusBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.arc
						);

						break;

					case 'TorusKnotGeometry':
					case 'TorusKnotBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.tube,
							data.tubularSegments,
							data.radialSegments,
							data.p,
							data.q
						);

						break;

					case 'LatheGeometry':
					case 'LatheBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.points,
							data.segments,
							data.phiStart,
							data.phiLength
						);

						break;

					case 'PolyhedronGeometry':
					case 'PolyhedronBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.vertices,
							data.indices,
							data.radius,
							data.details
						);

						break;

					case 'ShapeGeometry':
					case 'ShapeBufferGeometry':

						let geometryShapes = [];

						for ( let i = 0, l = data.shapes.length; i < l; i ++ ) {

							let shape = shapes[ data.shapes[ i ] ];

							geometryShapes.push( shape );

						}

						geometry = new Geometries[ data.type ](
							geometryShapes,
							data.curveSegments
						);

						break;

					case 'BufferGeometry':

						geometry = bufferGeometryLoader.parse( data );

						break;

					case 'Geometry':

						geometry = geometryLoader.parse( data, this.texturePath ).geometry;

						break;

					default:

						console.warn( 'THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"' );

						continue;

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	}

	parseMaterials ( json : any, textures : any ) : any {

		let materials = {};

		if ( json !== undefined ) {

			let loader = new MaterialLoader();
			loader.setTextures( textures );

			for ( let i = 0, l = json.length; i < l; i ++ ) {

				let data = json[ i ];

				if ( data.type === 'MultiMaterial' ) {

					// Deprecated

					let array = [];

					for ( let j = 0; j < data.materials.length; j ++ ) {

						array.push( loader.parse( data.materials[ j ] ) );

					}

					materials[ data.uuid ] = array;

				} else {

					materials[ data.uuid ] = loader.parse( data );

				}

			}

		}

		return materials;

	}

	parseAnimations ( json : any ) : Array<AnimationClip> {

		let animations = [];

		for ( let i = 0; i < json.length; i ++ ) {

			let clip = AnimationClip.parse( json[ i ] );

			animations.push( clip );

		}

		return animations;

	}

	parseImages ( json : any, onLoad : Function ) : any {

		let scope = this;
		let images = {};

		let loader;

		function loadImage( url ) {

			scope.manager.itemStart( url );

			return loader.load( url, function () {

				scope.manager.itemEnd( url );

			}, undefined, function () {

				scope.manager.itemEnd( url );
				scope.manager.itemError( url );

			} );

		}

		if ( json !== undefined && json.length > 0 ) {

			let manager = new LoadingManager( onLoad );

			loader = new ImageLoader( manager );
			loader.setCrossOrigin( this.crossOrigin );

			for ( let i = 0, l = json.length; i < l; i ++ ) {

				let image = json[ i ];
				let path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test( image.url ) ? image.url : scope.texturePath + image.url;

				images[ image.uuid ] = loadImage( path );

			}

		}

		return images;

	}

	parseTextures ( json : any, images : any ) : any {

		function parseConstant( value, type ) {

			if ( typeof value === 'number' ) return value;

			console.warn( 'THREE.ObjectLoader.parseTexture: Constant should be in numeric form.', value );

			return type[ value ];

		}

		let textures = {};

		if ( json !== undefined ) {

			for ( let i = 0, l = json.length; i < l; i ++ ) {

				let data = json[ i ];

				if ( data.image === undefined ) {

					console.warn( 'THREE.ObjectLoader: No "image" specified for', data.uuid );

				}

				if ( images[ data.image ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined image', data.image );

				}

				let texture = new Texture( images[ data.image ] );
				texture.needsUpdate = true;

				texture.uuid = data.uuid;

				if ( data.name !== undefined ) texture.name = data.name;

				if ( data.mapping !== undefined ) texture.mapping = parseConstant( data.mapping, TEXTURE_MAPPING );

				if ( data.offset !== undefined ) texture.offset.fromArray( data.offset );
				if ( data.repeat !== undefined ) texture.repeat.fromArray( data.repeat );
				if ( data.center !== undefined ) texture.center.fromArray( data.center );
				if ( data.rotation !== undefined ) texture.rotation = data.rotation;

				if ( data.wrap !== undefined ) {

					texture.wrapS = parseConstant( data.wrap[ 0 ], TEXTURE_WRAPPING );
					texture.wrapT = parseConstant( data.wrap[ 1 ], TEXTURE_WRAPPING );

				}

				if ( data.minFilter !== undefined ) texture.minFilter = parseConstant( data.minFilter, TEXTURE_FILTER );
				if ( data.magFilter !== undefined ) texture.magFilter = parseConstant( data.magFilter, TEXTURE_FILTER );
				if ( data.anisotropy !== undefined ) texture.anisotropy = data.anisotropy;

				if ( data.flipY !== undefined ) texture.flipY = data.flipY;

				textures[ data.uuid ] = texture;

			}

		}

		return textures;

	}

	parseObject ( data, geometries?, materials? ) {

		let object;

		function getGeometry( name ) {

			if ( geometries[ name ] === undefined ) {

				console.warn( 'THREE.ObjectLoader: Undefined geometry', name );

			}

			return geometries[ name ];

		}

		function getMaterial( name ) {

			if ( name === undefined ) return undefined;

			if ( Array.isArray( name ) ) {

				let array = [];

				for ( let i = 0, l = name.length; i < l; i ++ ) {

					let uuid = name[ i ];

					if ( materials[ uuid ] === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined material', uuid );

					}

					array.push( materials[ uuid ] );

				}

				return array;

			}

			if ( materials[ name ] === undefined ) {

				console.warn( 'THREE.ObjectLoader: Undefined material', name );

			}

			return materials[ name ];

		}

		switch ( data.type ) {

			case 'Scene':

				object = new Scene();

				if ( data.background !== undefined ) {

					if ( (Number as any).isInteger( data.background ) ) {

						object.background = new Color( data.background );

					}

				}

				if ( data.fog !== undefined ) {

					if ( data.fog.type === 'Fog' ) {

						object.fog = new Fog( data.fog.color, data.fog.near, data.fog.far );

					} else if ( data.fog.type === 'FogExp2' ) {

						object.fog = new FogExp2( data.fog.color, data.fog.density );

					}

				}

				break;

			case 'PerspectiveCamera':

				object = new PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

				if ( data.focus !== undefined ) object.focus = data.focus;
				if ( data.zoom !== undefined ) object.zoom = data.zoom;
				if ( data.filmGauge !== undefined ) object.filmGauge = data.filmGauge;
				if ( data.filmOffset !== undefined ) object.filmOffset = data.filmOffset;
				if ( data.view !== undefined ) object.view = (Object as any).assign( {}, data.view );

				break;

			case 'OrthographicCamera':

				object = new OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

				break;

			case 'AmbientLight':

				object = new AmbientLight( data.color, data.intensity );

				break;

			case 'DirectionalLight':

				object = new DirectionalLight( data.color, data.intensity );

				break;

			case 'PointLight':

				object = new PointLight( data.color, data.intensity, data.distance, data.decay );

				break;

			case 'RectAreaLight':

				object = new RectAreaLight( data.color, data.intensity, data.width, data.height );

				break;

			case 'SpotLight':

				object = new SpotLight( data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay );

				break;

			case 'HemisphereLight':

				object = new HemisphereLight( data.color, data.groundColor, data.intensity );

				break;

			case 'SkinnedMesh':

				console.warn( 'THREE.ObjectLoader.parseObject() does not support SkinnedMesh yet.' );

			case 'Mesh':

				let geometry = getGeometry( data.geometry );
				let material = getMaterial( data.material );

				if ( geometry.bones && geometry.bones.length > 0 ) {

					object = new SkinnedMesh( geometry, material );

				} else {

					object = new Mesh( geometry, material );

				}

				break;

			case 'LOD':

				object = new LOD();

				break;

			case 'Line':

				object = new Line( getGeometry( data.geometry ), getMaterial( data.material ), data.mode );

				break;

			case 'LineLoop':

				object = new LineLoop( getGeometry( data.geometry ), getMaterial( data.material ) );

				break;

			case 'LineSegments':

				object = new LineSegments( getGeometry( data.geometry ), getMaterial( data.material ) );

				break;

			case 'PointCloud':
			case 'Points':

				object = new Points( getGeometry( data.geometry ), getMaterial( data.material ) );

				break;

			case 'Sprite':

				object = new Sprite( getMaterial( data.material ) );

				break;

			case 'Group':

				object = new Group();

				break;

			default:

				object = new Object3D();

		}

		object.uuid = data.uuid;

		if ( data.name !== undefined ) object.name = data.name;
		if ( data.matrix !== undefined ) {

			object.matrix.fromArray( data.matrix );
			object.matrix.decompose( object.position, object.quaternion, object.scale );

		} else {

			if ( data.position !== undefined ) object.position.fromArray( data.position );
			if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
			if ( data.quaternion !== undefined ) object.quaternion.fromArray( data.quaternion );
			if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

		}

		if ( data.castShadow !== undefined ) object.castShadow = data.castShadow;
		if ( data.receiveShadow !== undefined ) object.receiveShadow = data.receiveShadow;

		if ( data.shadow ) {

			if ( data.shadow.bias !== undefined ) object.shadow.bias = data.shadow.bias;
			if ( data.shadow.radius !== undefined ) object.shadow.radius = data.shadow.radius;
			if ( data.shadow.mapSize !== undefined ) object.shadow.mapSize.fromArray( data.shadow.mapSize );
			if ( data.shadow.camera !== undefined ) object.shadow.camera = this.parseObject( data.shadow.camera );

		}

		if ( data.visible !== undefined ) object.visible = data.visible;
		if ( data.userData !== undefined ) object.userData = data.userData;

		if ( data.children !== undefined ) {

			let children = data.children;

			for ( let i = 0; i < children.length; i ++ ) {

				object.add( this.parseObject( children[ i ], geometries, materials ) );

			}

		}

		if ( data.type === 'LOD' ) {

			let levels = data.levels;

			for ( let l = 0; l < levels.length; l ++ ) {

				let level = levels[ l ];
				let child = object.getObjectByProperty( 'uuid', level.object );

				if ( child !== undefined ) {

					object.addLevel( child, level.distance );

				}

			}

		}

		return object;

	}

}

let TEXTURE_MAPPING = {
	UVMapping: UVMapping,
	CubeReflectionMapping: CubeReflectionMapping,
	CubeRefractionMapping: CubeRefractionMapping,
	EquirectangularReflectionMapping: EquirectangularReflectionMapping,
	EquirectangularRefractionMapping: EquirectangularRefractionMapping,
	SphericalReflectionMapping: SphericalReflectionMapping,
	CubeUVReflectionMapping: CubeUVReflectionMapping,
	CubeUVRefractionMapping: CubeUVRefractionMapping
};

let TEXTURE_WRAPPING = {
	RepeatWrapping: RepeatWrapping,
	ClampToEdgeWrapping: ClampToEdgeWrapping,
	MirroredRepeatWrapping: MirroredRepeatWrapping
};

let TEXTURE_FILTER = {
	NearestFilter: NearestFilter,
	NearestMipMapNearestFilter: NearestMipMapNearestFilter,
	NearestMipMapLinearFilter: NearestMipMapLinearFilter,
	LinearFilter: LinearFilter,
	LinearMipMapNearestFilter: LinearMipMapNearestFilter,
	LinearMipMapLinearFilter: LinearMipMapLinearFilter
};


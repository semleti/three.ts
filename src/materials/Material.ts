import { EventDispatcher } from '../core/EventDispatcher';
import { NoColors, FrontSide, FlatShading, NormalBlending, LessEqualDepth, AddEquation, OneMinusSrcAlphaFactor, SrcAlphaFactor } from '../constants';
import { _Math } from '../math/Math';
import { Object3D } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */


export class Material extends EventDispatcher {

	static materialId : number = 0;
	id : number = Material.materialId++;
	uuid : string = _Math.generateUUID();
	name : string = '';
	type : string = 'Material';
	fog : boolean = true;
	lights : boolean = true;
	blending : number = NormalBlending;
	side : number = FrontSide;
	flatShading : boolean = false;
	vertexColors : number = NoColors; // THREE.NoColors, THREE.VertexColors, THREE.FaceColors
	opacity : number = 1;
	transparent : boolean = false;
	blendSrc : number = SrcAlphaFactor;
	blendDst : number = OneMinusSrcAlphaFactor;
	blendEquation : number = AddEquation;
	blendSrcAlpha : number = null;
	blendDstAlpha : number = null;
	blendEquationAlpha : number = null;
	depthFunc : number = LessEqualDepth;
	depthTest : boolean = true;
	depthWrite : boolean = true;
	clippingPlanes : any = null;
	clipIntersection : boolean = false;
	clipShadows : boolean = false;
	shadowSide : boolean = null;
	colorWrite : boolean = true;
	precision : number = null; // override the renderer's default precision for this material
	polygonOffset : boolean = false;
	polygonOffsetFactor : number = 0;
	polygonOffsetUnits : number = 0;
	dithering : boolean = false;
	alphaTest : number = 0;
	premultipliedAlpha : boolean = false;
	overdraw : number = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer
	visible : boolean = true;
	userData : any = {};
	needsUpdate : boolean = true;

	color;roughness;metalness;emissive;emissiveIntensity;specular;shininess;clearCoat;clearCoatRoughness;
	map;alphaMap;lightMap;bumpMap;bumpScale;normalMap;normalScale;displacementMap;displacementScale;displacementBias;
	roughnessMap;metalnessMap;emissiveMap;specularMap;envMap;reflectivity;gradientMap;
	size;sizeAttenuation;

	rotation;linewidth;dashSize;gapSize;scale;
	wireframe;wireframeLinewidth;wireframeLinecap;wireframeLinejoin;morphTargets;skinning;


	isMaterial : boolean = true;
	constructor(){
		super();
	}

	onBeforeCompile () {}

	setValues ( values : Array<any> ) : void {

		if ( values === undefined ) return;

		for ( let key in values ) {

			let newValue = values[ key ];

			if ( newValue === undefined ) {

				console.warn( "THREE.Material: '" + key + "' parameter is undefined." );
				continue;

			}

			// for backward compatability if shading is set in the constructor
			if ( key === 'shading' ) {

				console.warn( 'THREE.' + this.type + ': .shading has been removed. Use the boolean .flatShading instead.' );
				this.flatShading = ( newValue === FlatShading ) ? true : false;
				continue;

			}

			let currentValue = this[ key ];

			if ( currentValue === undefined ) {

				console.warn( "THREE." + this.type + ": '" + key + "' is not a property of this material." );
				continue;

			}

			if ( currentValue && currentValue.isColor ) {

				currentValue.set( newValue );

			} else if ( ( currentValue && currentValue.isVector3 ) && ( newValue && newValue.isVector3 ) ) {

				currentValue.copy( newValue );

			} else if ( key === 'overdraw' ) {

				// ensure overdraw is backwards-compatible with legacy boolean type
				this[ key ] = Number( newValue );

			} else {

				this[ key ] = newValue;

			}

		}

	}

	toJSON ( meta : Object3D.MetaData ) : Material.Data {

		let isRoot = ( meta === undefined || typeof meta === 'string' );

		if ( isRoot ) {

			meta = {
				textures: {},
				images: {}
			} as Object3D.MetaData;

		}

		//TODO: create class
		let data = new Material.Data();
		data.metadata = {
				version: 4.5,
				type: 'Material',
				generator: 'Material.toJSON'
			};

		// standard Material serialization
		data.uuid = this.uuid;
		data.type = this.type;

		if ( this.name !== '' ) data.name = this.name;

		if ( this.color && this.color.isColor ) data.color = this.color.getHex();

		if ( this.roughness !== undefined ) data.roughness = this.roughness;
		if ( this.metalness !== undefined ) data.metalness = this.metalness;

		if ( this.emissive && this.emissive.isColor ) data.emissive = this.emissive.getHex();
		if ( this.emissiveIntensity !== 1 ) data.emissiveIntensity = this.emissiveIntensity;

		if ( this.specular && this.specular.isColor ) data.specular = this.specular.getHex();
		if ( this.shininess !== undefined ) data.shininess = this.shininess;
		if ( this.clearCoat !== undefined ) data.clearCoat = this.clearCoat;
		if ( this.clearCoatRoughness !== undefined ) data.clearCoatRoughness = this.clearCoatRoughness;

		if ( this.map && this.map.isTexture ) data.map = this.map.toJSON( meta ).uuid;
		if ( this.alphaMap && this.alphaMap.isTexture ) data.alphaMap = this.alphaMap.toJSON( meta ).uuid;
		if ( this.lightMap && this.lightMap.isTexture ) data.lightMap = this.lightMap.toJSON( meta ).uuid;
		if ( this.bumpMap && this.bumpMap.isTexture ) {

			data.bumpMap = this.bumpMap.toJSON( meta ).uuid;
			data.bumpScale = this.bumpScale;

		}
		if ( this.normalMap && this.normalMap.isTexture ) {

			data.normalMap = this.normalMap.toJSON( meta ).uuid;
			data.normalScale = this.normalScale.toArray();

		}
		if ( this.displacementMap && this.displacementMap.isTexture ) {

			data.displacementMap = this.displacementMap.toJSON( meta ).uuid;
			data.displacementScale = this.displacementScale;
			data.displacementBias = this.displacementBias;

		}
		if ( this.roughnessMap && this.roughnessMap.isTexture ) data.roughnessMap = this.roughnessMap.toJSON( meta ).uuid;
		if ( this.metalnessMap && this.metalnessMap.isTexture ) data.metalnessMap = this.metalnessMap.toJSON( meta ).uuid;

		if ( this.emissiveMap && this.emissiveMap.isTexture ) data.emissiveMap = this.emissiveMap.toJSON( meta ).uuid;
		if ( this.specularMap && this.specularMap.isTexture ) data.specularMap = this.specularMap.toJSON( meta ).uuid;

		if ( this.envMap && this.envMap.isTexture ) {

			data.envMap = this.envMap.toJSON( meta ).uuid;
			data.reflectivity = this.reflectivity; // Scale behind envMap

		}

		if ( this.gradientMap && this.gradientMap.isTexture ) {

			data.gradientMap = this.gradientMap.toJSON( meta ).uuid;

		}

		if ( this.size !== undefined ) data.size = this.size;
		if ( this.sizeAttenuation !== undefined ) data.sizeAttenuation = this.sizeAttenuation;

		if ( this.blending !== NormalBlending ) data.blending = this.blending;
		if ( this.flatShading === true ) data.flatShading = this.flatShading;
		if ( this.side !== FrontSide ) data.side = this.side;
		if ( this.vertexColors !== NoColors ) data.vertexColors = this.vertexColors;

		if ( this.opacity < 1 ) data.opacity = this.opacity;
		if ( this.transparent === true ) data.transparent = this.transparent;

		data.depthFunc = this.depthFunc;
		data.depthTest = this.depthTest;
		data.depthWrite = this.depthWrite;

		// rotation (SpriteMaterial)
		if ( this.rotation !== 0 ) data.rotation = this.rotation;

		if ( this.linewidth !== 1 ) data.linewidth = this.linewidth;
		if ( this.dashSize !== undefined ) data.dashSize = this.dashSize;
		if ( this.gapSize !== undefined ) data.gapSize = this.gapSize;
		if ( this.scale !== undefined ) data.scale = this.scale;

		if ( this.dithering === true ) data.dithering = true;

		if ( this.alphaTest > 0 ) data.alphaTest = this.alphaTest;
		if ( this.premultipliedAlpha === true ) data.premultipliedAlpha = this.premultipliedAlpha;

		if ( this.wireframe === true ) data.wireframe = this.wireframe;
		if ( this.wireframeLinewidth > 1 ) data.wireframeLinewidth = this.wireframeLinewidth;
		if ( this.wireframeLinecap !== 'round' ) data.wireframeLinecap = this.wireframeLinecap;
		if ( this.wireframeLinejoin !== 'round' ) data.wireframeLinejoin = this.wireframeLinejoin;

		if ( this.morphTargets === true ) data.morphTargets = true;
		if ( this.skinning === true ) data.skinning = true;

		if ( this.visible === false ) data.visible = false;
		if ( JSON.stringify( this.userData ) !== '{}' ) data.userData = this.userData;

		// TODO: Copied from Object3D.toJSON

		function extractFromCache( cache ) {

			let values = [];

			for ( let key in cache ) {

				let data = cache[ key ];
				delete data.metadata;
				values.push( data );

			}

			return values;

		}

		if ( isRoot ) {

			let textures = extractFromCache( meta.textures );
			let images = extractFromCache( meta.images );

			if ( textures.length > 0 ) data.textures = textures;
			if ( images.length > 0 ) data.images = images;

		}

		return data;

	}

	clone () : Material {

		return new Material().copy( this );

	}

	copy ( source : Material ) : Material {

		this.name = source.name;

		this.fog = source.fog;
		this.lights = source.lights;

		this.blending = source.blending;
		this.side = source.side;
		this.flatShading = source.flatShading;
		this.vertexColors = source.vertexColors;

		this.opacity = source.opacity;
		this.transparent = source.transparent;

		this.blendSrc = source.blendSrc;
		this.blendDst = source.blendDst;
		this.blendEquation = source.blendEquation;
		this.blendSrcAlpha = source.blendSrcAlpha;
		this.blendDstAlpha = source.blendDstAlpha;
		this.blendEquationAlpha = source.blendEquationAlpha;

		this.depthFunc = source.depthFunc;
		this.depthTest = source.depthTest;
		this.depthWrite = source.depthWrite;

		this.colorWrite = source.colorWrite;

		this.precision = source.precision;

		this.polygonOffset = source.polygonOffset;
		this.polygonOffsetFactor = source.polygonOffsetFactor;
		this.polygonOffsetUnits = source.polygonOffsetUnits;

		this.dithering = source.dithering;

		this.alphaTest = source.alphaTest;
		this.premultipliedAlpha = source.premultipliedAlpha;

		this.overdraw = source.overdraw;

		this.visible = source.visible;
		this.userData = JSON.parse( JSON.stringify( source.userData ) );

		this.clipShadows = source.clipShadows;
		this.clipIntersection = source.clipIntersection;

		let srcPlanes = source.clippingPlanes,
			dstPlanes = null;

		if ( srcPlanes !== null ) {

			let n = srcPlanes.length;
			dstPlanes = new Array( n );

			for ( let i = 0; i !== n; ++ i )
				dstPlanes[ i ] = srcPlanes[ i ].clone();

		}

		this.clippingPlanes = dstPlanes;

		this.shadowSide = source.shadowSide;

		return this;

	}

	dispose () {

		this.dispatchEvent( { type: 'dispose' } );

	}

}

export module Material{
	export class Data{
		metadata : any;
		uuid : string;
		type : string;
		name : string;
		color : number;
		roughness : number;
		metalness : number;
		emissive : boolean;
		emissiveIntensity : number;
		specular;
		shininess;
		clearCoat;
		clearCoatRoughness;
		map;
		alphaMap;
		lightMap;
		bumpMap;
		bumpScale;
		normalMap;
		normalScale;
		displacementMap;
		displacementScale;
		displacementBias;
		roughnessMap;
		metalnessMap;
		emissiveMap;
		specularMap;
		envMap;
		reflectivity;
		gradientMap;
		size;
		sizeAttenuation;
		blending;
		flatShading;
		side;
		vertexColors;
		opacity;
		transparent;
		depthFunc;
		depthTest;
		depthWrite;
		rotation;
		linewidth;
		dashSize;
		gapSize;
		scale;
		dithering;
		alphaTest;
		premultipliedAlpha;
		wireframe;
		wireframeLinewidth;
		wireframeLinecap;
		wireframeLinejoin;
		morphTargets;
		skinning;
		visible;
		userData;
		textures;
		images;
	}
}
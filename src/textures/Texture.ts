/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

import { EventDispatcher } from '../core/EventDispatcher';
import { UVMapping } from '../constants';
import { MirroredRepeatWrapping, ClampToEdgeWrapping, RepeatWrapping, LinearEncoding, UnsignedByteType, RGBAFormat, LinearMipMapLinearFilter, LinearFilter } from '../constants';
import { _Math } from '../math/Math';
import { Vector2 } from '../math/Vector2';
import { Matrix3 } from '../math/Matrix3';


export class Texture extends EventDispatcher {
	static textureId : number = 0;
	id : number;
	uuid : string;
	name : string;
	//{width:number,height:number,uuid:string}
	image : any;
	mipmaps : Array<any>;
	mapping : number;
	wrapS : number;
	wrapT : number;
	magFilter : number;
	minFilter : number;
	anisotropy : number;
	format : number;
	type : number;
	offset : Vector2;
	repeat : Vector2;
	center : Vector2;
	rotation : number;
	matrixAutoUpdate : boolean;
	matrix : Matrix3;
	generateMipmaps : boolean;
	premultiplyAlpha : boolean;
	flipY : boolean;
	unpackAlignment : number;
	encoding : number;
	version : number;
	onUpdate : Function = function(){};
	isTexture : boolean = true;
	constructor( image : any = Texture.DEFAULT_IMAGE, mapping : number = Texture.DEFAULT_MAPPING, wrapS : number = ClampToEdgeWrapping,
		 wrapT : number = ClampToEdgeWrapping, magFilter : number = LinearFilter, minFilter : number = LinearMipMapLinearFilter,
		 format : number = RGBAFormat, type : number = UnsignedByteType, anisotropy : number = 1, encoding : number = LinearEncoding ){
		super();
		this.id = Texture.textureId ++;
		this.uuid = _Math.generateUUID();

		this.name = '';
	
		this.image = image;
		this.mipmaps = [];
	
		this.mapping = mapping;
	
		this.wrapS = wrapS;
		this.wrapT = wrapT;
	
		this.magFilter = magFilter;
		this.minFilter = minFilter;
	
		this.anisotropy = anisotropy;
	
		this.format = format;
		this.type = type;
	
		this.offset = new Vector2( 0, 0 );
		this.repeat = new Vector2( 1, 1 );
		this.center = new Vector2( 0, 0 );
		this.rotation = 0;
	
		this.matrixAutoUpdate = true;
		this.matrix = new Matrix3();
	
		this.generateMipmaps = true;
		this.premultiplyAlpha = false;
		this.flipY = true;
		this.unpackAlignment = 4;	// valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)
	
		// Values of encoding !== THREE.LinearEncoding only supported on map, envMap and emissiveMap.
		//
		// Also changing the encoding after already used by a Material will not automatically make the Material
		// update.  You need to explicitly call Material.needsUpdate to trigger it to recompile.
		this.encoding = encoding;
	
		this.version = 0;
		this.onUpdate = null;
	}

	clone () : Texture {

		return new Texture().copy( this );

	}

	copy ( source : Texture ) : Texture {

		this.name = source.name;

		this.image = source.image;
		this.mipmaps = source.mipmaps.slice( 0 );

		this.mapping = source.mapping;

		this.wrapS = source.wrapS;
		this.wrapT = source.wrapT;

		this.magFilter = source.magFilter;
		this.minFilter = source.minFilter;

		this.anisotropy = source.anisotropy;

		this.format = source.format;
		this.type = source.type;

		this.offset.copy( source.offset );
		this.repeat.copy( source.repeat );
		this.center.copy( source.center );
		this.rotation = source.rotation;

		this.matrixAutoUpdate = source.matrixAutoUpdate;
		this.matrix.copy( source.matrix );

		this.generateMipmaps = source.generateMipmaps;
		this.premultiplyAlpha = source.premultiplyAlpha;
		this.flipY = source.flipY;
		this.unpackAlignment = source.unpackAlignment;
		this.encoding = source.encoding;

		return this;

	}

	toJSON ( meta : any ) {

		let isRootObject = ( meta === undefined || typeof meta === 'string' );

		if ( ! isRootObject && meta.textures[ this.uuid ] !== undefined ) {

			return meta.textures[ this.uuid ];

		}

		function getDataURL( image : any ) {

			let canvas;

			if ( image instanceof HTMLCanvasElement ) {

				canvas = image;

			} else {

				canvas = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ) as HTMLCanvasElement;
				canvas.width = image.width;
				canvas.height = image.height;

				let context = canvas.getContext( '2d' );

				if ( image instanceof ImageData ) {

					context.putImageData( image, 0, 0 );

				} else {

					context.drawImage( image, 0, 0, image.width, image.height );

				}

			}

			if ( canvas.width > 2048 || canvas.height > 2048 ) {

				return canvas.toDataURL( 'image/jpeg', 0.6 );

			} else {

				return canvas.toDataURL( 'image/png' );

			}

		}

		let output = {
			metadata: {
				version: 4.5,
				type: 'Texture',
				generator: 'Texture.toJSON'
			},

			uuid: this.uuid,
			name: this.name,

			mapping: this.mapping,

			repeat: [ this.repeat.x, this.repeat.y ],
			offset: [ this.offset.x, this.offset.y ],
			center: [ this.center.x, this.center.y ],
			rotation: this.rotation,

			wrap: [ this.wrapS, this.wrapT ],

			minFilter: this.minFilter,
			magFilter: this.magFilter,
			anisotropy: this.anisotropy,

			flipY: this.flipY,
			image: null as any
		};

		if ( this.image !== undefined ) {

			// TODO: Move to THREE.Image

			let image = this.image;

			if ( image.uuid === undefined ) {

				image.uuid = _Math.generateUUID(); // UGH

			}

			if ( ! isRootObject && meta.images[ image.uuid ] === undefined ) {

				meta.images[ image.uuid ] = {
					uuid: image.uuid,
					url: getDataURL( image )
				};

			}

			output.image = image.uuid;

		}

		if ( ! isRootObject ) {

			meta.textures[ this.uuid ] = output;

		}

		return output;

	}

	dispose () : void {

		this.dispatchEvent( { type: 'dispose' } );

	}

	transformUv ( uv : Vector2 ) : void {

		if ( this.mapping !== UVMapping ) return;

		uv.applyMatrix3( this.matrix );

		if ( uv.x < 0 || uv.x > 1 ) {

			switch ( this.wrapS ) {

				case RepeatWrapping:

					uv.x = uv.x - Math.floor( uv.x );
					break;

				case ClampToEdgeWrapping:

					uv.x = uv.x < 0 ? 0 : 1;
					break;

				case MirroredRepeatWrapping:

					if ( Math.abs( Math.floor( uv.x ) % 2 ) === 1 ) {

						uv.x = Math.ceil( uv.x ) - uv.x;

					} else {

						uv.x = uv.x - Math.floor( uv.x );

					}
					break;

			}

		}

		if ( uv.y < 0 || uv.y > 1 ) {

			switch ( this.wrapT ) {

				case RepeatWrapping:

					uv.y = uv.y - Math.floor( uv.y );
					break;

				case ClampToEdgeWrapping:

					uv.y = uv.y < 0 ? 0 : 1;
					break;

				case MirroredRepeatWrapping:

					if ( Math.abs( Math.floor( uv.y ) % 2 ) === 1 ) {

						uv.y = Math.ceil( uv.y ) - uv.y;

					} else {

						uv.y = uv.y - Math.floor( uv.y );

					}
					break;

			}

		}

		if ( this.flipY ) {

			uv.y = 1 - uv.y;

		}

	}


	set needsUpdate ( value : boolean ) {

		if ( value === true ) this.version ++;

	}

	static DEFAULT_IMAGE : any = undefined;
	static DEFAULT_MAPPING : number = UVMapping;

}
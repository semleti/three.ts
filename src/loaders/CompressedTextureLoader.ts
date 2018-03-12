import { LinearFilter } from '../constants';
import { FileLoader } from './FileLoader';
import { CompressedTexture } from '../textures/CompressedTexture';
import { DefaultLoadingManager, LoadingManager } from './LoadingManager';

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * Abstract Base class to block based textures loader (dds, pvr, ...)
 */

export class CompressedTextureLoader {

	manager : LoadingManager;
	// override in sub classes
	_parser : any = null;
	path : string;
	constructor( manager : LoadingManager = DefaultLoadingManager ){
		this.manager = manager;
	}

	load ( url : string, onLoad : Function, onProgress : Function, onError : Function ) : CompressedTexture {

		let scope = this;

		let images = [];

		let texture = new CompressedTexture();
		texture.image = images;

		let loader = new FileLoader( this.manager );
		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );

		function loadTexture( i : number ) : void {

			loader.load( url[ i ], function ( buffer ) {

				let texDatas = scope._parser( buffer, true );
				images[ i ] = {
					width: texDatas.width,
					height: texDatas.height,
					format: texDatas.format,
					mipmaps: texDatas.mipmaps
				};

				loaded += 1;

				if ( loaded === 6 ) {

					if ( texDatas.mipmapCount === 1 )
						texture.minFilter = LinearFilter;

					texture.format = texDatas.format;
					texture.needsUpdate = true;

					if ( onLoad ) onLoad( texture );

				}

			}, onProgress, onError );

		}
		
		let loaded = 0;
		if ( Array.isArray( url ) ) {

			loaded = 0;

			for ( let i = 0, il = url.length; i < il; ++ i ) {

				loadTexture( i );

			}

		} else {

			// compressed cubemap texture stored in a single DDS file

			loader.load( url, function ( buffer ) {

				let texDatas = scope._parser( buffer, true );

				if ( texDatas.isCubemap ) {

					let faces = texDatas.mipmaps.length / texDatas.mipmapCount;

					for ( let f = 0; f < faces; f ++ ) {

						images[ f ] = { mipmaps: [] };

						for ( let i = 0; i < texDatas.mipmapCount; i ++ ) {

							images[ f ].mipmaps.push( texDatas.mipmaps[ f * texDatas.mipmapCount + i ] );
							images[ f ].format = texDatas.format;
							images[ f ].width = texDatas.width;
							images[ f ].height = texDatas.height;

						}

					}

				} else {

					texture.image.width = texDatas.width;
					texture.image.height = texDatas.height;
					texture.mipmaps = texDatas.mipmaps;

				}

				if ( texDatas.mipmapCount === 1 ) {

					texture.minFilter = LinearFilter;

				}

				texture.format = texDatas.format;
				texture.needsUpdate = true;

				if ( onLoad ) onLoad( texture );

			}, onProgress, onError );

		}

		return texture;

	}

	setPath ( value : string ) : CompressedTextureLoader {

		this.path = value;
		return this;

	}

}
/**
 * @author Matt DesLauriers / @mattdesl
 * @author atix / arthursilber.de
 */

import { Texture } from './Texture';
import { NearestFilter, UnsignedShortType, UnsignedInt248Type, DepthFormat, DepthStencilFormat } from '../constants';

export class DepthTexture extends Texture {

	isDepthTexture : boolean = true;
	constructor( width : number, height : number, type : number, mapping : number, wrapS : number, wrapT : number,
		 magFilter? : number, minFilter? : number, anisotropy? : number, format? : number ){

		super(null, mapping, wrapS, wrapT, magFilter !== undefined ? magFilter : NearestFilter, minFilter !== undefined ? minFilter : NearestFilter, format !== undefined ? format : DepthFormat, type, anisotropy );
		format = format !== undefined ? format : DepthFormat;
	
		if ( format !== DepthFormat && format !== DepthStencilFormat ) {
	
			throw new Error( 'DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat' );
	
		}
	
		if ( type === undefined && format === DepthFormat ) type = UnsignedShortType;
		if ( type === undefined && format === DepthStencilFormat ) type = UnsignedInt248Type;
	
	
		this.image = { width: width, height: height };
	
		this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
		this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;
	
		this.flipY = false;
		this.generateMipmaps	= false;
	}

}

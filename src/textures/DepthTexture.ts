/**
 * @author Matt DesLauriers / @mattdesl
 * @author atix / arthursilber.de
 */

import { Texture } from './Texture';
import { NearestFilter, UnsignedShortType, UnsignedInt248Type, DepthFormat, DepthStencilFormat } from '../constants';

export class DepthTexture extends Texture {

	isDepthTexture : boolean = true;
	constructor( width : number, height : number, type : number, mapping : number, wrapS : number, wrapT : number,
		 magFilter : number = NearestFilter, minFilter : number = NearestFilter, anisotropy? : number, format : number = DepthFormat ){

		super(null, mapping, wrapS, wrapT, magFilter, minFilter, format , DepthTexture.fixType(type,format), anisotropy );
	
		if ( format !== DepthFormat && format !== DepthStencilFormat ) {
	
			throw new Error( 'DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat' );
	
		}
	
		this.image = { width: width, height: height };
	
		this.flipY = false;
		this.generateMipmaps = false;
	}

	static fixType(type : any, format : any){
		if ( type === undefined && format === DepthFormat ) return UnsignedShortType;
		if ( type === undefined && format === DepthStencilFormat ) return UnsignedInt248Type;
		return type;
	}

}

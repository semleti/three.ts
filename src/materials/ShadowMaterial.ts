/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  color: <THREE.Color>,
 *  opacity: <float>
 * }
 */

import { Material } from './Material';
import { Color } from '../math/Color';

export class ShadowMaterial extends Material {

	type : string = 'ShadowMaterial';
	isShadowMaterial : boolean = true;
	constructor( parameters : any ){
		super();
		this.color = new Color( 0x000000 );
		this.opacity = 1.0;
	
		this.lights = true;
		this.transparent = true;
	
		this.setValues( parameters );
	}

}

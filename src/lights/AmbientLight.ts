import { Light } from './Light';
import { Color } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class AmbientLight extends Light {

	type : string = 'AmbientLight';
	isAmbientLight : boolean = true;
	constructor( color : Color, intensity : number ){
		super( color, intensity );
		this.castShadow = undefined;
	}
	

}
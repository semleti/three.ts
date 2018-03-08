import { ShaderMaterial } from './ShaderMaterial';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class RawShaderMaterial extends ShaderMaterial {

	type : string = 'RawShaderMaterial';
	isRawShaderMaterial : boolean = true;
	constructor( parameters : any ){
		super(parameters);
	}

}
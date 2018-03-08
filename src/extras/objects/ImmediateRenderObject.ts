import { Object3D } from '../../core/Object3D';
import { Material } from '../../materials/Material';

/**
 * @author alteredq / http://alteredqualia.com/
 */

export class ImmediateRenderObject extends Object3D {
	material : Material;
	render : Function;
	isImmediateRenderObject : boolean = true;
	constructor( material : Material ){
		super();
		this.material = material;
		this.render = function ( /* renderCallback */ ) {};
	}

	

}
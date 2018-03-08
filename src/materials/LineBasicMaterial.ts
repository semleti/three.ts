import { Material } from './Material';
import { Color } from '../math/Color';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round"
 * }
 */

export class LineBasicMaterial extends Material {
	
	type : string = 'LineBasicMaterial';
	color : Color= new Color( 0xffffff );
	linewidth : number = 1;
	linecap : string = 'round';
	linejoin : string = 'round';
	lights : boolean = false;
	isLineBasicMaterial : boolean = true;
	constructor( parameters : any ){
		super();

		this.setValues( parameters );
	}

	copy ( source : LineBasicMaterial ) : LineBasicMaterial {

		super.copy( source );
	
		this.color.copy( source.color );
	
		this.linewidth = source.linewidth;
		this.linecap = source.linecap;
		this.linejoin = source.linejoin;
	
		return this;
	
	}
	

}
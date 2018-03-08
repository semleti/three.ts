/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *
 *  scale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>
 * }
 */

import { LineBasicMaterial } from './LineBasicMaterial';
import { BoxBufferGeometry } from '../Three';

export class LineDashedMaterial extends LineBasicMaterial {

	type : string = 'LineDashedMaterial';
	isLineDashedMaterial : boolean = true;
	constructor( parameters : any ){
		super(parameters);
		this.scale = 1;
		this.dashSize = 3;
		this.gapSize = 1;
		this.setValues( parameters );
	}

	copy ( source : LineBasicMaterial ) : LineBasicMaterial {

		super.copy( source );
	
		this.scale = source.scale;
		this.dashSize = source.dashSize;
		this.gapSize = source.gapSize;
	
		return this;

	}

}

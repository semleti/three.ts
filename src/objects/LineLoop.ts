import { Line } from './Line';

/**
 * @author mgreter / http://github.com/mgreter
 */

export class LineLoop extends Line {

	type = 'LineLoop';
	isLineLoop = true;
	constructor( geometry, material ){
		super( geometry, material );
	}

}

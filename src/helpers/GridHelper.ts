/**
 * @author mrdoob / http://mrdoob.com/
 */

import { LineSegments } from '../objects/LineSegments';
import { VertexColors } from '../constants';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Color } from '../math/Color';

export class GridHelper extends LineSegments {

	constructor( size : number = 10, divisions : number = 10, color1 : number = 0x444444, color2 : number = 0x888888 ){
		super(GridHelper.constructGeom(divisions , size , new Color( color1 ), new Color( color2 )),
			{ vertexColors: VertexColors });
	}

	static constructGeom(divisions : number, size : number, color1 : Color, color2 : Color) : BufferGeometry{	
		let center = divisions / 2;
		let step = size / divisions;
		let halfSize = size / 2;
		let vertices = [], colors = [];

		for ( let i = 0, j = 0, k = - halfSize; i <= divisions; i ++, k += step ) {
	
			vertices.push( - halfSize, 0, k, halfSize, 0, k );
			vertices.push( k, 0, - halfSize, k, 0, halfSize );
	
			let color = i === center ? color1 : color2;
	
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;
	
		}
	
		let geometry = new BufferGeometry();
		geometry.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		geometry.addAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );
		return geometry;
	}

}

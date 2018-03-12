/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / http://github.com/Mugen87
 * @author Hectate / http://www.github.com/Hectate
 */

import { LineSegments } from '../objects/LineSegments';
import { VertexColors } from '../constants';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Color } from '../math/Color';

export class PolarGridHelper extends LineSegments {

	constructor( radius : number = 10, radials : number = 16, circles : number = 8, divisions : number = 64, color1 : number = 0x444444,
		 color2 : number = 0x888888 ){
		super(PolarGridHelper.constructGeom(radius,radials,circles,divisions,new Color( color1 ),new Color( color2  )),
			new LineBasicMaterial( { vertexColors: VertexColors }));

	}

	static constructGeom(radius : number, radials : number, circles : number, divisions : number, color1 : Color, color2 : Color) : BufferGeometry{
		let vertices = [];
		let colors = [];

		let x, z;
		let v, i, j, r, color;

		// create the radials

		for ( i = 0; i <= radials; i ++ ) {

			v = ( i / radials ) * ( Math.PI * 2 );

			x = Math.sin( v ) * radius;
			z = Math.cos( v ) * radius;

			vertices.push( 0, 0, 0 );
			vertices.push( x, 0, z );

			color = ( i & 1 ) ? color1 : color2;

			colors.push( color.r, color.g, color.b );
			colors.push( color.r, color.g, color.b );

		}

		// create the circles

		for ( i = 0; i <= circles; i ++ ) {

			color = ( i & 1 ) ? color1 : color2;

			r = radius - ( radius / circles * i );

			for ( j = 0; j < divisions; j ++ ) {

				// first vertex

				v = ( j / divisions ) * ( Math.PI * 2 );

				x = Math.sin( v ) * r;
				z = Math.cos( v ) * r;

				vertices.push( x, 0, z );
				colors.push( color.r, color.g, color.b );

				// second vertex

				v = ( ( j + 1 ) / divisions ) * ( Math.PI * 2 );

				x = Math.sin( v ) * r;
				z = Math.cos( v ) * r;

				vertices.push( x, 0, z );
				colors.push( color.r, color.g, color.b );

			}

		}
		let geometry = new BufferGeometry();
		geometry.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		geometry.addAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );
		return geometry;
	}

}

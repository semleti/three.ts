/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author mrdoob / http://mrdoob.com/
 */

import { ShapePath } from './ShapePath';
import { Shape } from './Shape';


export class Font {

	type : string = 'Font';
	//TODO: create class
	data : any;
	isFont : boolean = true;
	constructor( data : any ){

		this.data = data;

	}


	generateShapes ( text : string, size : number = 100, divisions : number = 4 ) : Array<Shape> {

		let shapes = [];
		let paths = Font.createPaths( text, size, divisions, this.data );

		for ( let p = 0, pl = paths.length; p < pl; p ++ ) {

			Array.prototype.push.apply( shapes, paths[ p ].toShapes() );

		}

		return shapes;

	}

}

export module Font{

	export function createPaths( text : string, size : number, divisions : number, data : any ) : Array<ShapePath> {

		let chars = String( text ).split( '' );
		let scale = size / data.resolution;
		let line_height = ( data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness ) * scale;

		let paths = [];

		let offsetX = 0, offsetY = 0;

		for ( let i = 0; i < chars.length; i ++ ) {

			let char = chars[ i ];

			if ( char === '\n' ) {

				offsetX = 0;
				offsetY -= line_height;

			} else {

				let ret = createPath( char, divisions, scale, offsetX, offsetY, data );
				offsetX += ret.offsetX;
				paths.push( ret.path );

			}

		}

		return paths;

	}

	export function createPath( char : string, divisions : number, scale : number, offsetX : number, offsetY : number, data : any ) {

		let glyph = data.glyphs[ char ] || data.glyphs[ '?' ];

		if ( ! glyph ) return;

		let path = new ShapePath();

		let x, y, cpx, cpy, cpx1, cpy1, cpx2, cpy2;

		if ( glyph.o ) {

			let outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) );

			for ( let i = 0, l = outline.length; i < l; ) {

				let action = outline[ i ++ ];

				switch ( action ) {

					case 'm': // moveTo

						x = outline[ i ++ ] * scale + offsetX;
						y = outline[ i ++ ] * scale + offsetY;

						path.moveTo( x, y );

						break;

					case 'l': // lineTo

						x = outline[ i ++ ] * scale + offsetX;
						y = outline[ i ++ ] * scale + offsetY;

						path.lineTo( x, y );

						break;

					case 'q': // quadraticCurveTo

						cpx = outline[ i ++ ] * scale + offsetX;
						cpy = outline[ i ++ ] * scale + offsetY;
						cpx1 = outline[ i ++ ] * scale + offsetX;
						cpy1 = outline[ i ++ ] * scale + offsetY;

						path.quadraticCurveTo( cpx1, cpy1, cpx, cpy );

						break;

					case 'b': // bezierCurveTo

						cpx = outline[ i ++ ] * scale + offsetX;
						cpy = outline[ i ++ ] * scale + offsetY;
						cpx1 = outline[ i ++ ] * scale + offsetX;
						cpy1 = outline[ i ++ ] * scale + offsetY;
						cpx2 = outline[ i ++ ] * scale + offsetX;
						cpy2 = outline[ i ++ ] * scale + offsetY;

						path.bezierCurveTo( cpx1, cpy1, cpx2, cpy2, cpx, cpy );

						break;

				}

			}

		}

		return { offsetX: glyph.ha * scale, path: path };

	}
}
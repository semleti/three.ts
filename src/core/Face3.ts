import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

export class Face3 {
	a : number;
	b : number;
	c : number;
	_id : number;
	normal : Vector3;
	vertexNormals : Array<Vector3>;
	color : Color;
	vertexColors : Array<Color>;
	materialIndex : number;
	constructor( a? : number, b? : number, c? : number, normal? : Vector3 | Array<Vector3>, color? : Color | Array<Color>, materialIndex : number = 0 ){
		this.a = a;
		this.b = b;
		this.c = c;

		this.normal = ( normal && (normal as Vector3).isVector3 ) ? normal as Vector3 : new Vector3();
		this.vertexNormals = Array.isArray( normal ) ? normal : [];

		this.color = ( color && (color as Color).isColor ) ? color as Color : new Color();
		this.vertexColors = Array.isArray( color ) ? color : [];

		this.materialIndex = materialIndex;

	}


	clone () : Face3 {

		return new Face3().copy( this );

	}

	copy ( source : Face3 ) : Face3 {

		this.a = source.a;
		this.b = source.b;
		this.c = source.c;

		this.normal.copy( source.normal );
		this.color.copy( source.color );

		this.materialIndex = source.materialIndex;

		for ( let i = 0, il = source.vertexNormals.length; i < il; i ++ ) {

			this.vertexNormals[ i ] = source.vertexNormals[ i ].clone();

		}

		for ( let i = 0, il = source.vertexColors.length; i < il; i ++ ) {

			this.vertexColors[ i ] = source.vertexColors[ i ].clone();

		}

		return this;

	}

}

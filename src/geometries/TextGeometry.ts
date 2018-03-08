/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * Text = 3D Text
 *
 * parameters = {
 *  font: <THREE.Font>, // font
 *
 *  size: <float>, // size of the text
 *  height: <float>, // thickness to extrude text
 *  curveSegments: <int>, // number of points on the curves
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into text bevel goes
 *  bevelSize: <float> // how far from text outline is bevel
 * }
 */

import { Geometry } from '../core/Geometry';
import { ExtrudeBufferGeometry } from './ExtrudeGeometry';

// TextGeometry

export class TextGeometry extends Geometry {

	type : string = 'TextGeometry';
	//TODO: create class
	constructor( text : string, parameters : any ){
		super();
		this.parameters = {
			text: text,
			parameters: parameters
		};
	
		this.fromBufferGeometry( new TextBufferGeometry( text, parameters ) );
		this.mergeVertices();
	}

}

// TextBufferGeometry

export class TextBufferGeometry extends ExtrudeBufferGeometry{

	type : string = 'TextBufferGeometry';
	//TODO: create class
	constructor( text : string, parameters : any ) {
		super(parameters.font.generateShapes( text, parameters.size, parameters.curveSegments ), parameters || {} );

		let font = parameters.font;

		if ( ! ( font && font.isFont ) ) {

			console.error( 'THREE.TextGeometry: font parameter is not an instance of THREE.Font.' );
			return null;
			//return new Geometry();

		}

		// translate parameters to ExtrudeGeometry API

		parameters.amount = parameters.height !== undefined ? parameters.height : 50;

		// defaults

		if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
		if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
		if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;


	}

	

}

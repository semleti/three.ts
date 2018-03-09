/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 */

import { Vector3 } from '../math/Vector3';
import { Object3D } from '../core/Object3D';
import { Line } from '../objects/Line';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Light } from '../lights/Light';
import { DirectionalLight, Color } from '../Three';

export class DirectionalLightHelper extends Object3D {

	light : DirectionalLight;
	color : Color;
	lightPlane : Line;
	targetLine : Line;
	size : number;
	constructor( light : DirectionalLight, size : number, color : Color ){
		super();
		this.size = size;
		this.light = light;
		this.light.updateMatrixWorld();

		this.matrix = light.matrixWorld;
		this.matrixAutoUpdate = false;

		this.color = color;

		if ( size === undefined ) size = 1;

		let geometry = new BufferGeometry();
		geometry.addAttribute( 'position', new Float32BufferAttribute( [
			- size, size, 0,
			size, size, 0,
			size, - size, 0,
			- size, - size, 0,
			- size, size, 0
		], 3 ) );

		let material = new LineBasicMaterial( { fog: false } );

		this.lightPlane = new Line( geometry, material );
		this.add( this.lightPlane );

		geometry = new BufferGeometry();
		geometry.addAttribute( 'position', new Float32BufferAttribute( [ 0, 0, 0, 0, 0, 1 ], 3 ) );

		this.targetLine = new Line( geometry, material );
		this.add( this.targetLine );

		this.update();
	}

	clone () : DirectionalLightHelper {
		return new DirectionalLightHelper(this.light, this.size,this.color).copy(this);
	}

	copy (source : DirectionalLightHelper) : DirectionalLightHelper {
		super.copy(source);
		return this;
	}

	dispose () : void {

		this.lightPlane.geometry.dispose();
		this.lightPlane.material.dispose();
		this.targetLine.geometry.dispose();
		this.targetLine.material.dispose();
	
	}

	update() : void {
		let v1 = new Vector3();
		let v2 = new Vector3();
		let v3 = new Vector3();
		v1.setFromMatrixPosition( this.light.matrixWorld );
		v2.setFromMatrixPosition( this.light.target.matrixWorld );
		v3.subVectors( v2, v1 );

		this.lightPlane.lookAt( v3 );

		if ( this.color !== undefined ) {

			this.lightPlane.material.color.set( this.color );
			this.targetLine.material.color.set( this.color );

		} else {

			this.lightPlane.material.color.copy( this.light.color );
			this.targetLine.material.color.copy( this.light.color );

		}

		this.targetLine.lookAt( v3 );
		this.targetLine.scale.z = v3.length();

	}

}
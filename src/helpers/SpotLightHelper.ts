/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 */

import { Vector3 } from '../math/Vector3';
import { Object3D } from '../core/Object3D';
import { LineSegments } from '../objects/LineSegments';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Color, SpotLight } from '../Three';

export class SpotLightHelper extends Object3D {

	light : SpotLight;
	color : Color;
	cone : LineSegments ;
	constructor( light : SpotLight, color : Color ){
		super();
		this.light = light;
		this.light.updateMatrixWorld();

		this.matrix = light.matrixWorld;
		this.matrixAutoUpdate = false;

		this.color = color;

		let geometry = new BufferGeometry();

		let positions = [
			0, 0, 0, 	0, 0, 1,
			0, 0, 0, 	1, 0, 1,
			0, 0, 0,	- 1, 0, 1,
			0, 0, 0, 	0, 1, 1,
			0, 0, 0, 	0, - 1, 1
		];

		for ( let i = 0, j = 1, l = 32; i < l; i ++, j ++ ) {

			let p1 = ( i / l ) * Math.PI * 2;
			let p2 = ( j / l ) * Math.PI * 2;

			positions.push(
				Math.cos( p1 ), Math.sin( p1 ), 1,
				Math.cos( p2 ), Math.sin( p2 ), 1
			);

		}

		geometry.addAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );

		let material = new LineBasicMaterial( { fog: false } );

		this.cone = new LineSegments( geometry, material );
		this.add( this.cone );

		this.update();
	}

	dispose () : void {

		this.cone.geometry.dispose();
		this.cone.material.dispose();
	
	}

	update() : void {
		let vector = new Vector3();
		let vector2 = new Vector3();
		this.light.updateMatrixWorld();

		let coneLength = this.light.distance ? this.light.distance : 1000;
		let coneWidth = coneLength * Math.tan( this.light.angle );

		this.cone.scale.set( coneWidth, coneWidth, coneLength );

		vector.setFromMatrixPosition( this.light.matrixWorld );
		vector2.setFromMatrixPosition( this.light.target.matrixWorld );

		this.cone.lookAt( vector2.sub( vector ) );

		if ( this.color !== undefined ) {

			this.cone.material.color.set( this.color );

		} else {

			this.cone.material.color.copy( this.light.color );

		}

	}

}

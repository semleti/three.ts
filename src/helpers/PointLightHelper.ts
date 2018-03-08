/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

import { Mesh } from '../objects/Mesh';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { SphereBufferGeometry } from '../geometries/SphereGeometry';
import { PointLight, Color, Matrix4 } from '../Three';

export class PointLightHelper extends Mesh {
	light : PointLight;
	matrix : Matrix4;
	color : Color;
	matrixAutoUpdate : boolean;
	constructor( light : PointLight, sphereSize : number, color : Color ){
		super(new SphereBufferGeometry( sphereSize, 4, 2 ),new MeshBasicMaterial( { wireframe: true, fog: false } ));
		this.light = light;
		this.light.updateMatrixWorld();

		this.color = color;

		this.matrix = this.light.matrixWorld;
		this.matrixAutoUpdate = false;

		this.update();


		/*
		let distanceGeometry = new THREE.IcosahedronGeometry( 1, 2 );
		let distanceMaterial = new THREE.MeshBasicMaterial( { color: hexColor, fog: false, wireframe: true, opacity: 0.1, transparent: true } );

		this.lightSphere = new THREE.Mesh( bulbGeometry, bulbMaterial );
		this.lightDistance = new THREE.Mesh( distanceGeometry, distanceMaterial );

		let d = light.distance;

		if ( d === 0.0 ) {

			this.lightDistance.visible = false;

		} else {

			this.lightDistance.scale.set( d, d, d );

		}

		this.add( this.lightDistance );
		*/
	}

	dispose () : void {

		this.geometry.dispose();
		this.material.dispose();
	
	}

	update () : void {

		if ( this.color !== undefined ) {
	
			this.material.color.set( this.color );
	
		} else {
	
			this.material.color.copy( this.light.color );
	
		}
	
		/*
		let d = this.light.distance;
	
		if ( d === 0.0 ) {
	
			this.lightDistance.visible = false;
	
		} else {
	
			this.lightDistance.visible = true;
			this.lightDistance.scale.set( d, d, d );
	
		}
		*/
	
	}

}
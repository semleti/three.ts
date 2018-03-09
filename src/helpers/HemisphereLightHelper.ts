/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Vector3 } from '../math/Vector3';
import { Color } from '../math/Color';
import { Object3D } from '../core/Object3D';
import { Mesh } from '../objects/Mesh';
import { VertexColors } from '../constants';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { OctahedronBufferGeometry } from '../geometries/OctahedronGeometry';
import { BufferAttribute } from '../core/BufferAttribute';
import { HemisphereLight } from '../Three';

export class HemisphereLightHelper extends Object3D {

	light : HemisphereLight;
	color : Color;
	size : number;
	constructor (light : HemisphereLight, size : number, color : Color ){
		super();
		this.size = size;
		this.light = light;
		this.light.updateMatrixWorld();

		this.matrix = light.matrixWorld;
		this.matrixAutoUpdate = false;

		this.color = color;

		let geometry = new OctahedronBufferGeometry( size );
		geometry.rotateY( Math.PI * 0.5 );

		this.material = new MeshBasicMaterial( { wireframe: true, fog: false } );
		if ( this.color === undefined ) this.material.vertexColors = VertexColors;

		let position = geometry.getAttribute( 'position' );
		let colors = new Float32Array( position.count * 3 );

		geometry.addAttribute( 'color', new BufferAttribute( colors, 3 ) );

		this.add( new Mesh( geometry, this.material ) );

		this.update();
	}

	clone () : HemisphereLightHelper {
		return new HemisphereLightHelper(this.light, this.size,this.color).copy(this);
	}

	copy (source : HemisphereLightHelper) : HemisphereLightHelper {
		super.copy(source);
		return this;
	}

	dispose () : void {

		this.children[ 0 ].geometry.dispose();
		this.children[ 0 ].material.dispose();
	
	}

	update() : void {
		let vector = new Vector3();

		let color1 = new Color();
		let color2 = new Color();
		let mesh = this.children[ 0 ];

		if ( this.color !== undefined ) {

			this.material.color.set( this.color );

		} else {

			let colors = mesh.geometry.getAttribute( 'color' );

			color1.copy( this.light.color );
			color2.copy( this.light.groundColor );

			for ( let i = 0, l = colors.count; i < l; i ++ ) {

				let color = ( i < ( l / 2 ) ) ? color1 : color2;

				colors.setXYZ( i, color.r, color.g, color.b );

			}

			colors.needsUpdate = true;

		}

		mesh.lookAt( vector.setFromMatrixPosition( this.light.matrixWorld ).negate() );

	}

}
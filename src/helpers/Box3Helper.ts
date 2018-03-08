/**
 * @author WestLangley / http://github.com/WestLangley
 */

import { LineSegments } from '../objects/LineSegments';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { BufferAttribute } from '../core/BufferAttribute';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Object3D } from '../core/Object3D';
import { Box3 } from '../math/Box3';

export class Box3Helper extends LineSegments {
	type : string = 'Box3Helper';
	box : Box3;
	constructor( box : Box3, hex : number ){
		super(box, hex);
		this.box = box;

		let color = ( hex !== undefined ) ? hex : 0xffff00;
	
		let indices = new Uint16Array( [ 0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7 ] );
	
		let positions = [ 1, 1, 1, - 1, 1, 1, - 1, - 1, 1, 1, - 1, 1, 1, 1, - 1, - 1, 1, - 1, - 1, - 1, - 1, 1, - 1, - 1 ];
	
		let geometry = new BufferGeometry();
	
		geometry.setIndex( new BufferAttribute( indices, 1 ) );
	
		geometry.addAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
	
		LineSegments.call( this, geometry, new LineBasicMaterial( { color: color } ) );
	
		this.geometry.computeBoundingSphere();
	}

	updateMatrixWorld ( force : boolean ) : void {

		let box = this.box;
	
		if ( box.isEmpty() ) return;
	
		box.getCenter( this.position );
	
		box.getSize( this.scale );
	
		this.scale.multiplyScalar( 0.5 );
	
		super.updateMatrixWorld( force );
	
	}
}

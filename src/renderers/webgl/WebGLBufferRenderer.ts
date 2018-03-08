import { Geometry } from "../../core/Geometry";
import { BufferGeometry } from "../../core/BufferGeometry";

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class WebGLBufferRenderer {

	mode : number;
	gl : any;
	extensions : any;
	infoRender : any;

	constructor( gl : any, extensions : any, infoRender : any ){
		this.gl = gl;
		this.extensions = extensions;
		this.infoRender = infoRender;
	}

	setMode( value : number ) :void {

		this.mode = value;

	}

	render( start : number, count : number ) : void {

		this.gl.drawArrays( this.mode, start, count );

		this.infoRender.calls ++;
		this.infoRender.vertices += count;

		if ( this.mode === this.gl.TRIANGLES ) this.infoRender.faces += count / 3;
		else if ( this.mode === this.gl.POINTS ) this.infoRender.points += count;

	}

	renderInstances( geometry : any, start : number, count : number ) : void {

		let extension = this.extensions.get( 'ANGLE_instanced_arrays' );

		if ( extension === null ) {

			console.error( 'THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
			return;

		}

		let position = geometry.attributes.position;

		if ( position.isInterleavedBufferAttribute ) {

			count = position.data.count;

			extension.drawArraysInstancedANGLE( this.mode, 0, count, geometry.maxInstancedCount );

		} else {

			extension.drawArraysInstancedANGLE( this.mode, start, count, geometry.maxInstancedCount );

		}

		this.infoRender.calls ++;
		this.infoRender.vertices += count * geometry.maxInstancedCount;

		if ( this.mode === this.gl.TRIANGLES ) this.infoRender.faces += geometry.maxInstancedCount * count / 3;
		else if ( this.mode === this.gl.POINTS ) this.infoRender.points += geometry.maxInstancedCount * count;

	}

}

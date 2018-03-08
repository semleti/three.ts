import { BufferGeometry } from "../../core/BufferGeometry";

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class WebGLIndexedBufferRenderer {

	mode : number;
	gl;extensions;infoRender;
	constructor( gl : any, extensions : any, infoRender : any ){
		this.gl = gl;
		this.extensions = extensions;
		this.infoRender = infoRender;
	}

	setMode( value : number ) : void {

		this.mode = value;

	}

	type; bytesPerElement;

	setIndex( value : any ) : void {

		this.type = value.type;
		this.bytesPerElement = value.bytesPerElement;

	}

	render( start : number, count : number ) : void {

		this.gl.drawElements( this.mode, count, this.type, start * this.bytesPerElement );

		this.infoRender.calls ++;
		this.infoRender.vertices += count;

		if ( this.mode === this.gl.TRIANGLES ) this.infoRender.faces += count / 3;
		else if ( this.mode === this.gl.POINTS ) this.infoRender.points += count;

	}

	renderInstances( geometry : any, start : number, count : number ) : void {

		let extension = this.extensions.get( 'ANGLE_instanced_arrays' );

		if ( extension === null ) {

			console.error( 'THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
			return;

		}

		extension.drawElementsInstancedANGLE( this.mode, count, this.type, start * this.bytesPerElement, geometry.maxInstancedCount );

		this.infoRender.calls ++;
		this.infoRender.vertices += count * geometry.maxInstancedCount;

		if ( this.mode === this.gl.TRIANGLES ) this.infoRender.faces += geometry.maxInstancedCount * count / 3;
		else if ( this.mode === this.gl.POINTS ) this.infoRender.points += geometry.maxInstancedCount * count;

	}

}
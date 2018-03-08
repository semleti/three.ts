import { BufferGeometry } from "../../core/BufferGeometry";
import { Object3D } from "../../Three";
import { WebGLGeometries } from "./WebGLGeometries";

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class WebGLObjects {

	updateList = {};
	geometries : any;
	infoRender : any;
	constructor( geometries : WebGLGeometries, infoRender : any ){
		this.geometries = geometries;
		this.infoRender = infoRender;
	}

	update( object : Object3D ) : BufferGeometry {

		let frame = this.infoRender.frame;

		let geometry = object.geometry;
		let buffergeometry = this.geometries.get( object, geometry );

		// Update once per frame

		if ( this.updateList[ buffergeometry.id ] !== frame ) {

			if ( geometry.isGeometry ) {

				buffergeometry.updateFromObject( object );

			}

			this.geometries.update( buffergeometry );

			this.updateList[ buffergeometry.id ] = frame;

		}

		return buffergeometry;

	}

	 dispose() : void {

		this.updateList = {};

	}

}
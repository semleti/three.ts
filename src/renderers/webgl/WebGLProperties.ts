import { Object3D } from "../../Three";

/**
 * @author fordacious / fordacious.github.io
 */

export class WebGLProperties {

	properties = {};

	get( object : any ) : any {

		let uuid = object.uuid;
		let map = this.properties[ uuid ];

		if ( map === undefined ) {

			map = {};
			this.properties[ uuid ] = map;

		}

		return map;

	}

	remove( object : any ) : void {

		delete this.properties[ object.uuid ];

	}

	update( object : any, key : string, value : any ) : void {

		let uuid = object.uuid;
		let map = this.properties[ uuid ];

		map[ key ] = value;

	}

	dispose() : void {

		this.properties = {};

	}

}

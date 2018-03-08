import { Scene } from "../../scenes/Scene";
import { Camera } from "../../cameras/Camera";
import { Object3D } from "../../Three";

/**
 * @author mrdoob / http://mrdoob.com/
 */

function painterSortStable( a : any, b : any ) : number {

	if ( a.renderOrder !== b.renderOrder ) {

		return a.renderOrder - b.renderOrder;

	} else if ( a.program && b.program && a.program !== b.program ) {

		return a.program.id - b.program.id;

	} else if ( a.material.id !== b.material.id ) {

		return a.material.id - b.material.id;

	} else if ( a.z !== b.z ) {

		return a.z - b.z;

	} else {

		return a.id - b.id;

	}

}

function reversePainterSortStable( a : any, b : any ) : number {

	if ( a.renderOrder !== b.renderOrder ) {

		return a.renderOrder - b.renderOrder;

	} if ( a.z !== b.z ) {

		return b.z - a.z;

	} else {

		return a.id - b.id;

	}

}

export class WebGLRenderList {

	renderItems : Array<any> = [];
	renderItemsIndex : number = 0;

	opaque : Array<any> = [];
	transparent : Array<any> = [];

	init() : void {

		this.renderItemsIndex = 0;

		this.opaque.length = 0;
		this.transparent.length = 0;

	}

	push( object : Object3D, geometry : any, material : any, z : number, group : number ) {

		let renderItem = this.renderItems[ this.renderItemsIndex ];

		if ( renderItem === undefined ) {

			renderItem = {
				id: object.id,
				object: object,
				geometry: geometry,
				material: material,
				program: material.program,
				renderOrder: object.renderOrder,
				z: z,
				group: group
			};

			this.renderItems[ this.renderItemsIndex ] = renderItem;

		} else {

			renderItem.id = object.id;
			renderItem.object = object;
			renderItem.geometry = geometry;
			renderItem.material = material;
			renderItem.program = material.program;
			renderItem.renderOrder = object.renderOrder;
			renderItem.z = z;
			renderItem.group = group;

		}

		( material.transparent === true ? this.transparent : this.opaque ).push( renderItem );

		this.renderItemsIndex ++;

	}

	sort() : void {

		if ( this.opaque.length > 1 ) this.opaque.sort( painterSortStable );
		if ( this.transparent.length > 1 ) this.transparent.sort( reversePainterSortStable );

	}

}

export class WebGLRenderLists {

	lists = {};

	get( scene : Scene, camera : Camera ) : WebGLRenderList {

		let hash = scene.id + ',' + camera.id;
		let list = this.lists[ hash ];

		if ( list === undefined ) {

			// console.log( 'THREE.WebGLRenderLists:', hash );

			list = new WebGLRenderList();
			this.lists[ hash ] = list;

		}

		return list;

	}

	dispose() : void {

		this.lists = {};

	}

}

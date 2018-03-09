import { Camera } from './Camera';
import { Object3D } from '../core/Object3D';

/**
 * @author alteredq / http://alteredqualia.com/
 * @author arose / http://github.com/arose
 */

export class OrthographicCamera extends Camera {
	left : number;
	right : number;
	top : number;
	bottom : number;
	near : number;
	far : number;
	type : string = 'OrthographicCamera';
	zoom = 1;
	//TODO: create class defined in setviewofsset
	view = null;
	isOrthographicCamera : boolean = true;
	constructor( left : number, right : number, top : number, bottom : number, near : number, far : number ){
		super();

		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;

		this.near = ( near !== undefined ) ? near : 0.1;
		this.far = ( far !== undefined ) ? far : 2000;

		this.updateProjectionMatrix();

	}

	clone() : OrthographicCamera{
		let cam = new OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far);
		cam.copy(this);
		return cam;
	}

	copy ( source : OrthographicCamera, recursive? : boolean ) : OrthographicCamera {

		super.copy(source, recursive );

		this.left = source.left;
		this.right = source.right;
		this.top = source.top;
		this.bottom = source.bottom;
		this.near = source.near;
		this.far = source.far;

		this.zoom = source.zoom;
		this.view = source.view === null ? null : (Object as any).assign( {}, source.view );

		return this;

	}

	setViewOffset ( fullWidth : number, fullHeight : number, x : number, y : number, width : number, height : number ) : void {

		if ( this.view === null ) {

			this.view = {
				enabled: true,
				fullWidth: 1,
				fullHeight: 1,
				offsetX: 0,
				offsetY: 0,
				width: 1,
				height: 1
			};

		}

		this.view.enabled = true;
		this.view.fullWidth = fullWidth;
		this.view.fullHeight = fullHeight;
		this.view.offsetX = x;
		this.view.offsetY = y;
		this.view.width = width;
		this.view.height = height;

		this.updateProjectionMatrix();

	}

	clearViewOffset () : void {

		if ( this.view !== null ) {

			this.view.enabled = false;

		}

		this.updateProjectionMatrix();

	}

	updateProjectionMatrix () : void {

		let dx = ( this.right - this.left ) / ( 2 * this.zoom );
		let dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
		let cx = ( this.right + this.left ) / 2;
		let cy = ( this.top + this.bottom ) / 2;

		let left = cx - dx;
		let right = cx + dx;
		let top = cy + dy;
		let bottom = cy - dy;

		if ( this.view !== null && this.view.enabled ) {

			let zoomW = this.zoom / ( this.view.width / this.view.fullWidth );
			let zoomH = this.zoom / ( this.view.height / this.view.fullHeight );
			let scaleW = ( this.right - this.left ) / this.view.width;
			let scaleH = ( this.top - this.bottom ) / this.view.height;

			left += scaleW * ( this.view.offsetX / zoomW );
			right = left + scaleW * ( this.view.width / zoomW );
			top -= scaleH * ( this.view.offsetY / zoomH );
			bottom = top - scaleH * ( this.view.height / zoomH );

		}

		this.projectionMatrix.makeOrthographic( left, right, top, bottom, this.near, this.far );

	}

	toJSON ( meta : Object3D.MetaData ) : OrthographicCamera.Data {

		let data : OrthographicCamera.Data = super.toJSON(meta ) as OrthographicCamera.Data;

		data.object.zoom = this.zoom;
		data.object.left = this.left;
		data.object.right = this.right;
		data.object.top = this.top;
		data.object.bottom = this.bottom;
		data.object.near = this.near;
		data.object.far = this.far;

		if ( this.view !== null ) data.object.view = (Object as any).assign( {}, this.view );

		return data;

	}

}

export module OrthographicCamera{
	export class Data extends Object3D.Data{
		object : Obj;
	}
	export class Obj extends Object3D.Obj{
		zoom;
		left;
		right;
		top;
		bottom;
		near;
		far;
		view;
	}
}

import { Light } from './Light';
import { Color, Object3D } from '../Three';

/**
 * @author abelnation / http://github.com/abelnation
 */

export class RectAreaLight extends Light {

	type : string = 'RectAreaLight';
	width : number;
	height : number;
	isRectAreaLight : boolean = true;
	constructor( color : Color, intensity : number, width : number = 10, height : number = 10 ){
		super(color, intensity);
		this.width = width;
		this.height = height;
	}

	clone() : RectAreaLight {
		return new RectAreaLight(this.color, this.intensity, this.width, this.height).copy(this);
	}

	copy ( source : RectAreaLight ) : RectAreaLight {

		super.copy(source);

		this.width = source.width;
		this.height = source.height;

		return this;

	}

	toJSON ( meta : Object3D.MetaData ) : RectAreaLight.Data {

		let data = super.toJSON(meta) as RectAreaLight.Data;

		data.object.width = this.width;
		data.object.height = this.height;

		return data;

	}

}

export module RectAreaLight{
	export class Data extends Light.Data{
		object : Obj;
	}
	export class Obj extends Light.Obj{
		width : number;
		height : number;
	}
}
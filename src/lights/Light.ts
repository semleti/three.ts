import { Object3D } from '../core/Object3D';
import { Color } from '../math/Color';
import { LightShadow } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

export class Light extends Object3D {
	
	type : string = 'Light';
	color : Color;
	intensity : number;
	groundColor : Color;
	distance : number;
	angle : number;
	decay : number;
	penumbra : number;
	shadow : LightShadow;
	isLight : boolean = true;
	constructor( color : Color, intensity : number = 1 ){
		super();
		this.color = new Color( color );
		this.intensity = intensity;
	
		this.receiveShadow = undefined;
	}

	clone() : Light{
		return new Light(this.color, this.intensity).copy(this);
	}

	copy ( source : Light ) : Light {

		super.copy(source);

		this.color.copy( source.color );
		this.intensity = source.intensity;

		return this;

	}

	toJSON ( meta : Object3D.MetaData ) : Light.Data {

		let data = super.toJSON(meta) as Light.Data;

		data.object.color = this.color.getHex();
		data.object.intensity = this.intensity;

		if ( this.groundColor !== undefined ) data.object.groundColor = this.groundColor.getHex();

		if ( this.distance !== undefined ) data.object.distance = this.distance;
		if ( this.angle !== undefined ) data.object.angle = this.angle;
		if ( this.decay !== undefined ) data.object.decay = this.decay;
		if ( this.penumbra !== undefined ) data.object.penumbra = this.penumbra;

		if ( this.shadow !== undefined ) data.object.shadow = this.shadow.toJSON();

		return data;

	}


}

export module Light{
	export class Data extends Object3D.Data{
		object : Obj;
	}
	export class Obj extends Object3D.Obj{
		color;
		intensity;
		groundColor;
		distance;
		angle;
		decay;
		penumbra;
		shadow;
	}
}
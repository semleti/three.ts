import { Object3D } from '../core/Object3D';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class Scene extends Object3D {

	type : string = 'Scene';
	background;fog;overrideMaterial;autoUpdate;
	constructor(){
		super();
		this.background = null;
		this.fog = null;
		this.overrideMaterial = null;
	
		this.autoUpdate = true; // checked by the renderer
	}

	copy ( source : Scene, recursive : boolean ) : Scene {

		super.copy(source, recursive );

		if ( source.background !== null ) this.background = source.background.clone();
		if ( source.fog !== null ) this.fog = source.fog.clone();
		if ( source.overrideMaterial !== null ) this.overrideMaterial = source.overrideMaterial.clone();

		this.autoUpdate = source.autoUpdate;
		this.matrixAutoUpdate = source.matrixAutoUpdate;

		return this;

	}

	toJSON ( meta : Object3D.MetaData ) : Scene.Data {

		let data : Scene.Data = super.toJSON(meta) as Scene.Data;

		if ( this.background !== null ) data.object.background = this.background.toJSON( meta );
		if ( this.fog !== null ) data.object.fog = this.fog.toJSON();

		return data;

	}

}

export module Scene{
	export class Data extends Object3D.Data{
		object : Obj;
	}
	export class Obj extends Object3D.Obj{
		background;
		fog;
	}
}
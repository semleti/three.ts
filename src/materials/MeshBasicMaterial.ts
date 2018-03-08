import { Material } from './Material';
import { MultiplyOperation } from '../constants';
import { Color } from '../math/Color';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>
 * }
 */

export class MeshBasicMaterial extends Material {

	type : string = 'MeshBasicMaterial';
	color : Color = new Color( 0xffffff ); // emissive
	map : number = null;
	lightMap : number = null;
	lightMapIntensity : number = 1.0;
	aoMap : number = null;
	aoMapIntensity : number = 1.0;
	specularMap : number = null;
	alphaMap : number = null;
	envMap : number = null;
	combine : number = MultiplyOperation;
	reflectivity : number = 1;
	refractionRatio : number = 0.98;
	wireframe : boolean = false;
	wireframeLinewidth : number = 1;
	wireframeLinecap : string = 'round';
	wireframeLinejoin : string = 'round';
	skinning : boolean = false;
	morphTargets : boolean = false;
	lights : boolean = false;
	isMeshBasicMaterial : boolean = true;
	constructor( parameters : any ){
		super();


		this.setValues( parameters );
	}

	copy ( source : MeshBasicMaterial ) : MeshBasicMaterial {

		super.copy(source );
	
		this.color.copy( source.color );
	
		this.map = source.map;
	
		this.lightMap = source.lightMap;
		this.lightMapIntensity = source.lightMapIntensity;
	
		this.aoMap = source.aoMap;
		this.aoMapIntensity = source.aoMapIntensity;
	
		this.specularMap = source.specularMap;
	
		this.alphaMap = source.alphaMap;
	
		this.envMap = source.envMap;
		this.combine = source.combine;
		this.reflectivity = source.reflectivity;
		this.refractionRatio = source.refractionRatio;
	
		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
		this.wireframeLinecap = source.wireframeLinecap;
		this.wireframeLinejoin = source.wireframeLinejoin;
	
		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;
	
		return this;
	
	}

}
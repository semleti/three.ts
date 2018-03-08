import { Material } from './Material';
import { Vector3 } from '../math/Vector3';

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *
 *  referencePosition: <float>,
 *  nearDistance: <float>,
 *  farDistance: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>
 *
 * }
 */

export class MeshDistanceMaterial extends Material {

	type : string = 'MeshDistanceMaterial';
	referencePosition;nearDistance;farDistance;
	isMeshDistanceMaterial : boolean = true;
	constructor( parameters : any ){
		super();
		this.referencePosition = new Vector3();
		this.nearDistance = 1;
		this.farDistance = 1000;
	
		this.skinning = false;
		this.morphTargets = false;
	
		this.map = null;
	
		this.alphaMap = null;
	
		this.displacementMap = null;
		this.displacementScale = 1;
		this.displacementBias = 0;
	
		this.fog = false;
		this.lights = false;
	
		this.setValues( parameters );
	}

	copy ( source : MeshDistanceMaterial ) : MeshDistanceMaterial {

		super.copy(source );
	
		this.referencePosition.copy( source.referencePosition );
		this.nearDistance = source.nearDistance;
		this.farDistance = source.farDistance;
	
		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;
	
		this.map = source.map;
	
		this.alphaMap = source.alphaMap;
	
		this.displacementMap = source.displacementMap;
		this.displacementScale = source.displacementScale;
		this.displacementBias = source.displacementBias;
	
		return this;
	
	}

}
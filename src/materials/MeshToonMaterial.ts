import { MeshPhongMaterial } from './MeshPhongMaterial';

/**
 * @author takahirox / http://github.com/takahirox
 *
 * parameters = {
 *  gradientMap: new THREE.Texture( <Image> )
 * }
 */

export class MeshToonMaterial extends MeshPhongMaterial {
	
	defines;
	isMeshToonMaterial : boolean = true;
	constructor( parameters : any ){
		super(parameters);
		this.defines = { 'TOON': '' };
	
		this.type = 'MeshToonMaterial';
	
		this.gradientMap = null;
	
		this.setValues( parameters );
	}

	copy ( source : MeshToonMaterial ) : MeshToonMaterial {

		super.copy(source );
	
		this.gradientMap = source.gradientMap;
	
		return this;
	
	}

}
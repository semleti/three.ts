import { LightShadow } from './LightShadow';
import { _Math } from '../math/Math';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { SpotLight } from '../Three';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class SpotLightShadow extends LightShadow {

	isSpotLightShadow : boolean = true;
	constructor(){
		super(new PerspectiveCamera( 50, 1, 0.5, 500 ));
	}

	update ( light : SpotLight ) {

		let camera = this.camera;
		let fov = _Math.RAD2DEG * 2 * light.angle;
		let aspect = this.mapSize.width / this.mapSize.height;
		let far = light.distance || camera.far;

		if ( fov !== camera.fov || aspect !== camera.aspect || far !== camera.far ) {

			camera.fov = fov;
			camera.aspect = aspect;
			camera.far = far;
			camera.updateProjectionMatrix();

		}

	}
}
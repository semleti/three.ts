import { LightShadow } from './LightShadow';
import { OrthographicCamera } from '../cameras/OrthographicCamera';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class DirectionalLightShadow extends LightShadow {

	constructor(){
		super(new OrthographicCamera( - 5, 5, 5, - 5, 0.5, 500 ));
	}

	clone() : DirectionalLightShadow {
		return new DirectionalLightShadow().copy(this);
	}

	copy (source : DirectionalLightShadow) : DirectionalLightShadow {
		super.copy(source);
		return this;
	}

}


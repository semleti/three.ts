/**
 * @author Mugen87 / https://github.com/Mugen87
 */

import { WebGLLights } from './WebGLLights';
import { Light } from '../../lights/Light';
import { Camera } from '../../cameras/Camera';
import { Scene } from '../../scenes/Scene';
import { LightShadow, Sprite } from '../../Three';

export class WebGLRenderState {

	lights = new WebGLLights();

	lightsArray : Array<Light> = [];
	shadowsArray : Array<Light> = [];
	spritesArray : Array<Sprite> = [];

	init() : void {

		this.lightsArray.length = 0;
		this.shadowsArray.length = 0;
		this.spritesArray.length = 0;

	}

	pushLight( light : Light ) : void {

		this.lightsArray.push( light );

	}

	pushShadow( shadowLight : Light ) : void {

		this.shadowsArray.push( shadowLight );

	}

	pushSprite( sprite : Sprite ) : void {

		this.spritesArray.push( sprite );

	}

	setupLights( camera : Camera ) : void {

		this.lights.setup( this.lightsArray, this.shadowsArray, camera );

	}

	state = {
		lightsArray: this.lightsArray,
		shadowsArray: this.shadowsArray,
		spritesArray: this.spritesArray,

		lights: this.lights
	};

}

export class WebGLRenderStates {

	renderStates = {};

	get( scene : Scene, camera : Camera ) : WebGLRenderState {

		let hash = scene.id + ',' + camera.id;

		let renderState = this.renderStates[ hash ];

		if ( renderState === undefined ) {

			renderState = new WebGLRenderState();
			this.renderStates[ hash ] = renderState;

		}

		return renderState;

	}

	dispose() : void {

		this.renderStates = {};

	}

}

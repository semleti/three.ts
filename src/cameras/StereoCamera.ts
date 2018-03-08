import { Matrix4 } from '../math/Matrix4';
import { _Math } from '../math/Math';
import { PerspectiveCamera } from './PerspectiveCamera';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class StereoCamera {
	type : string = 'StereoCamera';

	aspect : number = 1;

	eyeSep: number = 0.064;

	cameraR : PerspectiveCamera;
	cameraL : PerspectiveCamera;

	constructor(){
		this.cameraL = new PerspectiveCamera();
		this.cameraL.layers.enable( 1 );
		this.cameraL.matrixAutoUpdate = false;
		this.cameraR = new PerspectiveCamera();
		this.cameraR.layers.enable( 2 );
		this.cameraR.matrixAutoUpdate = false;
	}

	update () : Function {

		let instance, focus, fov, aspect, near, far, zoom, eyeSep;

		let eyeRight = new Matrix4();
		let eyeLeft = new Matrix4();

		return function update( camera : PerspectiveCamera ) : void {

			let needsUpdate = instance !== this || focus !== camera.focus || fov !== camera.fov ||
												aspect !== camera.aspect * this.aspect || near !== camera.near ||
												far !== camera.far || zoom !== camera.zoom || eyeSep !== this.eyeSep;

			if ( needsUpdate ) {

				instance = this;
				focus = camera.focus;
				fov = camera.fov;
				aspect = camera.aspect * this.aspect;
				near = camera.near;
				far = camera.far;
				zoom = camera.zoom;

				// Off-axis stereoscopic effect based on
				// http://paulbourke.net/stereographics/stereorender/

				let projectionMatrix = camera.projectionMatrix.clone();
				eyeSep = this.eyeSep / 2;
				let eyeSepOnProjection = eyeSep * near / focus;
				let ymax = ( near * Math.tan( _Math.DEG2RAD * fov * 0.5 ) ) / zoom;
				let xmin, xmax;

				// translate xOffset

				eyeLeft.elements[ 12 ] = - eyeSep;
				eyeRight.elements[ 12 ] = eyeSep;

				// for left eye

				xmin = - ymax * aspect + eyeSepOnProjection;
				xmax = ymax * aspect + eyeSepOnProjection;

				projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
				projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

				this.cameraL.projectionMatrix.copy( projectionMatrix );

				// for right eye

				xmin = - ymax * aspect - eyeSepOnProjection;
				xmax = ymax * aspect - eyeSepOnProjection;

				projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
				projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

				this.cameraR.projectionMatrix.copy( projectionMatrix );

			}

			this.cameraL.matrixWorld.copy( camera.matrixWorld ).multiply( eyeLeft );
			this.cameraR.matrixWorld.copy( camera.matrixWorld ).multiply( eyeRight );

		};

	}

}

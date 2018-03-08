/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Matrix4 } from '../../math/Matrix4';
import { Vector4 } from '../../math/Vector4';
import { ArrayCamera } from '../../cameras/ArrayCamera';
import { PerspectiveCamera } from '../../cameras/PerspectiveCamera';
import { Camera } from '../../cameras/Camera';
import { OrthographicCamera } from '../../cameras/OrthographicCamera';
import { Vector2 } from '../../Three';

export class WebVRManager {


	device : any = null;
	frameData : any = null;

	poseTarget : any = null;

	standingMatrix = new Matrix4();
	standingMatrixInverse = new Matrix4();

	matrixWorldInverse = new Matrix4();
	cameraL : PerspectiveCamera;
	cameraR : PerspectiveCamera;
	cameraVR : ArrayCamera;
	renderer : any;

	constructor( renderer : any ){
		if ( typeof window !== 'undefined' && 'VRFrameData' in window ) {

			this.frameData = new (window as any).VRFrameData();
	
		}
		this.cameraL = new PerspectiveCamera();
		this.cameraL.bounds = new Vector4( 0.0, 0.0, 0.5, 1.0 );
		this.cameraL.layers.enable( 1 );

		this.cameraR = new PerspectiveCamera();
		this.cameraR.bounds = new Vector4( 0.5, 0.0, 0.5, 1.0 );
		this.cameraR.layers.enable( 2 );

		this.cameraVR = new ArrayCamera( [ this.cameraL, this.cameraR ] );
		this.cameraVR.layers.enable( 1 );
		this.cameraVR.layers.enable( 2 );


		if ( typeof window !== 'undefined' ) {

			window.addEventListener( 'vrdisplaypresentchange', this.onVRDisplayPresentChange, false );

		}
	}

	


	

	//

	currentSize : Vector2;
	currentPixelRatio : number;

	onVRDisplayPresentChange() : void {

		if ( this.device !== null && this.device.isPresenting ) {

			let eyeParameters = this.device.getEyeParameters( 'left' );
			let renderWidth = eyeParameters.renderWidth;
			let renderHeight = eyeParameters.renderHeight;

			this.currentPixelRatio = this.renderer.getPixelRatio();
			this.currentSize = this.renderer.getSize();

			this.renderer.setDrawingBufferSize( renderWidth * 2, renderHeight, 1 );

		} else if ( this.enabled ) {

			this.renderer.setDrawingBufferSize( this.currentSize.width, this.currentSize.height, this.currentPixelRatio );

		}

	}

	//

	enabled = false;
	userHeight = 1.6;

	getDevice () : any {

		return this.device;

	};

	setDevice ( value : any ) : void {

		if ( value !== undefined ) this.device = value;

	}

	setPoseTarget ( object : any ) : void {

		if ( object !== undefined ) this.poseTarget = object;

	}

	getCamera ( camera : PerspectiveCamera ) : PerspectiveCamera {

		if ( this.device === null ) return camera;

		this.device.depthNear = camera.near;
		this.device.depthFar = camera.far;

		this.device.getFrameData( this.frameData );

		//

		let pose = this.frameData.pose;
		let poseObject = this.poseTarget !== null ? this.poseTarget : camera;

		if ( pose.position !== null ) {

			poseObject.position.fromArray( pose.position );

		} else {

			poseObject.position.set( 0, 0, 0 );

		}

		if ( pose.orientation !== null ) {

			poseObject.quaternion.fromArray( pose.orientation );

		}

		let stageParameters = this.device.stageParameters;

		if ( stageParameters ) {

			this.standingMatrix.fromArray( stageParameters.sittingToStandingTransform );

		} else {

			this.standingMatrix.makeTranslation( 0, this.userHeight, 0 );

		}

		poseObject.position.applyMatrix4( this.standingMatrix );
		poseObject.updateMatrixWorld();

		if ( this.device.isPresenting === false ) return camera;

		//

		this.cameraL.near = camera.near;
		this.cameraR.near = camera.near;

		this.cameraL.far = camera.far;
		this.cameraR.far = camera.far;

		this.cameraVR.matrixWorld.copy( camera.matrixWorld );
		this.cameraVR.matrixWorldInverse.copy( camera.matrixWorldInverse );

		this.cameraL.matrixWorldInverse.fromArray( this.frameData.leftViewMatrix );
		this.cameraR.matrixWorldInverse.fromArray( this.frameData.rightViewMatrix );

		// TODO (mrdoob) Double check this code

		this.standingMatrixInverse.getInverse( this.standingMatrix );

		this.cameraL.matrixWorldInverse.multiply( this.standingMatrixInverse );
		this.cameraR.matrixWorldInverse.multiply( this.standingMatrixInverse );

		let parent = poseObject.parent;

		if ( parent !== null ) {

			this.matrixWorldInverse.getInverse( parent.matrixWorld );

			this.cameraL.matrixWorldInverse.multiply( this.matrixWorldInverse );
			this.cameraR.matrixWorldInverse.multiply( this.matrixWorldInverse );

		}

		// envMap and Mirror needs camera.matrixWorld

		this.cameraL.matrixWorld.getInverse( this.cameraL.matrixWorldInverse );
		this.cameraR.matrixWorld.getInverse( this.cameraR.matrixWorldInverse );

		this.cameraL.projectionMatrix.fromArray( this.frameData.leftProjectionMatrix );
		this.cameraR.projectionMatrix.fromArray( this.frameData.rightProjectionMatrix );

		// HACK (mrdoob)
		// https://github.com/w3c/webvr/issues/203

		this.cameraVR.projectionMatrix.copy( this.cameraL.projectionMatrix );

		//

		let layers = this.device.getLayers();

		if ( layers.length ) {

			let layer = layers[ 0 ];

			if ( layer.leftBounds !== null && layer.leftBounds.length === 4 ) {

				this.cameraL.bounds.fromArray( layer.leftBounds );

			}

			if ( layer.rightBounds !== null && layer.rightBounds.length === 4 ) {

				this.cameraR.bounds.fromArray( layer.rightBounds );

			}

		}

		return this.cameraVR;

	}

	getStandingMatrix () : Matrix4 {

		return this.standingMatrix;

	}

	submitFrame () : void {

		if ( this.device && this.device.isPresenting ) this.device.submitFrame();

	}

	dispose () : void {

		if ( typeof window !== 'undefined' ) {

			window.removeEventListener( 'vrdisplaypresentchange', this.onVRDisplayPresentChange );

		}

	}

}

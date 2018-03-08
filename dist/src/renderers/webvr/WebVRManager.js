/**
 * @author mrdoob / http://mrdoob.com/
 */
import { Matrix4 } from '../../math/Matrix4';
import { Vector4 } from '../../math/Vector4';
import { ArrayCamera } from '../../cameras/ArrayCamera';
import { PerspectiveCamera } from '../../cameras/PerspectiveCamera';
var WebVRManager = /** @class */ (function () {
    function WebVRManager(renderer) {
        this.device = null;
        this.frameData = null;
        this.poseTarget = null;
        this.standingMatrix = new Matrix4();
        this.standingMatrixInverse = new Matrix4();
        this.matrixWorldInverse = new Matrix4();
        //
        this.enabled = false;
        this.userHeight = 1.6;
        if (typeof window !== 'undefined' && 'VRFrameData' in window) {
            this.frameData = new window.VRFrameData();
        }
        this.cameraL = new PerspectiveCamera();
        this.cameraL.bounds = new Vector4(0.0, 0.0, 0.5, 1.0);
        this.cameraL.layers.enable(1);
        this.cameraR = new PerspectiveCamera();
        this.cameraR.bounds = new Vector4(0.5, 0.0, 0.5, 1.0);
        this.cameraR.layers.enable(2);
        this.cameraVR = new ArrayCamera([this.cameraL, this.cameraR]);
        this.cameraVR.layers.enable(1);
        this.cameraVR.layers.enable(2);
        if (typeof window !== 'undefined') {
            window.addEventListener('vrdisplaypresentchange', this.onVRDisplayPresentChange, false);
        }
    }
    WebVRManager.prototype.onVRDisplayPresentChange = function () {
        if (this.device !== null && this.device.isPresenting) {
            var eyeParameters = this.device.getEyeParameters('left');
            var renderWidth = eyeParameters.renderWidth;
            var renderHeight = eyeParameters.renderHeight;
            this.currentPixelRatio = this.renderer.getPixelRatio();
            this.currentSize = this.renderer.getSize();
            this.renderer.setDrawingBufferSize(renderWidth * 2, renderHeight, 1);
        }
        else if (this.enabled) {
            this.renderer.setDrawingBufferSize(this.currentSize.width, this.currentSize.height, this.currentPixelRatio);
        }
    };
    WebVRManager.prototype.getDevice = function () {
        return this.device;
    };
    ;
    WebVRManager.prototype.setDevice = function (value) {
        if (value !== undefined)
            this.device = value;
    };
    WebVRManager.prototype.setPoseTarget = function (object) {
        if (object !== undefined)
            this.poseTarget = object;
    };
    WebVRManager.prototype.getCamera = function (camera) {
        if (this.device === null)
            return camera;
        this.device.depthNear = camera.near;
        this.device.depthFar = camera.far;
        this.device.getFrameData(this.frameData);
        //
        var pose = this.frameData.pose;
        var poseObject = this.poseTarget !== null ? this.poseTarget : camera;
        if (pose.position !== null) {
            poseObject.position.fromArray(pose.position);
        }
        else {
            poseObject.position.set(0, 0, 0);
        }
        if (pose.orientation !== null) {
            poseObject.quaternion.fromArray(pose.orientation);
        }
        var stageParameters = this.device.stageParameters;
        if (stageParameters) {
            this.standingMatrix.fromArray(stageParameters.sittingToStandingTransform);
        }
        else {
            this.standingMatrix.makeTranslation(0, this.userHeight, 0);
        }
        poseObject.position.applyMatrix4(this.standingMatrix);
        poseObject.updateMatrixWorld();
        if (this.device.isPresenting === false)
            return camera;
        //
        this.cameraL.near = camera.near;
        this.cameraR.near = camera.near;
        this.cameraL.far = camera.far;
        this.cameraR.far = camera.far;
        this.cameraVR.matrixWorld.copy(camera.matrixWorld);
        this.cameraVR.matrixWorldInverse.copy(camera.matrixWorldInverse);
        this.cameraL.matrixWorldInverse.fromArray(this.frameData.leftViewMatrix);
        this.cameraR.matrixWorldInverse.fromArray(this.frameData.rightViewMatrix);
        // TODO (mrdoob) Double check this code
        this.standingMatrixInverse.getInverse(this.standingMatrix);
        this.cameraL.matrixWorldInverse.multiply(this.standingMatrixInverse);
        this.cameraR.matrixWorldInverse.multiply(this.standingMatrixInverse);
        var parent = poseObject.parent;
        if (parent !== null) {
            this.matrixWorldInverse.getInverse(parent.matrixWorld);
            this.cameraL.matrixWorldInverse.multiply(this.matrixWorldInverse);
            this.cameraR.matrixWorldInverse.multiply(this.matrixWorldInverse);
        }
        // envMap and Mirror needs camera.matrixWorld
        this.cameraL.matrixWorld.getInverse(this.cameraL.matrixWorldInverse);
        this.cameraR.matrixWorld.getInverse(this.cameraR.matrixWorldInverse);
        this.cameraL.projectionMatrix.fromArray(this.frameData.leftProjectionMatrix);
        this.cameraR.projectionMatrix.fromArray(this.frameData.rightProjectionMatrix);
        // HACK (mrdoob)
        // https://github.com/w3c/webvr/issues/203
        this.cameraVR.projectionMatrix.copy(this.cameraL.projectionMatrix);
        //
        var layers = this.device.getLayers();
        if (layers.length) {
            var layer = layers[0];
            if (layer.leftBounds !== null && layer.leftBounds.length === 4) {
                this.cameraL.bounds.fromArray(layer.leftBounds);
            }
            if (layer.rightBounds !== null && layer.rightBounds.length === 4) {
                this.cameraR.bounds.fromArray(layer.rightBounds);
            }
        }
        return this.cameraVR;
    };
    WebVRManager.prototype.getStandingMatrix = function () {
        return this.standingMatrix;
    };
    WebVRManager.prototype.submitFrame = function () {
        if (this.device && this.device.isPresenting)
            this.device.submitFrame();
    };
    WebVRManager.prototype.dispose = function () {
        if (typeof window !== 'undefined') {
            window.removeEventListener('vrdisplaypresentchange', this.onVRDisplayPresentChange);
        }
    };
    return WebVRManager;
}());
export { WebVRManager };

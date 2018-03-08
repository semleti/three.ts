/**
 * @author tschw
 */
import { Matrix3 } from '../../math/Matrix3';
import { Plane } from '../../math/Plane';
var WebGLClipping = /** @class */ (function () {
    function WebGLClipping() {
        this.globalState = null;
        this.numGlobalPlanes = 0;
        this.localClippingEnabled = false;
        this.renderingShadows = false;
        this.plane = new Plane();
        this.viewNormalMatrix = new Matrix3();
        this.uniform = { value: null, needsUpdate: false };
        this.numPlanes = 0;
        this.numIntersection = 0;
    }
    WebGLClipping.prototype.init = function (planes, enableLocalClipping, camera) {
        var enabled = planes.length !== 0 ||
            enableLocalClipping ||
            // enable state of previous frame - the clipping code has to
            // run another frame in order to reset the state:
            this.numGlobalPlanes !== 0 ||
            this.localClippingEnabled;
        this.localClippingEnabled = enableLocalClipping;
        this.globalState = this.projectPlanes(planes, camera, 0);
        this.numGlobalPlanes = planes.length;
        return enabled;
    };
    WebGLClipping.prototype.beginShadows = function () {
        this.renderingShadows = true;
        this.projectPlanes(null);
    };
    WebGLClipping.prototype.endShadows = function () {
        this.renderingShadows = false;
        this.resetGlobalState();
    };
    WebGLClipping.prototype.setState = function (planes, clipIntersection, clipShadows, camera, cache, fromCache) {
        if (!this.localClippingEnabled || planes === null || planes.length === 0 || this.renderingShadows && !clipShadows) {
            // there's no local clipping
            if (this.renderingShadows) {
                // there's no global clipping
                this.projectPlanes(null);
            }
            else {
                this.resetGlobalState();
            }
        }
        else {
            var nGlobal = this.renderingShadows ? 0 : this.numGlobalPlanes, lGlobal = nGlobal * 4, dstArray = cache.clippingState || null;
            this.uniform.value = dstArray; // ensure unique state
            dstArray = this.projectPlanes(planes, camera, lGlobal, fromCache);
            for (var i = 0; i !== lGlobal; ++i) {
                dstArray[i] = this.globalState[i];
            }
            cache.clippingState = dstArray;
            this.numIntersection = clipIntersection ? this.numPlanes : 0;
            this.numPlanes += nGlobal;
        }
    };
    WebGLClipping.prototype.resetGlobalState = function () {
        if (this.uniform.value !== this.globalState) {
            this.uniform.value = this.globalState;
            this.uniform.needsUpdate = this.numGlobalPlanes > 0;
        }
        this.numPlanes = this.numGlobalPlanes;
        this.numIntersection = 0;
    };
    WebGLClipping.prototype.projectPlanes = function (planes, camera, dstOffset, skipTransform) {
        var nPlanes = planes !== null ? planes.length : 0, dstArray = null;
        if (nPlanes !== 0) {
            dstArray = this.uniform.value;
            if (skipTransform !== true || dstArray === null) {
                var flatSize = dstOffset + nPlanes * 4, viewMatrix = camera.matrixWorldInverse;
                this.viewNormalMatrix.getNormalMatrix(viewMatrix);
                if (dstArray === null || dstArray.length < flatSize) {
                    dstArray = new Float32Array(flatSize);
                }
                for (var i = 0, i4 = dstOffset; i !== nPlanes; ++i, i4 += 4) {
                    this.plane.copy(planes[i]).applyMatrix4(viewMatrix, this.viewNormalMatrix);
                    this.plane.normal.toArray(dstArray, i4);
                    dstArray[i4 + 3] = this.plane.constant;
                }
            }
            this.uniform.value = dstArray;
            this.uniform.needsUpdate = true;
        }
        this.numPlanes = nPlanes;
        return dstArray;
    };
    return WebGLClipping;
}());
export { WebGLClipping };

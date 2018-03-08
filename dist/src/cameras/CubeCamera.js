var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Object3D } from '../core/Object3D';
import { WebGLRenderTargetCube } from '../renderers/WebGLRenderTargetCube';
import { LinearFilter, RGBFormat } from '../constants';
import { PerspectiveCamera } from './PerspectiveCamera';
/**
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */
var CubeCamera = /** @class */ (function (_super) {
    __extends(CubeCamera, _super);
    function CubeCamera(near, far, cubeResolution) {
        var _this = _super.call(this) || this;
        _this.type = 'CubeCamera';
        _this.fov = 90;
        _this.aspect = 1;
        _this.cameraPX = new PerspectiveCamera(_this.fov, _this.aspect, near, far);
        _this.cameraPX.up.set(0, -1, 0);
        _this.cameraPX.lookAt(1, 0, 0);
        _this.add(_this.cameraPX);
        _this.cameraNX = new PerspectiveCamera(_this.fov, _this.aspect, near, far);
        _this.cameraNX.up.set(0, -1, 0);
        _this.cameraNX.lookAt(-1, 0, 0);
        _this.add(_this.cameraNX);
        _this.cameraPY = new PerspectiveCamera(_this.fov, _this.aspect, near, far);
        _this.cameraPY.up.set(0, 0, 1);
        _this.cameraPY.lookAt(0, 1, 0);
        _this.add(_this.cameraPY);
        _this.cameraNY = new PerspectiveCamera(_this.fov, _this.aspect, near, far);
        _this.cameraNY.up.set(0, 0, -1);
        _this.cameraNY.lookAt(0, -1, 0);
        _this.add(_this.cameraNY);
        _this.cameraPZ = new PerspectiveCamera(_this.fov, _this.aspect, near, far);
        _this.cameraPZ.up.set(0, -1, 0);
        _this.cameraPZ.lookAt(0, 0, 1);
        _this.add(_this.cameraPZ);
        _this.cameraNZ = new PerspectiveCamera(_this.fov, _this.aspect, near, far);
        _this.cameraNZ.up.set(0, -1, 0);
        _this.cameraNZ.lookAt(0, 0, -1);
        _this.add(_this.cameraNZ);
        var options = { format: RGBFormat, magFilter: LinearFilter, minFilter: LinearFilter };
        _this.renderTarget = new WebGLRenderTargetCube(cubeResolution, cubeResolution, options);
        _this.renderTarget.texture.name = "CubeCamera";
        return _this;
    }
    CubeCamera.prototype.update = function (renderer, scene) {
        if (this.parent === null)
            this.updateMatrixWorld();
        var renderTarget = this.renderTarget;
        var generateMipmaps = renderTarget.texture.generateMipmaps;
        renderTarget.texture.generateMipmaps = false;
        renderTarget.activeCubeFace = 0;
        renderer.render(scene, this.cameraPX, renderTarget);
        renderTarget.activeCubeFace = 1;
        renderer.render(scene, this.cameraNX, renderTarget);
        renderTarget.activeCubeFace = 2;
        renderer.render(scene, this.cameraPY, renderTarget);
        renderTarget.activeCubeFace = 3;
        renderer.render(scene, this.cameraNY, renderTarget);
        renderTarget.activeCubeFace = 4;
        renderer.render(scene, this.cameraPZ, renderTarget);
        renderTarget.texture.generateMipmaps = generateMipmaps;
        renderTarget.activeCubeFace = 5;
        renderer.render(scene, this.cameraNZ, renderTarget);
        renderer.setRenderTarget(null);
    };
    CubeCamera.prototype.clear = function (renderer, color, depth, stencil) {
        var renderTarget = this.renderTarget;
        for (var i = 0; i < 6; i++) {
            renderTarget.activeCubeFace = i;
            renderer.setRenderTarget(renderTarget);
            renderer.clear(color, depth, stencil);
        }
        renderer.setRenderTarget(null);
    };
    return CubeCamera;
}(Object3D));
export { CubeCamera };

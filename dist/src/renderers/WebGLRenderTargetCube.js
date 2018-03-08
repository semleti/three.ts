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
import { WebGLRenderTarget } from './WebGLRenderTarget';
/**
 * @author alteredq / http://alteredqualia.com
 */
var WebGLRenderTargetCube = /** @class */ (function (_super) {
    __extends(WebGLRenderTargetCube, _super);
    function WebGLRenderTargetCube(width, height, options) {
        var _this = _super.call(this, width, height, options) || this;
        _this.isWebGLRenderTargetCube = true;
        _this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
        _this.activeMipMapLevel = 0;
        return _this;
    }
    return WebGLRenderTargetCube;
}(WebGLRenderTarget));
export { WebGLRenderTargetCube };

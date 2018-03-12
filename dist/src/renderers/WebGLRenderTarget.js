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
import { EventDispatcher } from '../core/EventDispatcher';
import { Texture } from '../textures/Texture';
import { LinearFilter } from '../constants';
import { Vector4 } from '../math/Vector4';
import { _Math } from '../math/Math';
/**
 * @author szimek / https://github.com/szimek/
 * @author alteredq / http://alteredqualia.com/
 * @author Marius Kintel / https://github.com/kintel
 */
/*
 In options, we can specify:
 * Texture parameters for an auto-generated target texture
 * depthBuffer/stencilBuffer: Booleans to indicate if we should generate these buffers
*/
var WebGLRenderTarget = /** @class */ (function (_super) {
    __extends(WebGLRenderTarget, _super);
    function WebGLRenderTarget(width, height, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.uuid = _Math.generateUUID();
        _this.isWebGLRenderTarget = true;
        _this.width = width;
        _this.height = height;
        _this.scissor = new Vector4(0, 0, width, height);
        _this.scissorTest = false;
        _this.viewport = new Vector4(0, 0, width, height);
        if (options.minFilter === undefined)
            options.minFilter = LinearFilter;
        _this.texture = new Texture(undefined, undefined, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy, options.encoding);
        _this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
        _this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;
        _this.depthTexture = options.depthTexture !== undefined ? options.depthTexture : null;
        return _this;
    }
    WebGLRenderTarget.prototype.setSize = function (width, height) {
        if (this.width !== width || this.height !== height) {
            this.width = width;
            this.height = height;
            this.dispose();
        }
        this.viewport.set(0, 0, width, height);
        this.scissor.set(0, 0, width, height);
    };
    WebGLRenderTarget.prototype.clone = function () {
        return new WebGLRenderTarget().copy(this);
    };
    WebGLRenderTarget.prototype.copy = function (source) {
        this.width = source.width;
        this.height = source.height;
        this.viewport.copy(source.viewport);
        this.texture = source.texture.clone();
        this.depthBuffer = source.depthBuffer;
        this.stencilBuffer = source.stencilBuffer;
        this.depthTexture = source.depthTexture;
        return this;
    };
    WebGLRenderTarget.prototype.dispose = function () {
        this.dispatchEvent({ type: 'dispose' });
    };
    return WebGLRenderTarget;
}(EventDispatcher));
export { WebGLRenderTarget };

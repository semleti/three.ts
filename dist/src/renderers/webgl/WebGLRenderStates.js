/**
 * @author Mugen87 / https://github.com/Mugen87
 */
import { WebGLLights } from './WebGLLights';
var WebGLRenderState = /** @class */ (function () {
    function WebGLRenderState() {
        this.lights = new WebGLLights();
        this.lightsArray = [];
        this.shadowsArray = [];
        this.spritesArray = [];
        this.state = {
            lightsArray: this.lightsArray,
            shadowsArray: this.shadowsArray,
            spritesArray: this.spritesArray,
            lights: this.lights
        };
    }
    WebGLRenderState.prototype.init = function () {
        this.lightsArray.length = 0;
        this.shadowsArray.length = 0;
        this.spritesArray.length = 0;
    };
    WebGLRenderState.prototype.pushLight = function (light) {
        this.lightsArray.push(light);
    };
    WebGLRenderState.prototype.pushShadow = function (shadowLight) {
        this.shadowsArray.push(shadowLight);
    };
    WebGLRenderState.prototype.pushSprite = function (sprite) {
        this.spritesArray.push(sprite);
    };
    WebGLRenderState.prototype.setupLights = function (camera) {
        this.lights.setup(this.lightsArray, this.shadowsArray, camera);
    };
    return WebGLRenderState;
}());
export { WebGLRenderState };
var WebGLRenderStates = /** @class */ (function () {
    function WebGLRenderStates() {
        this.renderStates = {};
    }
    WebGLRenderStates.prototype.get = function (scene, camera) {
        var hash = scene.id + ',' + camera.id;
        var renderState = this.renderStates[hash];
        if (renderState === undefined) {
            renderState = new WebGLRenderState();
            this.renderStates[hash] = renderState;
        }
        return renderState;
    };
    WebGLRenderStates.prototype.dispose = function () {
        this.renderStates = {};
    };
    return WebGLRenderStates;
}());
export { WebGLRenderStates };

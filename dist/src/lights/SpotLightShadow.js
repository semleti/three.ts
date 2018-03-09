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
import { LightShadow } from './LightShadow';
import { _Math } from '../math/Math';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
/**
 * @author mrdoob / http://mrdoob.com/
 */
var SpotLightShadow = /** @class */ (function (_super) {
    __extends(SpotLightShadow, _super);
    function SpotLightShadow() {
        var _this = _super.call(this, new PerspectiveCamera(50, 1, 0.5, 500)) || this;
        _this.isSpotLightShadow = true;
        return _this;
    }
    SpotLightShadow.prototype.update = function (light) {
        var camera = this.camera;
        var fov = _Math.RAD2DEG * 2 * light.angle;
        var aspect = this.mapSize.width / this.mapSize.height;
        var far = light.distance || camera.far;
        if (fov !== camera.fov || aspect !== camera.aspect || far !== camera.far) {
            camera.fov = fov;
            camera.aspect = aspect;
            camera.far = far;
            camera.updateProjectionMatrix();
        }
    };
    SpotLightShadow.prototype.clone = function () {
        return new SpotLightShadow().copy(this);
    };
    SpotLightShadow.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    return SpotLightShadow;
}(LightShadow));
export { SpotLightShadow };

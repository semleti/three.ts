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
import { Light } from './Light';
import { SpotLightShadow } from './SpotLightShadow';
import { Object3D } from '../core/Object3D';
/**
 * @author alteredq / http://alteredqualia.com/
 */
var SpotLight = /** @class */ (function (_super) {
    __extends(SpotLight, _super);
    function SpotLight(color, intensity, distance, angle, penumbra, decay) {
        if (distance === void 0) { distance = 0; }
        if (angle === void 0) { angle = Math.PI / 3; }
        if (penumbra === void 0) { penumbra = 0; }
        if (decay === void 0) { decay = 1; }
        var _this = _super.call(this, color, intensity) || this;
        _this.type = 'SpotLight';
        _this.isSpotLight = true;
        _this.position.copy(Object3D.DefaultUp);
        _this.updateMatrix();
        _this.target = new Object3D();
        _this.distance = distance;
        _this.angle = angle;
        _this.penumbra = penumbra;
        _this.decay = decay; // for physically correct lights, should be 2.
        _this.shadow = new SpotLightShadow();
        return _this;
    }
    Object.defineProperty(SpotLight.prototype, "power", {
        get: function () {
            // intensity = power per solid angle.
            // ref: equation (17) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
            return this.intensity * Math.PI;
        },
        set: function (power) {
            // intensity = power per solid angle.
            // ref: equation (17) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
            this.intensity = power / Math.PI;
        },
        enumerable: true,
        configurable: true
    });
    SpotLight.prototype.clone = function () {
        return new SpotLight(this.color, this.intensity, this.distance, this.angle, this.penumbra, this.decay).copy(this);
    };
    SpotLight.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.distance = source.distance;
        this.angle = source.angle;
        this.penumbra = source.penumbra;
        this.decay = source.decay;
        this.target = source.target.clone();
        this.shadow = source.shadow.clone();
        return this;
    };
    return SpotLight;
}(Light));
export { SpotLight };

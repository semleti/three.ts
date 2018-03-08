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
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { LightShadow } from './LightShadow';
/**
 * @author mrdoob / http://mrdoob.com/
 */
var PointLight = /** @class */ (function (_super) {
    __extends(PointLight, _super);
    function PointLight(color, intensity, distance, decay) {
        var _this = _super.call(this, color, intensity) || this;
        _this.type = 'PointLight';
        _this.isPointLight = true;
        _this.distance = (distance !== undefined) ? distance : 0;
        _this.decay = (decay !== undefined) ? decay : 1; // for physically correct lights, should be 2.
        _this.shadow = new LightShadow(new PerspectiveCamera(90, 1, 0.5, 500));
        return _this;
    }
    Object.defineProperty(PointLight.prototype, "power", {
        get: function () {
            // intensity = power per solid angle.
            // ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
            return this.intensity * 4 * Math.PI;
        },
        set: function (power) {
            // intensity = power per solid angle.
            // ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
            this.intensity = power / (4 * Math.PI);
        },
        enumerable: true,
        configurable: true
    });
    PointLight.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.distance = source.distance;
        this.decay = source.decay;
        this.shadow = source.shadow.clone();
        return this;
    };
    return PointLight;
}(Light));
export { PointLight };

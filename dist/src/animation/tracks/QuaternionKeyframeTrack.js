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
import { KeyframeTrack } from '../KeyframeTrack';
import { QuaternionLinearInterpolant } from '../../math/interpolants/QuaternionLinearInterpolant';
/**
 *
 * A Track of quaternion keyframe values.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */
var QuaternionKeyframeTrack = /** @class */ (function (_super) {
    __extends(QuaternionKeyframeTrack, _super);
    // ValueBufferType is inherited
    //DefaultInterpolation: InterpolateLinear;
    function QuaternionKeyframeTrack(name, times, values, interpolation) {
        var _this = _super.call(this, name, times, values, interpolation) || this;
        _this.valueTypeName = 'quaternion';
        return _this;
    }
    QuaternionKeyframeTrack.prototype.InterpolantFactoryMethodLinear = function (result) {
        return new QuaternionLinearInterpolant(this.times, this.values, this.getValueSize(), result);
    };
    return QuaternionKeyframeTrack;
}(KeyframeTrack));
export { QuaternionKeyframeTrack };

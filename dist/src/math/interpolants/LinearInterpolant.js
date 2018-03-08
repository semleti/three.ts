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
import { Interpolant } from '../Interpolant';
/**
 * @author tschw
 */
var LinearInterpolant = /** @class */ (function (_super) {
    __extends(LinearInterpolant, _super);
    function LinearInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
        return _super.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer) || this;
    }
    LinearInterpolant.prototype.interpolate_ = function (i1, t0, t, t1) {
        var result = this.resultBuffer, values = this.sampleValues, stride = this.valueSize, offset1 = i1 * stride, offset0 = offset1 - stride, weight1 = (t - t0) / (t1 - t0), weight0 = 1 - weight1;
        for (var i = 0; i !== stride; ++i) {
            result[i] =
                values[offset0 + i] * weight0 +
                    values[offset1 + i] * weight1;
        }
        return result;
    };
    return LinearInterpolant;
}(Interpolant));
export { LinearInterpolant };

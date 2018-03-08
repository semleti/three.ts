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
import { Quaternion } from '../Quaternion';
/**
 * Spherical linear unit quaternion interpolant.
 *
 * @author tschw
 */
var QuaternionLinearInterpolant = /** @class */ (function (_super) {
    __extends(QuaternionLinearInterpolant, _super);
    function QuaternionLinearInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
        return _super.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer) || this;
    }
    QuaternionLinearInterpolant.prototype.interpolate_ = function (i1, t0, t, t1) {
        var result = this.resultBuffer, values = this.sampleValues, stride = this.valueSize, offset = i1 * stride, alpha = (t - t0) / (t1 - t0);
        for (var end = offset + stride; offset !== end; offset += 4) {
            Quaternion.slerpFlat(result, 0, values, offset - stride, values, offset, alpha);
        }
        return result;
    };
    return QuaternionLinearInterpolant;
}(Interpolant));
export { QuaternionLinearInterpolant };

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
 *
 * Interpolant that evaluates to the sample value at the position preceeding
 * the parameter.
 *
 * @author tschw
 */
var DiscreteInterpolant = /** @class */ (function (_super) {
    __extends(DiscreteInterpolant, _super);
    function DiscreteInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
        return _super.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer) || this;
    }
    DiscreteInterpolant.prototype.interpolate_ = function (i1 /*, t0, t, t1 */) {
        return this.copySampleValue_(i1 - 1);
    };
    return DiscreteInterpolant;
}(Interpolant));
export { DiscreteInterpolant };

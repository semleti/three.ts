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
import { InterpolateDiscrete } from '../../constants';
import { KeyframeTrack } from '../KeyframeTrack';
/**
 *
 * A Track of Boolean keyframe values.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */
var BooleanKeyframeTrack = /** @class */ (function (_super) {
    __extends(BooleanKeyframeTrack, _super);
    function BooleanKeyframeTrack(name, times, values) {
        var _this = _super.call(this, name, times, values, null) || this;
        _this.ValueTypeName = 'bool';
        _this.DefaultInterpolation = InterpolateDiscrete;
        return _this;
    }
    return BooleanKeyframeTrack;
}(KeyframeTrack));
export { BooleanKeyframeTrack };

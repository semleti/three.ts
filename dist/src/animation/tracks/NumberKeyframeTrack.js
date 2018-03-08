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
/**
 *
 * A Track of numeric keyframe values.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */
var NumberKeyframeTrack = /** @class */ (function (_super) {
    __extends(NumberKeyframeTrack, _super);
    function NumberKeyframeTrack(name, times, values, interpolation) {
        var _this = _super.call(this, name, times, values, interpolation) || this;
        _this.ValueTypeName = 'number';
        return _this;
    }
    return NumberKeyframeTrack;
}(KeyframeTrack));
export { NumberKeyframeTrack };

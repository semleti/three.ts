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
 * A Track that interpolates Strings
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */
var StringKeyframeTrack = /** @class */ (function (_super) {
    __extends(StringKeyframeTrack, _super);
    function StringKeyframeTrack(name, times, values, interpolation) {
        var _this = _super.call(this, name, times, values, interpolation) || this;
        _this.ValueTypeName = 'string';
        // FIXME:
        //ValueBufferType = new Array();
        //InterpolantFactoryMethodSmooth = undefined;
        _this.DefaultInterpolation = InterpolateDiscrete;
        return _this;
    }
    return StringKeyframeTrack;
}(KeyframeTrack));
export { StringKeyframeTrack };

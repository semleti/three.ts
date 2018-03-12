/**
 * @author Matt DesLauriers / @mattdesl
 * @author atix / arthursilber.de
 */
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
import { Texture } from './Texture';
import { NearestFilter, UnsignedShortType, UnsignedInt248Type, DepthFormat, DepthStencilFormat } from '../constants';
var DepthTexture = /** @class */ (function (_super) {
    __extends(DepthTexture, _super);
    function DepthTexture(width, height, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, format) {
        if (magFilter === void 0) { magFilter = NearestFilter; }
        if (minFilter === void 0) { minFilter = NearestFilter; }
        if (format === void 0) { format = DepthFormat; }
        var _this = _super.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, DepthTexture.fixType(type, format), anisotropy) || this;
        _this.isDepthTexture = true;
        if (format !== DepthFormat && format !== DepthStencilFormat) {
            throw new Error('DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat');
        }
        _this.image = { width: width, height: height };
        _this.flipY = false;
        _this.generateMipmaps = false;
        return _this;
    }
    DepthTexture.fixType = function (type, format) {
        if (type === undefined && format === DepthFormat)
            return UnsignedShortType;
        if (type === undefined && format === DepthStencilFormat)
            return UnsignedInt248Type;
        return type;
    };
    return DepthTexture;
}(Texture));
export { DepthTexture };

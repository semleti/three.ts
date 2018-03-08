/**
 * @author alteredq / http://alteredqualia.com/
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
var CompressedTexture = /** @class */ (function (_super) {
    __extends(CompressedTexture, _super);
    function CompressedTexture(mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding) {
        var _this = _super.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) || this;
        _this.isCompressedTexture = true;
        _this.image = { width: width, height: height };
        _this.mipmaps = mipmaps;
        // no flipping for cube textures
        // (also flipping doesn't work for compressed textures )
        _this.flipY = false;
        // can't generate mipmaps for compressed textures
        // mips must be embedded in DDS files
        _this.generateMipmaps = false;
        return _this;
    }
    return CompressedTexture;
}(Texture));
export { CompressedTexture };

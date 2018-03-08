/**
 * @author mrdoob / http://mrdoob.com/
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
var VideoTexture = /** @class */ (function (_super) {
    __extends(VideoTexture, _super);
    function VideoTexture(video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
        var _this = _super.call(this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) || this;
        _this.generateMipmaps = false;
        _this.isVideoTexture = true;
        return _this;
    }
    VideoTexture.prototype.update = function () {
        var video = this.image;
        if (video.readyState >= video.HAVE_CURRENT_DATA) {
            this.needsUpdate = true;
        }
    };
    return VideoTexture;
}(Texture));
export { VideoTexture };

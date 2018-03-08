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
var CanvasTexture = /** @class */ (function (_super) {
    __extends(CanvasTexture, _super);
    function CanvasTexture(canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
        var _this = _super.call(this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) || this;
        _this.needsUpdate = true;
        return _this;
    }
    return CanvasTexture;
}(Texture));
export { CanvasTexture };

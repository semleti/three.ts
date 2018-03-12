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
import { CubeReflectionMapping } from '../constants';
var CubeTexture = /** @class */ (function (_super) {
    __extends(CubeTexture, _super);
    function CubeTexture(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {
        if (images === void 0) { images = []; }
        if (mapping === void 0) { mapping = CubeReflectionMapping; }
        var _this = _super.call(this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) || this;
        _this.isCubeTexture = true;
        _this.images = images;
        _this.mapping = mapping;
        _this.flipY = false;
        return _this;
    }
    CubeTexture.prototype.get = function () {
        return this.image;
    };
    CubeTexture.prototype.set = function (value) {
        this.image = value;
    };
    return CubeTexture;
}(Texture));
export { CubeTexture };

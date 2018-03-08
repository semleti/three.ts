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
import { NearestFilter } from '../constants';
var DataTexture = /** @class */ (function (_super) {
    __extends(DataTexture, _super);
    function DataTexture(data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding) {
        var _this = _super.call(this, null, mapping, wrapS, wrapT, magFilter !== undefined ? magFilter : NearestFilter, minFilter !== undefined ? minFilter : NearestFilter, format, type, anisotropy, encoding) || this;
        _this.isDataTexture = true;
        _this.image = { data: data, width: width, height: height };
        _this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
        _this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;
        _this.generateMipmaps = false;
        _this.flipY = false;
        _this.unpackAlignment = 1;
        return _this;
    }
    return DataTexture;
}(Texture));
export { DataTexture };

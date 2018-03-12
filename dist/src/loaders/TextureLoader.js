/**
 * @author mrdoob / http://mrdoob.com/
 */
import { RGBAFormat, RGBFormat } from '../constants';
import { ImageLoader } from './ImageLoader';
import { Texture } from '../textures/Texture';
import { DefaultLoadingManager } from './LoadingManager';
var TextureLoader = /** @class */ (function () {
    function TextureLoader(manager) {
        if (manager === void 0) { manager = DefaultLoadingManager; }
        this.crossOrigin = 'Anonymous';
        this.manager = manager;
    }
    TextureLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        var texture = new Texture();
        var loader = new ImageLoader(this.manager);
        loader.setCrossOrigin(this.crossOrigin);
        loader.setPath(this.path);
        loader.load(url, function (image) {
            texture.image = image;
            // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
            var isJPEG = url.search(/\.(jpg|jpeg)$/) > 0 || url.search(/^data\:image\/jpeg/) === 0;
            texture.format = isJPEG ? RGBFormat : RGBAFormat;
            texture.needsUpdate = true;
            if (onLoad !== undefined) {
                onLoad(texture);
            }
        }, onProgress, onError);
        return texture;
    };
    TextureLoader.prototype.setCrossOrigin = function (value) {
        this.crossOrigin = value;
        return this;
    };
    TextureLoader.prototype.setPath = function (value) {
        this.path = value;
        return this;
    };
    return TextureLoader;
}());
export { TextureLoader };

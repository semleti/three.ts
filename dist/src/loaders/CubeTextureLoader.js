/**
 * @author mrdoob / http://mrdoob.com/
 */
import { ImageLoader } from './ImageLoader';
import { CubeTexture } from '../textures/CubeTexture';
import { DefaultLoadingManager } from './LoadingManager';
var CubeTextureLoader = /** @class */ (function () {
    function CubeTextureLoader(manager) {
        this.crossOrigin = 'Anonymous';
        this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
    }
    CubeTextureLoader.prototype.load = function (urls, onLoad, onProgress, onError) {
        var texture = new CubeTexture();
        var loader = new ImageLoader(this.manager);
        loader.setCrossOrigin(this.crossOrigin);
        loader.setPath(this.path);
        var loaded = 0;
        function loadTexture(i) {
            loader.load(urls[i], function (image) {
                texture.images[i] = image;
                loaded++;
                if (loaded === 6) {
                    texture.needsUpdate = true;
                    if (onLoad)
                        onLoad(texture);
                }
            }, undefined, onError);
        }
        for (var i = 0; i < urls.length; ++i) {
            loadTexture(i);
        }
        return texture;
    };
    CubeTextureLoader.prototype.setCrossOrigin = function (value) {
        this.crossOrigin = value;
        return this;
    };
    CubeTextureLoader.prototype.setPath = function (value) {
        this.path = value;
        return this;
    };
    return CubeTextureLoader;
}());
export { CubeTextureLoader };

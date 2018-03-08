import { Font } from '../extras/core/Font';
import { FileLoader } from './FileLoader';
import { DefaultLoadingManager } from './LoadingManager';
/**
 * @author mrdoob / http://mrdoob.com/
 */
var FontLoader = /** @class */ (function () {
    function FontLoader(manager) {
        this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
    }
    FontLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        var scope = this;
        var loader = new FileLoader(this.manager);
        loader.setPath(this.path);
        loader.load(url, function (text) {
            var json;
            try {
                json = JSON.parse(text);
            }
            catch (e) {
                console.warn('THREE.FontLoader: typeface support is being deprecated. Use typefaceon instead.');
                json = JSON.parse(text.substring(65, text.length - 2));
            }
            var font = scope.parse(json);
            if (onLoad)
                onLoad(font);
        }, onProgress, onError);
    };
    FontLoader.prototype.parse = function (json) {
        return new Font(json);
    };
    FontLoader.prototype.setPath = function (value) {
        this.path = value;
        return this;
    };
    return FontLoader;
}());
export { FontLoader };

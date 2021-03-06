/**
 * @author thespite / http://clicktorelease.com/
 */
import { Cache } from './Cache';
import { DefaultLoadingManager } from './LoadingManager';
var ImageBitmapLoader = /** @class */ (function () {
    function ImageBitmapLoader(manager) {
        if (manager === void 0) { manager = DefaultLoadingManager; }
        if (typeof createImageBitmap === 'undefined') {
            console.warn('THREE.ImageBitmapLoader: createImageBitmap() not supported.');
        }
        if (typeof fetch === 'undefined') {
            console.warn('THREE.ImageBitmapLoader: fetch() not supported.');
        }
        this.manager = manager;
        this.options = undefined;
    }
    ImageBitmapLoader.prototype.setOptions = function (options) {
        this.options = options;
        return this;
    };
    ImageBitmapLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        if (url === undefined)
            url = '';
        if (this.path !== undefined)
            url = this.path + url;
        var scope = this;
        var cached = Cache.get(url);
        if (cached !== undefined) {
            scope.manager.itemStart(url);
            setTimeout(function () {
                if (onLoad)
                    onLoad(cached);
                scope.manager.itemEnd(url);
            }, 0);
            return cached;
        }
        fetch(url).then(function (res) {
            return res.blob();
        }).then(function (blob) {
            return createImageBitmap(blob, scope.options);
        }).then(function (imageBitmap) {
            Cache.add(url, imageBitmap);
            if (onLoad)
                onLoad(imageBitmap);
            scope.manager.itemEnd(url);
        }).catch(function (e) {
            if (onError)
                onError(e);
            scope.manager.itemEnd(url);
            scope.manager.itemError(url);
        });
    };
    ImageBitmapLoader.prototype.setCrossOrigin = function () {
        //TODO: ?
        return this;
    };
    ImageBitmapLoader.prototype.setPath = function (value) {
        this.path = value;
        return this;
    };
    return ImageBitmapLoader;
}());
export { ImageBitmapLoader };

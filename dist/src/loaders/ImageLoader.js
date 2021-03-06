/**
 * @author mrdoob / http://mrdoob.com/
 */
import { Cache } from './Cache';
import { DefaultLoadingManager } from './LoadingManager';
var ImageLoader = /** @class */ (function () {
    function ImageLoader(manager) {
        if (manager === void 0) { manager = DefaultLoadingManager; }
        this.crossOrigin = 'Anonymous';
        this.manager = manager;
    }
    ImageLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        if (url === undefined)
            url = '';
        if (this.path !== undefined)
            url = this.path + url;
        url = this.manager.resolveURL(url);
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
        var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');
        image.addEventListener('load', function () {
            Cache.add(url, this);
            if (onLoad)
                onLoad(this);
            scope.manager.itemEnd(url);
        }, false);
        /*
        image.addEventListener( 'progress', function ( event ) {

            if ( onProgress ) onProgress( event );

        }, false );
        */
        image.addEventListener('error', function (event) {
            if (onError)
                onError(event);
            scope.manager.itemEnd(url);
            scope.manager.itemError(url);
        }, false);
        if (url.substr(0, 5) !== 'data:') {
            if (this.crossOrigin !== undefined)
                image.crossOrigin = this.crossOrigin;
        }
        scope.manager.itemStart(url);
        image.src = url;
        return image;
    };
    ImageLoader.prototype.setCrossOrigin = function (value) {
        this.crossOrigin = value;
        return this;
    };
    ImageLoader.prototype.setPath = function (value) {
        this.path = value;
        return this;
    };
    return ImageLoader;
}());
export { ImageLoader };

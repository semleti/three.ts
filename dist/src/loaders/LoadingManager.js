/**
 * @author mrdoob / http://mrdoob.com/
 */
var LoadingManager = /** @class */ (function () {
    function LoadingManager(onLoad, onProgress, onError) {
        this.isLoading = false;
        this.itemsLoaded = 0;
        this.itemsTotal = 0;
        this.urlModifier = undefined;
        this.onStart = function () { };
        this.onLoad = function () { };
        this.onProgress = function () { };
        this.onError = function () { };
        this.onStart = undefined;
        this.onLoad = onLoad;
        this.onProgress = onProgress;
        this.onError = onError;
    }
    LoadingManager.prototype.itemStart = function (url) {
        this.itemsTotal++;
        if (this.isLoading === false) {
            if (this.onStart !== undefined) {
                this.onStart(url, this.itemsLoaded, this.itemsTotal);
            }
        }
        this.isLoading = true;
    };
    LoadingManager.prototype.itemEnd = function (url) {
        this.itemsLoaded++;
        if (this.onProgress !== undefined) {
            this.onProgress(url, this.itemsLoaded, this.itemsTotal);
        }
        if (this.itemsLoaded === this.itemsTotal) {
            this.isLoading = false;
            if (this.onLoad !== undefined) {
                this.onLoad();
            }
        }
    };
    LoadingManager.prototype.itemError = function (url) {
        if (this.onError !== undefined) {
            this.onError(url);
        }
    };
    LoadingManager.prototype.resolveURL = function (url) {
        if (this.urlModifier) {
            return this.urlModifier(url);
        }
        return url;
    };
    LoadingManager.prototype.setURLModifier = function (transform) {
        this.urlModifier = transform;
        return this;
    };
    return LoadingManager;
}());
export { LoadingManager };
var DefaultLoadingManager = new LoadingManager();
export { DefaultLoadingManager };

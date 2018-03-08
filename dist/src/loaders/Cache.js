/**
 * @author mrdoob / http://mrdoob.com/
 */
var Cache = /** @class */ (function () {
    function Cache() {
    }
    Cache.add = function (key, file) {
        if (this.enabled === false)
            return;
        // console.log( 'THREE.Cache', 'Adding key:', key );
        this.files[key] = file;
    };
    Cache.get = function (key) {
        if (Cache.enabled === false)
            return;
        // console.log( 'THREE.Cache', 'Checking key:', key );
        return this.files[key];
    };
    Cache.remove = function (key) {
        delete this.files[key];
    };
    Cache.clear = function () {
        this.files = {};
    };
    Cache.enabled = false;
    return Cache;
}());
export { Cache };

var LoaderUtils = /** @class */ (function () {
    function LoaderUtils() {
    }
    LoaderUtils.decodeText = function (array) {
        if (typeof TextDecoder !== 'undefined') {
            return new TextDecoder().decode(array);
        }
        // Avoid the String.fromCharCode.apply(null, array) shortcut, which
        // throws a "maximum call stack size exceeded" error for large arrays.
        var s = '';
        for (var i = 0, il = array.length; i < il; i++) {
            // Implicitly assumes little-endian.
            s += String.fromCharCode(array[i]);
        }
        // Merges multi-byte utf-8 characters.
        return decodeURIComponent(escape(s));
    };
    LoaderUtils.extractUrlBase = function (url) {
        var parts = url.split('/');
        if (parts.length === 1)
            return './';
        parts.pop();
        return parts.join('/') + '/';
    };
    return LoaderUtils;
}());
export { LoaderUtils };

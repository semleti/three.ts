/**
 * @author fordacious / fordacious.github.io
 */
var WebGLProperties = /** @class */ (function () {
    function WebGLProperties() {
        this.properties = {};
    }
    WebGLProperties.prototype.get = function (object) {
        var uuid = object.uuid;
        var map = this.properties[uuid];
        if (map === undefined) {
            map = {};
            this.properties[uuid] = map;
        }
        return map;
    };
    WebGLProperties.prototype.remove = function (object) {
        delete this.properties[object.uuid];
    };
    WebGLProperties.prototype.update = function (object, key, value) {
        var uuid = object.uuid;
        var map = this.properties[uuid];
        map[key] = value;
    };
    WebGLProperties.prototype.dispose = function () {
        this.properties = {};
    };
    return WebGLProperties;
}());
export { WebGLProperties };

/**
 * @author mrdoob / http://mrdoob.com/
 */
var WebGLObjects = /** @class */ (function () {
    function WebGLObjects(geometries, infoRender) {
        this.updateList = {};
        this.geometries = geometries;
        this.infoRender = infoRender;
    }
    WebGLObjects.prototype.update = function (object) {
        var frame = this.infoRender.frame;
        var geometry = object.geometry;
        var buffergeometry = this.geometries.get(object, geometry);
        // Update once per frame
        if (this.updateList[buffergeometry.id] !== frame) {
            if (geometry.isGeometry) {
                buffergeometry.updateFromObject(object);
            }
            this.geometries.update(buffergeometry);
            this.updateList[buffergeometry.id] = frame;
        }
        return buffergeometry;
    };
    WebGLObjects.prototype.dispose = function () {
        this.updateList = {};
    };
    return WebGLObjects;
}());
export { WebGLObjects };

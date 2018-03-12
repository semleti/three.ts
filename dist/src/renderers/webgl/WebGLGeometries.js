/**
 * @author mrdoob / http://mrdoob.com/
 */
import { Uint16BufferAttribute, Uint32BufferAttribute } from '../../core/BufferAttribute';
import { BufferGeometry } from '../../core/BufferGeometry';
import { arrayMax } from '../../utils';
var WebGLGeometries = /** @class */ (function () {
    function WebGLGeometries(gl, attributes, infoMemory) {
        this.geometries = {};
        this.wireframeAttributes = {};
        this.onGeometryDispose = function (scope) {
            return function (event) {
                var geometry = event.target;
                var buffergeometry = scope.geometries[geometry.id];
                if (buffergeometry.index !== null) {
                    scope.attributes.remove(buffergeometry.index);
                }
                for (var name_1 in buffergeometry.attributes) {
                    scope.attributes.remove(buffergeometry.attributes[name_1]);
                }
                geometry.removeEventListener('dispose', scope.onGeometryDispose);
                delete scope.geometries[geometry.id];
                // TODO Remove duplicate code
                var attribute = scope.wireframeAttributes[geometry.id];
                if (attribute) {
                    scope.attributes.remove(attribute);
                    delete scope.wireframeAttributes[geometry.id];
                }
                attribute = scope.wireframeAttributes[buffergeometry.id];
                if (attribute) {
                    scope.attributes.remove(attribute);
                    delete scope.wireframeAttributes[buffergeometry.id];
                }
                //
                scope.infoMemory.geometries--;
            };
        }(this);
        this.gl = gl;
        this.attributes = attributes;
        this.infoMemory = infoMemory;
    }
    WebGLGeometries.prototype.get = function (object, geometry) {
        var buffergeometry = this.geometries[geometry.id];
        if (buffergeometry)
            return buffergeometry;
        geometry.addEventListener('dispose', this.onGeometryDispose);
        if (geometry.isBufferGeometry) {
            buffergeometry = geometry;
        }
        else if (geometry.isGeometry) {
            if (geometry._bufferGeometry === undefined) {
                geometry._bufferGeometry = new BufferGeometry().setFromObject(object);
            }
            buffergeometry = geometry._bufferGeometry;
        }
        this.geometries[geometry.id] = buffergeometry;
        this.infoMemory.geometries++;
        return buffergeometry;
    };
    WebGLGeometries.prototype.update = function (geometry) {
        var index = geometry.index;
        var geometryAttributes = geometry.attributes;
        if (index !== null) {
            this.attributes.update(index, this.gl.ELEMENT_ARRAY_BUFFER);
        }
        for (var name_2 in geometryAttributes) {
            this.attributes.update(geometryAttributes[name_2], this.gl.ARRAY_BUFFER);
        }
        // morph targets
        var morphAttributes = geometry.morphAttributes;
        for (var name_3 in morphAttributes) {
            var array = morphAttributes[name_3];
            for (var i = 0, l = array.length; i < l; i++) {
                this.attributes.update(array[i], this.gl.ARRAY_BUFFER);
            }
        }
    };
    WebGLGeometries.prototype.getWireframeAttribute = function (geometry) {
        var attribute = this.wireframeAttributes[geometry.id];
        if (attribute)
            return attribute;
        var indices = [];
        var geometryIndex = geometry.index;
        var geometryAttributes = geometry.attributes;
        // console.time( 'wireframe' );
        if (geometryIndex !== null) {
            var array = geometryIndex.array;
            for (var i = 0, l = array.length; i < l; i += 3) {
                var a = array[i + 0];
                var b = array[i + 1];
                var c = array[i + 2];
                indices.push(a, b, b, c, c, a);
            }
        }
        else {
            var array = geometryAttributes.position.array;
            for (var i = 0, lt = (array.length / 3) - 1; i < lt; i += 3) {
                var at = i + 0;
                var bt = i + 1;
                var ct = i + 2;
                indices.push(at, bt, bt, ct, ct, at);
            }
        }
        // console.timeEnd( 'wireframe' );
        attribute = new (arrayMax(indices) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute)(indices, 1);
        this.attributes.update(attribute, this.gl.ELEMENT_ARRAY_BUFFER);
        this.wireframeAttributes[geometry.id] = attribute;
        return attribute;
    };
    return WebGLGeometries;
}());
export { WebGLGeometries };

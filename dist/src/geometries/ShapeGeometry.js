/**
 * @author jonobr1 / http://jonobr1.com
 * @author Mugen87 / https://github.com/Mugen87
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Geometry } from '../core/Geometry';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { ShapeUtils } from '../extras/ShapeUtils';
// ShapeGeometry
var ShapeGeometry = /** @class */ (function (_super) {
    __extends(ShapeGeometry, _super);
    function ShapeGeometry(shapes, curveSegments) {
        var _this = _super.call(this) || this;
        _this.type = 'ShapeGeometry';
        if (typeof curveSegments === 'object') {
            console.warn('THREE.ShapeGeometry: Options parameter has been removed.');
            curveSegments = curveSegments.curveSegments;
        }
        _this.parameters = {
            shapes: shapes,
            curveSegments: curveSegments
        };
        _this.fromBufferGeometry(new ShapeBufferGeometry(shapes, curveSegments));
        _this.mergeVertices();
        return _this;
    }
    ShapeGeometry.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        var shapes = this.parameters.shapes;
        return toJSON(shapes, data);
    };
    return ShapeGeometry;
}(Geometry));
export { ShapeGeometry };
// ShapeBufferGeometry
var ShapeBufferGeometry = /** @class */ (function (_super) {
    __extends(ShapeBufferGeometry, _super);
    function ShapeBufferGeometry(shapes, curveSegments) {
        var _this = _super.call(this) || this;
        _this.type = 'ShapeBufferGeometry';
        // buffers
        _this.indices = [];
        _this.vertices = [];
        _this.normals = [];
        _this.uvs = [];
        // helper variables
        _this.groupStart = 0;
        _this.groupCount = 0;
        _this.parameters = {
            shapes: shapes,
            curveSegments: curveSegments
        };
        _this.curveSegments = curveSegments || 12;
        // allow single and array values for "shapes" parameter
        if (Array.isArray(shapes) === false) {
            _this.addShape(shapes);
        }
        else {
            for (var i = 0; i < shapes.length; i++) {
                _this.addShape(shapes[i]);
                _this.addGroup(_this.groupStart, _this.groupCount, i); // enables MultiMaterial support
                _this.groupStart += _this.groupCount;
                _this.groupCount = 0;
            }
        }
        // build geometry
        _this.setIndex(_this.indices);
        _this.addAttribute('position', new Float32BufferAttribute(_this.vertices, 3));
        _this.addAttribute('normal', new Float32BufferAttribute(_this.normals, 3));
        _this.addAttribute('uv', new Float32BufferAttribute(_this.uvs, 2));
        return _this;
    }
    // helper functions
    ShapeBufferGeometry.prototype.addShape = function (shape) {
        var i, l, shapeHole;
        var indexOffset = this.vertices.length / 3;
        var points = shape.extractPoints(this.curveSegments);
        var shapeVertices = points.shape;
        var shapeHoles = points.holes;
        // check direction of vertices
        if (ShapeUtils.isClockWise(shapeVertices) === false) {
            shapeVertices = shapeVertices.reverse();
            // also check if holes are in the opposite direction
            for (i = 0, l = shapeHoles.length; i < l; i++) {
                shapeHole = shapeHoles[i];
                if (ShapeUtils.isClockWise(shapeHole) === true) {
                    shapeHoles[i] = shapeHole.reverse();
                }
            }
        }
        var faces = ShapeUtils.triangulateShape(shapeVertices, shapeHoles);
        // join vertices of inner and outer paths to a single array
        for (i = 0, l = shapeHoles.length; i < l; i++) {
            shapeHole = shapeHoles[i];
            shapeVertices = shapeVertices.concat(shapeHole);
        }
        // vertices, normals, uvs
        for (i = 0, l = shapeVertices.length; i < l; i++) {
            var vertex = shapeVertices[i];
            this.vertices.push(vertex.x, vertex.y, 0);
            this.normals.push(0, 0, 1);
            this.uvs.push(vertex.x, vertex.y); // world uvs
        }
        // incides
        for (i = 0, l = faces.length; i < l; i++) {
            var face = faces[i];
            var a = face[0] + indexOffset;
            var b = face[1] + indexOffset;
            var c = face[2] + indexOffset;
            this.indices.push(a, b, c);
            this.groupCount += 3;
        }
    };
    ShapeBufferGeometry.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        var shapes = this.parameters.shapes;
        return toJSON(shapes, data);
    };
    return ShapeBufferGeometry;
}(BufferGeometry));
export { ShapeBufferGeometry };
//
function toJSON(shapes, data) {
    data.shapes = [];
    if (Array.isArray(shapes)) {
        for (var i = 0, l = shapes.length; i < l; i++) {
            var shape = shapes[i];
            data.shapes.push(shape.uuid);
        }
    }
    else {
        data.shapes.push(shapes.uuid);
    }
    return data;
}

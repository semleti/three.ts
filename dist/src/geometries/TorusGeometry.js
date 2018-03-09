/**
 * @author oosmoxiecode
 * @author mrdoob / http://mrdoob.com/
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
import { Vector3 } from '../math/Vector3';
// TorusGeometry
var TorusGeometry = /** @class */ (function (_super) {
    __extends(TorusGeometry, _super);
    function TorusGeometry(radius, tube, radialSegments, tubularSegments, arc) {
        var _this = _super.call(this) || this;
        _this.type = 'TorusGeometry';
        _this.parameters = {
            radius: radius,
            tube: tube,
            radialSegments: radialSegments,
            tubularSegments: tubularSegments,
            arc: arc
        };
        _this.fromBufferGeometry(new TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc));
        _this.mergeVertices();
        return _this;
    }
    return TorusGeometry;
}(Geometry));
export { TorusGeometry };
// TorusBufferGeometry
var TorusBufferGeometry = /** @class */ (function (_super) {
    __extends(TorusBufferGeometry, _super);
    function TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc) {
        var _this = _super.call(this) || this;
        _this.type = 'TorusBufferGeometry';
        // buffers
        _this.indices = [];
        _this.vertices = [];
        _this.normals = [];
        _this.uvs = [];
        _this.parameters = {
            radius: radius,
            tube: tube,
            radialSegments: radialSegments,
            tubularSegments: tubularSegments,
            arc: arc
        };
        radius = radius || 1;
        tube = tube || 0.4;
        radialSegments = Math.floor(radialSegments) || 8;
        tubularSegments = Math.floor(tubularSegments) || 6;
        arc = arc || Math.PI * 2;
        // helper variables
        var center = new Vector3();
        var vertex = new Vector3();
        var normal = new Vector3();
        var j, i;
        // generate vertices, normals and uvs
        for (j = 0; j <= radialSegments; j++) {
            for (i = 0; i <= tubularSegments; i++) {
                var u = i / tubularSegments * arc;
                var v = j / radialSegments * Math.PI * 2;
                // vertex
                vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
                vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u);
                vertex.z = tube * Math.sin(v);
                _this.vertices.push(vertex.x, vertex.y, vertex.z);
                // normal
                center.x = radius * Math.cos(u);
                center.y = radius * Math.sin(u);
                normal.subVectors(vertex, center).normalize();
                _this.normals.push(normal.x, normal.y, normal.z);
                // uv
                _this.uvs.push(i / tubularSegments);
                _this.uvs.push(j / radialSegments);
            }
        }
        // generate indices
        for (j = 1; j <= radialSegments; j++) {
            for (i = 1; i <= tubularSegments; i++) {
                // indices
                var a = (tubularSegments + 1) * j + i - 1;
                var b = (tubularSegments + 1) * (j - 1) + i - 1;
                var c = (tubularSegments + 1) * (j - 1) + i;
                var d = (tubularSegments + 1) * j + i;
                // faces
                _this.indices.push(a, b, d);
                _this.indices.push(b, c, d);
            }
        }
        // build geometry
        _this.setIndex(_this.indices);
        _this.addAttribute('position', new Float32BufferAttribute(_this.vertices, 3));
        _this.addAttribute('normal', new Float32BufferAttribute(_this.normals, 3));
        _this.addAttribute('uv', new Float32BufferAttribute(_this.uvs, 2));
        return _this;
    }
    TorusBufferGeometry.prototype.clone = function () {
        return new TorusBufferGeometry(this.parameters.radius, this.parameters.tube, this.parameters.radialSegments, this.parameters.tubularSegments, this.parameters.arc).copy(this);
    };
    TorusBufferGeometry.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    return TorusBufferGeometry;
}(BufferGeometry));
export { TorusBufferGeometry };

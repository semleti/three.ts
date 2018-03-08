/**
 * @author astrodud / http://astrodud.isgreat.org/
 * @author zz85 / https://github.com/zz85
 * @author bhouston / http://clara.io
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
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';
import { _Math } from '../math/Math';
// LatheGeometry
var LatheGeometry = /** @class */ (function (_super) {
    __extends(LatheGeometry, _super);
    function LatheGeometry(points, segments, phiStart, phiLength) {
        var _this = _super.call(this) || this;
        _this.type = 'LatheGeometry';
        _this.parameters = {
            points: points,
            segments: segments,
            phiStart: phiStart,
            phiLength: phiLength
        };
        _this.fromBufferGeometry(new LatheBufferGeometry(points, segments, phiStart, phiLength));
        _this.mergeVertices();
        return _this;
    }
    return LatheGeometry;
}(Geometry));
export { LatheGeometry };
// LatheBufferGeometry
var LatheBufferGeometry = /** @class */ (function (_super) {
    __extends(LatheBufferGeometry, _super);
    function LatheBufferGeometry(points, segments, phiStart, phiLength) {
        var _this = _super.call(this) || this;
        _this.type = 'LatheBufferGeometry';
        _this.parameters = {
            points: points,
            segments: segments,
            phiStart: phiStart,
            phiLength: phiLength
        };
        segments = Math.floor(segments) || 12;
        phiStart = phiStart || 0;
        phiLength = phiLength || Math.PI * 2;
        // clamp phiLength so it's in range of [ 0, 2PI ]
        phiLength = _Math.clamp(phiLength, 0, Math.PI * 2);
        // buffers
        var indices = [];
        var vertices = [];
        var uvs = [];
        // helper variables
        var base;
        var inverseSegments = 1.0 / segments;
        var vertex = new Vector3();
        var uv = new Vector2();
        var i, j;
        // generate vertices and uvs
        for (i = 0; i <= segments; i++) {
            var phi = phiStart + i * inverseSegments * phiLength;
            var sin = Math.sin(phi);
            var cos = Math.cos(phi);
            for (j = 0; j <= (points.length - 1); j++) {
                // vertex
                vertex.x = points[j].x * sin;
                vertex.y = points[j].y;
                vertex.z = points[j].x * cos;
                vertices.push(vertex.x, vertex.y, vertex.z);
                // uv
                uv.x = i / segments;
                uv.y = j / (points.length - 1);
                uvs.push(uv.x, uv.y);
            }
        }
        // indices
        for (i = 0; i < segments; i++) {
            for (j = 0; j < (points.length - 1); j++) {
                base = j + i * points.length;
                var a = base;
                var b = base + points.length;
                var c = base + points.length + 1;
                var d = base + 1;
                // faces
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }
        // build geometry
        _this.setIndex(indices);
        _this.addAttribute('position', new Float32BufferAttribute(vertices, 3));
        _this.addAttribute('uv', new Float32BufferAttribute(uvs, 2));
        // generate normals
        _this.computeVertexNormals();
        // if the geometry is closed, we need to average the normals along the seam.
        // because the corresponding vertices are identical (but still have different UVs).
        if (phiLength === Math.PI * 2) {
            var normals = _this.attributes.normal.array;
            var n1 = new Vector3();
            var n2 = new Vector3();
            var n = new Vector3();
            // this is the buffer offset for the last line of vertices
            base = segments * points.length * 3;
            for (i = 0, j = 0; i < points.length; i++, j += 3) {
                // select the normal of the vertex in the first line
                n1.x = normals[j + 0];
                n1.y = normals[j + 1];
                n1.z = normals[j + 2];
                // select the normal of the vertex in the last line
                n2.x = normals[base + j + 0];
                n2.y = normals[base + j + 1];
                n2.z = normals[base + j + 2];
                // average normals
                n.addVectors(n1, n2).normalize();
                // assign the new values to both normals
                normals[j + 0] = normals[base + j + 0] = n.x;
                normals[j + 1] = normals[base + j + 1] = n.y;
                normals[j + 2] = normals[base + j + 2] = n.z;
            }
        }
        return _this;
    }
    return LatheBufferGeometry;
}(BufferGeometry));
export { LatheBufferGeometry };

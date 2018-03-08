/**
 * @author clockworkgeek / https://github.com/clockworkgeek
 * @author timothypratley / https://github.com/timothypratley
 * @author WestLangley / http://github.com/WestLangley
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
import { Vector2 } from '../math/Vector2';
// PolyhedronGeometry
var PolyhedronGeometry = /** @class */ (function (_super) {
    __extends(PolyhedronGeometry, _super);
    function PolyhedronGeometry(vertices, indices, radius, detail) {
        var _this = _super.call(this) || this;
        _this.type = 'PolyhedronGeometry';
        _this.parameters = {
            vertices: vertices,
            indices: indices,
            radius: radius,
            detail: detail
        };
        _this.fromBufferGeometry(new PolyhedronBufferGeometry(vertices, indices, radius, detail));
        _this.mergeVertices();
        return _this;
    }
    return PolyhedronGeometry;
}(Geometry));
export { PolyhedronGeometry };
// PolyhedronBufferGeometry
var PolyhedronBufferGeometry = /** @class */ (function (_super) {
    __extends(PolyhedronBufferGeometry, _super);
    function PolyhedronBufferGeometry(vertices, indices, radius, detail) {
        var _this = _super.call(this) || this;
        _this.type = 'PolyhedronBufferGeometry';
        // default buffer data
        _this.vertexBuffer = [];
        _this.uvBuffer = [];
        _this.parameters = {
            vertices: vertices,
            indices: indices,
            radius: radius,
            detail: detail
        };
        radius = radius || 1;
        detail = detail || 0;
        // the subdivision creates the vertex buffer data
        _this.subdivide(detail);
        // all vertices should lie on a conceptual sphere with a given radius
        _this.appplyRadius(radius);
        // finally, create the uv data
        _this.generateUVs();
        // build non-indexed geometry
        _this.addAttribute('position', new Float32BufferAttribute(_this.vertexBuffer, 3));
        _this.addAttribute('normal', new Float32BufferAttribute(_this.vertexBuffer.slice(), 3));
        _this.addAttribute('uv', new Float32BufferAttribute(_this.uvBuffer, 2));
        if (detail === 0) {
            _this.computeVertexNormals(); // flat normals
        }
        else {
            _this.normalizeNormals(); // smooth normals
        }
        return _this;
    }
    // helper functions
    PolyhedronBufferGeometry.prototype.subdivide = function (detail) {
        var a = new Vector3();
        var b = new Vector3();
        var c = new Vector3();
        // iterate over all faces and apply a subdivison with the given detail value
        for (var i = 0; i < this.parameters.indices.length; i += 3) {
            // get the vertices of the face
            this.getVertexByIndex(this.parameters.indices[i + 0], a);
            this.getVertexByIndex(this.parameters.indices[i + 1], b);
            this.getVertexByIndex(this.parameters.indices[i + 2], c);
            // perform subdivision
            this.subdivideFace(a, b, c, detail);
        }
    };
    PolyhedronBufferGeometry.prototype.subdivideFace = function (a, b, c, detail) {
        var cols = Math.pow(2, detail);
        // we use this multidimensional array as a data structure for creating the subdivision
        var v = [];
        var i, j;
        // construct all of the vertices for this subdivision
        for (i = 0; i <= cols; i++) {
            v[i] = [];
            var aj = a.clone().lerp(c, i / cols);
            var bj = b.clone().lerp(c, i / cols);
            var rows = cols - i;
            for (j = 0; j <= rows; j++) {
                if (j === 0 && i === cols) {
                    v[i][j] = aj;
                }
                else {
                    v[i][j] = aj.clone().lerp(bj, j / rows);
                }
            }
        }
        // construct all of the faces
        for (i = 0; i < cols; i++) {
            for (j = 0; j < 2 * (cols - i) - 1; j++) {
                var k = Math.floor(j / 2);
                if (j % 2 === 0) {
                    this.pushVertex(v[i][k + 1]);
                    this.pushVertex(v[i + 1][k]);
                    this.pushVertex(v[i][k]);
                }
                else {
                    this.pushVertex(v[i][k + 1]);
                    this.pushVertex(v[i + 1][k + 1]);
                    this.pushVertex(v[i + 1][k]);
                }
            }
        }
    };
    PolyhedronBufferGeometry.prototype.appplyRadius = function (radius) {
        var vertex = new Vector3();
        // iterate over the entire buffer and apply the radius to each vertex
        for (var i = 0; i < this.vertexBuffer.length; i += 3) {
            vertex.x = this.vertexBuffer[i + 0];
            vertex.y = this.vertexBuffer[i + 1];
            vertex.z = this.vertexBuffer[i + 2];
            vertex.normalize().multiplyScalar(radius);
            this.vertexBuffer[i + 0] = vertex.x;
            this.vertexBuffer[i + 1] = vertex.y;
            this.vertexBuffer[i + 2] = vertex.z;
        }
    };
    PolyhedronBufferGeometry.prototype.generateUVs = function () {
        var vertex = new Vector3();
        for (var i = 0; i < this.vertexBuffer.length; i += 3) {
            vertex.x = this.vertexBuffer[i + 0];
            vertex.y = this.vertexBuffer[i + 1];
            vertex.z = this.vertexBuffer[i + 2];
            var u = this.azimuth(vertex) / 2 / Math.PI + 0.5;
            var v = this.inclination(vertex) / Math.PI + 0.5;
            this.uvBuffer.push(u, 1 - v);
        }
        this.correctUVs();
        this.correctSeam();
    };
    PolyhedronBufferGeometry.prototype.correctSeam = function () {
        // handle case when face straddles the seam, see #3269
        for (var i = 0; i < this.uvBuffer.length; i += 6) {
            // uv data of a single face
            var x0 = this.uvBuffer[i + 0];
            var x1 = this.uvBuffer[i + 2];
            var x2 = this.uvBuffer[i + 4];
            var max = Math.max(x0, x1, x2);
            var min = Math.min(x0, x1, x2);
            // 0.9 is somewhat arbitrary
            if (max > 0.9 && min < 0.1) {
                if (x0 < 0.2)
                    this.uvBuffer[i + 0] += 1;
                if (x1 < 0.2)
                    this.uvBuffer[i + 2] += 1;
                if (x2 < 0.2)
                    this.uvBuffer[i + 4] += 1;
            }
        }
    };
    PolyhedronBufferGeometry.prototype.pushVertex = function (vertex) {
        this.vertexBuffer.push(vertex.x, vertex.y, vertex.z);
    };
    PolyhedronBufferGeometry.prototype.getVertexByIndex = function (index, vertex) {
        var stride = index * 3;
        vertex.x = this.parameters.vertices[stride + 0];
        vertex.y = this.parameters.vertices[stride + 1];
        vertex.z = this.parameters.vertices[stride + 2];
    };
    PolyhedronBufferGeometry.prototype.correctUVs = function () {
        var a = new Vector3();
        var b = new Vector3();
        var c = new Vector3();
        var centroid = new Vector3();
        var uvA = new Vector2();
        var uvB = new Vector2();
        var uvC = new Vector2();
        for (var i = 0, j = 0; i < this.vertexBuffer.length; i += 9, j += 6) {
            a.set(this.vertexBuffer[i + 0], this.vertexBuffer[i + 1], this.vertexBuffer[i + 2]);
            b.set(this.vertexBuffer[i + 3], this.vertexBuffer[i + 4], this.vertexBuffer[i + 5]);
            c.set(this.vertexBuffer[i + 6], this.vertexBuffer[i + 7], this.vertexBuffer[i + 8]);
            uvA.set(this.uvBuffer[j + 0], this.uvBuffer[j + 1]);
            uvB.set(this.uvBuffer[j + 2], this.uvBuffer[j + 3]);
            uvC.set(this.uvBuffer[j + 4], this.uvBuffer[j + 5]);
            centroid.copy(a).add(b).add(c).divideScalar(3);
            var azi = this.azimuth(centroid);
            this.correctUV(uvA, j + 0, a, azi);
            this.correctUV(uvB, j + 2, b, azi);
            this.correctUV(uvC, j + 4, c, azi);
        }
    };
    PolyhedronBufferGeometry.prototype.correctUV = function (uv, stride, vector, azimuth) {
        if ((azimuth < 0) && (uv.x === 1)) {
            this.uvBuffer[stride] = uv.x - 1;
        }
        if ((vector.x === 0) && (vector.z === 0)) {
            this.uvBuffer[stride] = azimuth / 2 / Math.PI + 0.5;
        }
    };
    // Angle around the Y axis, counter-clockwise when looking from above.
    PolyhedronBufferGeometry.prototype.azimuth = function (vector) {
        return Math.atan2(vector.z, -vector.x);
    };
    // Angle above the XZ plane.
    PolyhedronBufferGeometry.prototype.inclination = function (vector) {
        return Math.atan2(-vector.y, Math.sqrt((vector.x * vector.x) + (vector.z * vector.z)));
    };
    return PolyhedronBufferGeometry;
}(BufferGeometry));
export { PolyhedronBufferGeometry };

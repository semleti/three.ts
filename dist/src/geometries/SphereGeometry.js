/**
 * @author mrdoob / http://mrdoob.com/
 * @author benaadams / https://twitter.com/ben_a_adams
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
// SphereGeometry
var SphereGeometry = /** @class */ (function (_super) {
    __extends(SphereGeometry, _super);
    function SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
        var _this = _super.call(this) || this;
        _this.type = 'SphereGeometry';
        _this.parameters = {
            radius: radius,
            widthSegments: widthSegments,
            heightSegments: heightSegments,
            phiStart: phiStart,
            phiLength: phiLength,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        _this.fromBufferGeometry(new SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength));
        _this.mergeVertices();
        return _this;
    }
    return SphereGeometry;
}(Geometry));
export { SphereGeometry };
// SphereBufferGeometry
var SphereBufferGeometry = /** @class */ (function (_super) {
    __extends(SphereBufferGeometry, _super);
    function SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
        if (radius === void 0) { radius = 1; }
        if (widthSegments === void 0) { widthSegments = 8; }
        if (heightSegments === void 0) { heightSegments = 6; }
        if (phiStart === void 0) { phiStart = 0; }
        if (phiLength === void 0) { phiLength = Math.PI * 2; }
        if (thetaStart === void 0) { thetaStart = 0; }
        if (thetaLength === void 0) { thetaLength = Math.PI; }
        var _this = _super.call(this) || this;
        _this.type = 'SphereBufferGeometry';
        _this.parameters = {
            radius: radius,
            widthSegments: widthSegments,
            heightSegments: heightSegments,
            phiStart: phiStart,
            phiLength: phiLength,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        widthSegments = Math.max(3, Math.floor(widthSegments));
        heightSegments = Math.max(2, Math.floor(heightSegments));
        var thetaEnd = thetaStart + thetaLength;
        var ix, iy;
        var index = 0;
        var grid = [];
        var vertex = new Vector3();
        var normal = new Vector3();
        // buffers
        var indices = [];
        var vertices = [];
        var normals = [];
        var uvs = [];
        // generate vertices, normals and uvs
        for (iy = 0; iy <= heightSegments; iy++) {
            var verticesRow = [];
            var v = iy / heightSegments;
            for (ix = 0; ix <= widthSegments; ix++) {
                var u = ix / widthSegments;
                // vertex
                vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertices.push(vertex.x, vertex.y, vertex.z);
                // normal
                normal.set(vertex.x, vertex.y, vertex.z).normalize();
                normals.push(normal.x, normal.y, normal.z);
                // uv
                uvs.push(u, 1 - v);
                verticesRow.push(index++);
            }
            grid.push(verticesRow);
        }
        // indices
        for (iy = 0; iy < heightSegments; iy++) {
            for (ix = 0; ix < widthSegments; ix++) {
                var a = grid[iy][ix + 1];
                var b = grid[iy][ix];
                var c = grid[iy + 1][ix];
                var d = grid[iy + 1][ix + 1];
                if (iy !== 0 || thetaStart > 0)
                    indices.push(a, b, d);
                if (iy !== heightSegments - 1 || thetaEnd < Math.PI)
                    indices.push(b, c, d);
            }
        }
        // build geometry
        _this.setIndex(indices);
        _this.addAttribute('position', new Float32BufferAttribute(vertices, 3));
        _this.addAttribute('normal', new Float32BufferAttribute(normals, 3));
        _this.addAttribute('uv', new Float32BufferAttribute(uvs, 2));
        return _this;
    }
    SphereBufferGeometry.prototype.clone = function () {
        return new SphereBufferGeometry(this.parameters.radius, this.parameters.widthSegments, this.parameters.heightSegments, this.parameters.phiStart, this.parameters.phiLength, this.parameters.thetaStart, this.parameters.thetaLength).copy(this);
    };
    SphereBufferGeometry.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    return SphereBufferGeometry;
}(BufferGeometry));
export { SphereBufferGeometry };

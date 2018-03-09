/**
 * @author benaadams / https://twitter.com/ben_a_adams
 * @author Mugen87 / https://github.com/Mugen87
 * @author hughes
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
// CircleGeometry
var CircleGeometry = /** @class */ (function (_super) {
    __extends(CircleGeometry, _super);
    function CircleGeometry(radius, segments, thetaStart, thetaLength) {
        var _this = _super.call(this) || this;
        _this.type = 'CircleGeometry';
        _this.parameters = {
            radius: radius,
            segments: segments,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        _this.fromBufferGeometry(new CircleBufferGeometry(radius, segments, thetaStart, thetaLength));
        _this.mergeVertices();
        return _this;
    }
    return CircleGeometry;
}(Geometry));
export { CircleGeometry };
var CircleBufferGeometry = /** @class */ (function (_super) {
    __extends(CircleBufferGeometry, _super);
    function CircleBufferGeometry(radius, segments, thetaStart, thetaLength) {
        var _this = _super.call(this) || this;
        _this.type = 'CircleBufferGeometry';
        // buffers
        _this.indices = [];
        _this.vertices = [];
        _this.normals = [];
        _this.uvs = [];
        _this.parameters = {
            radius: radius,
            segments: segments,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        radius = radius || 1;
        segments = segments !== undefined ? Math.max(3, segments) : 8;
        thetaStart = thetaStart !== undefined ? thetaStart : 0;
        thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;
        // helper variables
        var i, s;
        var vertex = new Vector3();
        var uv = new Vector2();
        _this.vertices.push(0, 0, 0);
        _this.normals.push(0, 0, 1);
        _this.uvs.push(0.5, 0.5);
        for (s = 0, i = 3; s <= segments; s++, i += 3) {
            var segment = thetaStart + s / segments * thetaLength;
            // vertex
            vertex.x = radius * Math.cos(segment);
            vertex.y = radius * Math.sin(segment);
            _this.vertices.push(vertex.x, vertex.y, vertex.z);
            // normal
            _this.normals.push(0, 0, 1);
            // uvs
            uv.x = (_this.vertices[i] / radius + 1) / 2;
            uv.y = (_this.vertices[i + 1] / radius + 1) / 2;
            _this.uvs.push(uv.x, uv.y);
        }
        // indices
        for (i = 1; i <= segments; i++) {
            _this.indices.push(i, i + 1, 0);
        }
        // build geometry
        _this.setIndex(_this.indices);
        _this.addAttribute('position', new Float32BufferAttribute(_this.vertices, 3));
        _this.addAttribute('normal', new Float32BufferAttribute(_this.normals, 3));
        _this.addAttribute('uv', new Float32BufferAttribute(_this.uvs, 2));
        return _this;
    }
    CircleBufferGeometry.prototype.clone = function () {
        return new CircleBufferGeometry(this.parameters.radius, this.parameters.segments, this.parameters.thetaStart, this.parameters.thetaLength).copy(this);
    };
    CircleBufferGeometry.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.indices = source.indices;
        this.vertices = source.vertices;
        return this;
    };
    return CircleBufferGeometry;
}(BufferGeometry));
export { CircleBufferGeometry };

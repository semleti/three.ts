/**
 * @author Kaleb Murphy
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
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
// RingGeometry
var RingGeometry = /** @class */ (function (_super) {
    __extends(RingGeometry, _super);
    function RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
        var _this = _super.call(this) || this;
        _this.type = 'RingGeometry';
        _this.parameters = {
            innerRadius: innerRadius,
            outerRadius: outerRadius,
            thetaSegments: thetaSegments,
            phiSegments: phiSegments,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        _this.fromBufferGeometry(new RingBufferGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength));
        _this.mergeVertices();
        return _this;
    }
    return RingGeometry;
}(Geometry));
export { RingGeometry };
// RingBufferGeometry
var RingBufferGeometry = /** @class */ (function (_super) {
    __extends(RingBufferGeometry, _super);
    function RingBufferGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
        if (innerRadius === void 0) { innerRadius = 0.5; }
        if (outerRadius === void 0) { outerRadius = 1; }
        if (thetaSegments === void 0) { thetaSegments = 8; }
        if (phiSegments === void 0) { phiSegments = 1; }
        if (thetaStart === void 0) { thetaStart = 0; }
        if (thetaLength === void 0) { thetaLength = Math.PI * 2; }
        var _this = _super.call(this) || this;
        _this.type = 'RingBufferGeometry';
        _this.parameters = {
            innerRadius: innerRadius,
            outerRadius: outerRadius,
            thetaSegments: thetaSegments,
            phiSegments: phiSegments,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        thetaSegments = Math.max(3, thetaSegments);
        phiSegments = Math.max(1, phiSegments);
        // buffers
        var indices = [];
        var vertices = [];
        var normals = [];
        var uvs = [];
        // some helper variables
        var segment;
        var radius = innerRadius;
        var radiusStep = ((outerRadius - innerRadius) / phiSegments);
        var vertex = new Vector3();
        var uv = new Vector2();
        var j, i;
        // generate vertices, normals and uvs
        for (j = 0; j <= phiSegments; j++) {
            for (i = 0; i <= thetaSegments; i++) {
                // values are generate from the inside of the ring to the outside
                segment = thetaStart + i / thetaSegments * thetaLength;
                // vertex
                vertex.x = radius * Math.cos(segment);
                vertex.y = radius * Math.sin(segment);
                vertices.push(vertex.x, vertex.y, vertex.z);
                // normal
                normals.push(0, 0, 1);
                // uv
                uv.x = (vertex.x / outerRadius + 1) / 2;
                uv.y = (vertex.y / outerRadius + 1) / 2;
                uvs.push(uv.x, uv.y);
            }
            // increase the radius for next row of vertices
            radius += radiusStep;
        }
        // indices
        for (j = 0; j < phiSegments; j++) {
            var thetaSegmentLevel = j * (thetaSegments + 1);
            for (i = 0; i < thetaSegments; i++) {
                segment = i + thetaSegmentLevel;
                var a = segment;
                var b = segment + thetaSegments + 1;
                var c = segment + thetaSegments + 2;
                var d = segment + 1;
                // faces
                indices.push(a, b, d);
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
    return RingBufferGeometry;
}(BufferGeometry));
export { RingBufferGeometry };

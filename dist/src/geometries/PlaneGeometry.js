/**
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
// PlaneGeometry
var PlaneGeometry = /** @class */ (function (_super) {
    __extends(PlaneGeometry, _super);
    function PlaneGeometry(width, height, widthSegments, heightSegments) {
        var _this = _super.call(this) || this;
        _this.type = 'PlaneGeometry';
        _this.parameters = {
            width: width,
            height: height,
            widthSegments: widthSegments,
            heightSegments: heightSegments
        };
        _this.fromBufferGeometry(new PlaneBufferGeometry(width, height, widthSegments, heightSegments));
        _this.mergeVertices();
        return _this;
    }
    return PlaneGeometry;
}(Geometry));
export { PlaneGeometry };
// PlaneBufferGeometry
var PlaneBufferGeometry = /** @class */ (function (_super) {
    __extends(PlaneBufferGeometry, _super);
    function PlaneBufferGeometry(width, height, widthSegments, heightSegments) {
        var _this = _super.call(this) || this;
        _this.type = 'PlaneBufferGeometry';
        _this.parameters = {
            width: width,
            height: height,
            widthSegments: widthSegments,
            heightSegments: heightSegments
        };
        width = width || 1;
        height = height || 1;
        var width_half = width / 2;
        var height_half = height / 2;
        var gridX = Math.floor(widthSegments) || 1;
        var gridY = Math.floor(heightSegments) || 1;
        var gridX1 = gridX + 1;
        var gridY1 = gridY + 1;
        var segment_width = width / gridX;
        var segment_height = height / gridY;
        var ix, iy;
        // buffers
        var indices = [];
        var vertices = [];
        var normals = [];
        var uvs = [];
        // generate vertices, normals and uvs
        for (iy = 0; iy < gridY1; iy++) {
            var y = iy * segment_height - height_half;
            for (ix = 0; ix < gridX1; ix++) {
                var x = ix * segment_width - width_half;
                vertices.push(x, -y, 0);
                normals.push(0, 0, 1);
                uvs.push(ix / gridX);
                uvs.push(1 - (iy / gridY));
            }
        }
        // indices
        for (iy = 0; iy < gridY; iy++) {
            for (ix = 0; ix < gridX; ix++) {
                var a = ix + gridX1 * iy;
                var b = ix + gridX1 * (iy + 1);
                var c = (ix + 1) + gridX1 * (iy + 1);
                var d = (ix + 1) + gridX1 * iy;
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
    return PlaneBufferGeometry;
}(BufferGeometry));
export { PlaneBufferGeometry };

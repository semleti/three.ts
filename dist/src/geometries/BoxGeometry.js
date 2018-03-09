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
import { Vector3 } from '../math/Vector3';
// BoxGeometry
var BoxGeometry = /** @class */ (function (_super) {
    __extends(BoxGeometry, _super);
    function BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
        var _this = _super.call(this) || this;
        _this.type = 'BoxGeometry';
        _this.parameters = {
            width: width,
            height: height,
            depth: depth,
            widthSegments: widthSegments,
            heightSegments: heightSegments,
            depthSegments: depthSegments
        };
        _this.fromBufferGeometry(new BoxBufferGeometry(width, height, depth, widthSegments, heightSegments, depthSegments));
        _this.mergeVertices();
        return _this;
    }
    return BoxGeometry;
}(Geometry));
export { BoxGeometry };
// BoxBufferGeometry
var BoxBufferGeometry = /** @class */ (function (_super) {
    __extends(BoxBufferGeometry, _super);
    function BoxBufferGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
        var _this = _super.call(this) || this;
        _this.type = 'BoxBufferGeometry';
        // buffers
        _this.indices = [];
        _this.vertices = [];
        _this.normals = [];
        _this.uvs = [];
        // helper variables
        _this.numberOfVertices = 0;
        _this.groupStart = 0;
        _this.parameters = {
            width: width,
            height: height,
            depth: depth,
            widthSegments: widthSegments,
            heightSegments: heightSegments,
            depthSegments: depthSegments
        };
        width = width || 1;
        height = height || 1;
        depth = depth || 1;
        // segments
        widthSegments = Math.floor(widthSegments) || 1;
        heightSegments = Math.floor(heightSegments) || 1;
        depthSegments = Math.floor(depthSegments) || 1;
        // build each side of the box geometry
        _this.buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments, 0); // px
        _this.buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments, 1); // nx
        _this.buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2); // py
        _this.buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments, 3); // ny
        _this.buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments, 4); // pz
        _this.buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments, 5); // nz
        // build geometry
        _this.setIndex(_this.indices);
        _this.addAttribute('position', new Float32BufferAttribute(_this.vertices, 3));
        _this.addAttribute('normal', new Float32BufferAttribute(_this.normals, 3));
        _this.addAttribute('uv', new Float32BufferAttribute(_this.uvs, 2));
        return _this;
    }
    BoxBufferGeometry.prototype.clone = function () {
        return new BoxBufferGeometry(this.parameters.width, this.parameters.height, this.parameters.depth, this.parameters.widthSegments, this.parameters.heightSegments, this.parameters.depthSegments).copy(this);
    };
    BoxBufferGeometry.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.indices = source.indices;
        return this;
    };
    BoxBufferGeometry.prototype.buildPlane = function (u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex) {
        var segmentWidth = width / gridX;
        var segmentHeight = height / gridY;
        var widthHalf = width / 2;
        var heightHalf = height / 2;
        var depthHalf = depth / 2;
        var gridX1 = gridX + 1;
        var gridY1 = gridY + 1;
        var vertexCounter = 0;
        var groupCount = 0;
        var ix, iy;
        var vector = new Vector3();
        // generate vertices, normals and uvs
        for (iy = 0; iy < gridY1; iy++) {
            var y = iy * segmentHeight - heightHalf;
            for (ix = 0; ix < gridX1; ix++) {
                var x = ix * segmentWidth - widthHalf;
                // set values to correct vector component
                vector[u] = x * udir;
                vector[v] = y * vdir;
                vector[w] = depthHalf;
                // now apply vector to vertex buffer
                this.vertices.push(vector.x, vector.y, vector.z);
                // set values to correct vector component
                vector[u] = 0;
                vector[v] = 0;
                vector[w] = depth > 0 ? 1 : -1;
                // now apply vector to normal buffer
                this.normals.push(vector.x, vector.y, vector.z);
                // uvs
                this.uvs.push(ix / gridX);
                this.uvs.push(1 - (iy / gridY));
                // counters
                vertexCounter += 1;
            }
        }
        // indices
        // 1. you need three indices to draw a single face
        // 2. a single segment consists of two faces
        // 3. so we need to generate six (2*3) indices per segment
        for (iy = 0; iy < gridY; iy++) {
            for (ix = 0; ix < gridX; ix++) {
                var a = this.numberOfVertices + ix + gridX1 * iy;
                var b = this.numberOfVertices + ix + gridX1 * (iy + 1);
                var c = this.numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
                var d = this.numberOfVertices + (ix + 1) + gridX1 * iy;
                // faces
                this.indices.push(a, b, d);
                this.indices.push(b, c, d);
                // increase counter
                groupCount += 6;
            }
        }
        // add a group to the geometry. this will ensure multi material support
        this.addGroup(this.groupStart, groupCount, materialIndex);
        // calculate new start value for groups
        this.groupStart += groupCount;
        // update total number of vertices
        this.numberOfVertices += vertexCounter;
    };
    return BoxBufferGeometry;
}(BufferGeometry));
export { BoxBufferGeometry };

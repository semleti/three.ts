/**
 * @author oosmoxiecode / https://github.com/oosmoxiecode
 * @author WestLangley / https://github.com/WestLangley
 * @author zz85 / https://github.com/zz85
 * @author miningold / https://github.com/miningold
 * @author jonobr1 / https://github.com/jonobr1
 * @author Mugen87 / https://github.com/Mugen87
 *
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
// TubeGeometry
var TubeGeometry = /** @class */ (function (_super) {
    __extends(TubeGeometry, _super);
    function TubeGeometry(path, tubularSegments, radius, radialSegments, closed, taper) {
        var _this = _super.call(this) || this;
        _this.type = 'TubeGeometry';
        _this.parameters = {
            path: path,
            tubularSegments: tubularSegments,
            radius: radius,
            radialSegments: radialSegments,
            closed: closed
        };
        if (taper !== undefined)
            console.warn('THREE.TubeGeometry: taper has been removed.');
        var bufferGeometry = new TubeBufferGeometry(path, tubularSegments, radius, radialSegments, closed);
        // expose internals
        _this.tangents = bufferGeometry.tangents;
        _this.normals = bufferGeometry.normals;
        _this.binormals = bufferGeometry.binormals;
        // create geometry
        _this.fromBufferGeometry(bufferGeometry);
        _this.mergeVertices();
        return _this;
    }
    return TubeGeometry;
}(Geometry));
export { TubeGeometry };
// TubeBufferGeometry
var TubeBufferGeometry = /** @class */ (function (_super) {
    __extends(TubeBufferGeometry, _super);
    function TubeBufferGeometry(path, tubularSegments, radius, radialSegments, closed) {
        var _this = _super.call(this) || this;
        _this.type = 'TubeBufferGeometry';
        _this.vertices = [];
        _this.normals = [];
        _this.uvs = [];
        _this.indices = [];
        //TODO: check order of parameters/default value setting
        _this.parameters = {
            path: path,
            tubularSegments: tubularSegments,
            radius: radius,
            radialSegments: radialSegments,
            closed: closed
        };
        tubularSegments = tubularSegments || 64;
        radius = radius || 1;
        radialSegments = radialSegments || 8;
        _this.closed = closed || false;
        _this.frames = path.computeFrenetFrames(tubularSegments, _this.closed);
        // expose internals
        _this.tangents = _this.frames.tangents;
        _this.normals = _this.frames.normals;
        _this.binormals = _this.frames.binormals;
        // buffer
        // create buffer data
        _this.generateBufferData();
        // build geometry
        _this.setIndex(_this.indices);
        _this.addAttribute('position', new Float32BufferAttribute(_this.vertices, 3));
        _this.addAttribute('normal', new Float32BufferAttribute(_this.normals, 3));
        _this.addAttribute('uv', new Float32BufferAttribute(_this.uvs, 2));
        return _this;
    }
    // functions
    TubeBufferGeometry.prototype.generateBufferData = function () {
        for (var i = 0; i < this.parameters.tubularSegments; i++) {
            this.generateSegment(i);
        }
        // if the geometry is not closed, generate the last row of vertices and normals
        // at the regular position on the given path
        //
        // if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)
        this.generateSegment((this.closed === false) ? this.parameters.tubularSegments : 0);
        // uvs are generated in a separate function.
        // this makes it easy compute correct values for closed geometries
        this.generateUVs();
        // finally create faces
        this.generateIndices();
    };
    TubeBufferGeometry.prototype.generateSegment = function (i) {
        // helper variables
        var vertex = new Vector3();
        var normal = new Vector3();
        var P = new Vector3();
        // we use getPointAt to sample evenly distributed points from the given path
        P = this.parameters.path.getPointAt(i / this.parameters.tubularSegments, P);
        // retrieve corresponding normal and binormal
        var N = this.frames.normals[i];
        var B = this.frames.binormals[i];
        // generate normals and vertices for the current segment
        for (var j = 0; j <= this.parameters.radialSegments; j++) {
            var v = j / this.parameters.radialSegments * Math.PI * 2;
            var sin = Math.sin(v);
            var cos = -Math.cos(v);
            // normal
            normal.x = (cos * N.x + sin * B.x);
            normal.y = (cos * N.y + sin * B.y);
            normal.z = (cos * N.z + sin * B.z);
            normal.normalize();
            this.normals.push(normal.x, normal.y, normal.z);
            // vertex
            vertex.x = P.x + this.parameters.radius * normal.x;
            vertex.y = P.y + this.parameters.radius * normal.y;
            vertex.z = P.z + this.parameters.radius * normal.z;
            this.vertices.push(vertex.x, vertex.y, vertex.z);
        }
    };
    TubeBufferGeometry.prototype.generateIndices = function () {
        for (var j = 1; j <= this.parameters.tubularSegments; j++) {
            for (var i = 1; i <= this.parameters.radialSegments; i++) {
                var a = (this.parameters.radialSegments + 1) * (j - 1) + (i - 1);
                var b = (this.parameters.radialSegments + 1) * j + (i - 1);
                var c = (this.parameters.radialSegments + 1) * j + i;
                var d = (this.parameters.radialSegments + 1) * (j - 1) + i;
                // faces
                this.indices.push(a, b, d);
                this.indices.push(b, c, d);
            }
        }
    };
    TubeBufferGeometry.prototype.generateUVs = function () {
        var uv = new Vector2();
        for (var i = 0; i <= this.parameters.tubularSegments; i++) {
            for (var j = 0; j <= this.parameters.radialSegments; j++) {
                uv.x = i / this.parameters.tubularSegments;
                uv.y = j / this.parameters.radialSegments;
                this.uvs.push(uv.x, uv.y);
            }
        }
    };
    return TubeBufferGeometry;
}(BufferGeometry));
export { TubeBufferGeometry };

/**
 * @author zz85 / https://github.com/zz85
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
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
// ParametricGeometry
var ParametricGeometry = /** @class */ (function (_super) {
    __extends(ParametricGeometry, _super);
    function ParametricGeometry(func, slices, stacks) {
        var _this = _super.call(this) || this;
        _this.type = 'ParametricGeometry';
        _this.parameters = {
            func: func,
            slices: slices,
            stacks: stacks
        };
        _this.fromBufferGeometry(new ParametricBufferGeometry(func, slices, stacks));
        _this.mergeVertices();
        return _this;
    }
    return ParametricGeometry;
}(Geometry));
export { ParametricGeometry };
// ParametricBufferGeometry
var ParametricBufferGeometry = /** @class */ (function (_super) {
    __extends(ParametricBufferGeometry, _super);
    function ParametricBufferGeometry(func, slices, stacks) {
        var _this = _super.call(this) || this;
        _this.type = 'ParametricBufferGeometry';
        _this.indices = [];
        _this.vertices = [];
        _this.normals = [];
        _this.uvs = [];
        _this.normal = new Vector3();
        _this.p0 = new Vector3();
        _this.p1 = new Vector3();
        _this.pu = new Vector3();
        _this.pv = new Vector3();
        _this.parameters = {
            func: func,
            slices: slices,
            stacks: stacks
        };
        // buffers
        var i, j;
        // generate vertices, normals and uvs
        var sliceCount = slices + 1;
        for (i = 0; i <= stacks; i++) {
            var v = i / stacks;
            for (j = 0; j <= slices; j++) {
                var u = j / slices;
                // vertex
                _this.p0 = func(u, v, _this.p0);
                _this.vertices.push(_this.p0.x, _this.p0.y, _this.p0.z);
                // normal
                // approximate tangent vectors via finite differences
                if (u - ParametricBufferGeometry.EPS >= 0) {
                    _this.p1 = func(u - ParametricBufferGeometry.EPS, v, _this.p1);
                    _this.pu.subVectors(_this.p0, _this.p1);
                }
                else {
                    _this.p1 = func(u + ParametricBufferGeometry.EPS, v, _this.p1);
                    _this.pu.subVectors(_this.p1, _this.p0);
                }
                if (v - ParametricBufferGeometry.EPS >= 0) {
                    _this.p1 = func(u, v - ParametricBufferGeometry.EPS, _this.p1);
                    _this.pv.subVectors(_this.p0, _this.p1);
                }
                else {
                    _this.p1 = func(u, v + ParametricBufferGeometry.EPS, _this.p1);
                    _this.pv.subVectors(_this.p1, _this.p0);
                }
                // cross product of tangent vectors returns surface normal
                _this.normal.crossVectors(_this.pu, _this.pv).normalize();
                _this.normals.push(_this.normal.x, _this.normal.y, _this.normal.z);
                // uv
                _this.uvs.push(u, v);
            }
        }
        // generate indices
        for (i = 0; i < stacks; i++) {
            for (j = 0; j < slices; j++) {
                var a = i * sliceCount + j;
                var b = i * sliceCount + j + 1;
                var c = (i + 1) * sliceCount + j + 1;
                var d = (i + 1) * sliceCount + j;
                // faces one and two
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
    ParametricBufferGeometry.EPS = 0.00001;
    return ParametricBufferGeometry;
}(BufferGeometry));
export { ParametricBufferGeometry };

/**
 * @author oosmoxiecode
 * @author Mugen87 / https://github.com/Mugen87
 *
 * based on http://www.blackpawn.com/texts/pqtorus/
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
// TorusKnotGeometry
var TorusKnotGeometry = /** @class */ (function (_super) {
    __extends(TorusKnotGeometry, _super);
    function TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q, heightScale) {
        var _this = _super.call(this) || this;
        _this.type = 'TorusKnotGeometry';
        _this.parameters = {
            radius: radius,
            tube: tube,
            tubularSegments: tubularSegments,
            radialSegments: radialSegments,
            p: p,
            q: q
        };
        if (heightScale !== undefined)
            console.warn('THREE.TorusKnotGeometry: heightScale has been deprecated. Use .scale( x, y, z ) instead.');
        _this.fromBufferGeometry(new TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q));
        _this.mergeVertices();
        return _this;
    }
    return TorusKnotGeometry;
}(Geometry));
export { TorusKnotGeometry };
// TorusKnotBufferGeometry
var TorusKnotBufferGeometry = /** @class */ (function (_super) {
    __extends(TorusKnotBufferGeometry, _super);
    function TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q) {
        var _this = _super.call(this) || this;
        _this.type = 'TorusKnotBufferGeometry'; // buffers
        _this.indices = [];
        _this.vertices = [];
        _this.normals = [];
        _this.uvs = [];
        _this.parameters = {
            radius: radius,
            tube: tube,
            tubularSegments: tubularSegments,
            radialSegments: radialSegments,
            p: p,
            q: q
        };
        radius = radius || 1;
        tube = tube || 0.4;
        tubularSegments = Math.floor(tubularSegments) || 64;
        radialSegments = Math.floor(radialSegments) || 8;
        p = p || 2;
        q = q || 3;
        // helper variables
        var i, j;
        var vertex = new Vector3();
        var normal = new Vector3();
        var P1 = new Vector3();
        var P2 = new Vector3();
        var B = new Vector3();
        var T = new Vector3();
        var N = new Vector3();
        // generate vertices, normals and uvs
        for (i = 0; i <= tubularSegments; ++i) {
            // the radian "u" is used to calculate the position on the torus curve of the current tubular segement
            var u = i / tubularSegments * p * Math.PI * 2;
            // now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
            // these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions
            _this.calculatePositionOnCurve(u, p, q, radius, P1);
            _this.calculatePositionOnCurve(u + 0.01, p, q, radius, P2);
            // calculate orthonormal basis
            T.subVectors(P2, P1);
            N.addVectors(P2, P1);
            B.crossVectors(T, N);
            N.crossVectors(B, T);
            // normalize B, N. T can be ignored, we don't use it
            B.normalize();
            N.normalize();
            for (j = 0; j <= radialSegments; ++j) {
                // now calculate the vertices. they are nothing more than an extrusion of the torus curve.
                // because we extrude a shape in the xy-plane, there is no need to calculate a z-value.
                var v = j / radialSegments * Math.PI * 2;
                var cx = -tube * Math.cos(v);
                var cy = tube * Math.sin(v);
                // now calculate the final vertex position.
                // first we orient the extrusion with our basis vectos, then we add it to the current position on the curve
                vertex.x = P1.x + (cx * N.x + cy * B.x);
                vertex.y = P1.y + (cx * N.y + cy * B.y);
                vertex.z = P1.z + (cx * N.z + cy * B.z);
                _this.vertices.push(vertex.x, vertex.y, vertex.z);
                // normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)
                normal.subVectors(vertex, P1).normalize();
                _this.normals.push(normal.x, normal.y, normal.z);
                // uv
                _this.uvs.push(i / tubularSegments);
                _this.uvs.push(j / radialSegments);
            }
        }
        // generate indices
        for (j = 1; j <= tubularSegments; j++) {
            for (i = 1; i <= radialSegments; i++) {
                // indices
                var a = (radialSegments + 1) * (j - 1) + (i - 1);
                var b = (radialSegments + 1) * j + (i - 1);
                var c = (radialSegments + 1) * j + i;
                var d = (radialSegments + 1) * (j - 1) + i;
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
    TorusKnotBufferGeometry.prototype.clone = function () {
        return new TorusKnotBufferGeometry(this.parameters.radius, this.parameters.tube, this.parameters.tubularSegments, this.parameters.radialSegments, this.parameters.p, this.parameters.q).copy(this);
    };
    TorusKnotBufferGeometry.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.indices = source.indices;
        this.vertices = source.vertices;
        return this;
    };
    // this function calculates the current position on the torus curve
    TorusKnotBufferGeometry.prototype.calculatePositionOnCurve = function (u, p, q, radius, position) {
        var cu = Math.cos(u);
        var su = Math.sin(u);
        var quOverP = q / p * u;
        var cs = Math.cos(quOverP);
        position.x = radius * (2 + cs) * 0.5 * cu;
        position.y = radius * (2 + cs) * su * 0.5;
        position.z = radius * Math.sin(quOverP) * 0.5;
    };
    return TorusKnotBufferGeometry;
}(BufferGeometry));
export { TorusKnotBufferGeometry };

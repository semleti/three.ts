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
import { Vector2 } from '../math/Vector2';
// CylinderGeometry
var CylinderGeometry = /** @class */ (function (_super) {
    __extends(CylinderGeometry, _super);
    function CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        var _this = _super.call(this) || this;
        _this.type = 'CylinderGeometry';
        _this.parameters = {
            radiusTop: radiusTop,
            radiusBottom: radiusBottom,
            height: height,
            radialSegments: radialSegments,
            heightSegments: heightSegments,
            openEnded: openEnded,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        _this.fromBufferGeometry(new CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength));
        _this.mergeVertices();
        return _this;
    }
    return CylinderGeometry;
}(Geometry));
export { CylinderGeometry };
// CylinderBufferGeometry
var CylinderBufferGeometry = /** @class */ (function (_super) {
    __extends(CylinderBufferGeometry, _super);
    function CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        if (radiusTop === void 0) { radiusTop = 1; }
        if (radiusBottom === void 0) { radiusBottom = 1; }
        if (height === void 0) { height = 1; }
        if (radialSegments === void 0) { radialSegments = 8; }
        if (heightSegments === void 0) { heightSegments = 1; }
        if (openEnded === void 0) { openEnded = false; }
        if (thetaStart === void 0) { thetaStart = 0; }
        if (thetaLength === void 0) { thetaLength = Math.PI * 2; }
        var _this = _super.call(this) || this;
        _this.type = 'CylinderBufferGeometry';
        // buffers
        _this.indices = [];
        _this.vertices = [];
        _this.normals = [];
        _this.uvs = [];
        _this.indx = 0;
        _this.indexArray = [];
        _this.groupStart = 0;
        radialSegments = Math.floor(radialSegments);
        heightSegments = Math.floor(heightSegments);
        _this.parameters = {
            radiusTop: radiusTop,
            radiusBottom: radiusBottom,
            height: height,
            radialSegments: radialSegments,
            heightSegments: heightSegments,
            openEnded: openEnded,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        // helper variables
        _this.halfHeight = height / 2;
        // generate geometry
        _this.generateTorso();
        if (openEnded === false) {
            if (radiusTop > 0)
                _this.generateCap(true);
            if (radiusBottom > 0)
                _this.generateCap(false);
        }
        // build geometry
        _this.setIndex(_this.indices);
        _this.addAttribute('position', new Float32BufferAttribute(_this.vertices, 3));
        _this.addAttribute('normal', new Float32BufferAttribute(_this.normals, 3));
        _this.addAttribute('uv', new Float32BufferAttribute(_this.uvs, 2));
        return _this;
    }
    CylinderBufferGeometry.prototype.clone = function () {
        return new CylinderBufferGeometry(this.parameters.radiusTop, this.parameters.radiusBottom, this.parameters.height, this.parameters.radialSegments, this.parameters.heightSegments, this.parameters.openEnded, this.parameters.thetaStart, this.parameters.thetaLength).copy(this);
    };
    CylinderBufferGeometry.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.indices = source.indices;
        this.vertices = source.vertices;
        return this;
    };
    CylinderBufferGeometry.prototype.generateTorso = function () {
        var x, y;
        var normal = new Vector3();
        var vertex = new Vector3();
        var groupCount = 0;
        // this will be used to calculate the normal
        var slope = (this.parameters.radiusBottom - this.parameters.radiusTop) / this.parameters.height;
        // generate vertices, normals and uvs
        for (y = 0; y <= this.parameters.heightSegments; y++) {
            var indexRow = [];
            var v = y / this.parameters.heightSegments;
            // calculate the radius of the current row
            var radius = v * (this.parameters.radiusBottom - this.parameters.radiusTop) + this.parameters.radiusTop;
            for (x = 0; x <= this.parameters.radialSegments; x++) {
                var u = x / this.parameters.radialSegments;
                var theta = u * this.parameters.thetaLength + this.parameters.thetaStart;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);
                // vertex
                vertex.x = radius * sinTheta;
                vertex.y = -v * this.parameters.height + this.halfHeight;
                vertex.z = radius * cosTheta;
                this.vertices.push(vertex.x, vertex.y, vertex.z);
                // normal
                normal.set(sinTheta, slope, cosTheta).normalize();
                this.normals.push(normal.x, normal.y, normal.z);
                // uv
                this.uvs.push(u, 1 - v);
                // save index of vertex in respective row
                indexRow.push(this.indx++);
            }
            // now save vertices of the row in our index array
            this.indexArray.push(indexRow);
        }
        // generate indices
        for (x = 0; x < this.parameters.radialSegments; x++) {
            for (y = 0; y < this.parameters.heightSegments; y++) {
                // we use the index array to access the correct indices
                var a = this.indexArray[y][x];
                var b = this.indexArray[y + 1][x];
                var c = this.indexArray[y + 1][x + 1];
                var d = this.indexArray[y][x + 1];
                // faces
                this.indices.push(a, b, d);
                this.indices.push(b, c, d);
                // update group counter
                groupCount += 6;
            }
        }
        // add a group to the geometry. this will ensure multi material support
        this.addGroup(this.groupStart, groupCount, 0);
        // calculate new start value for groups
        this.groupStart += groupCount;
    };
    CylinderBufferGeometry.prototype.generateCap = function (top) {
        var x, centerIndexStart, centerIndexEnd;
        var uv = new Vector2();
        var vertex = new Vector3();
        var groupCount = 0;
        var radius = (top === true) ? this.parameters.radiusTop : this.parameters.radiusBottom;
        var sign = (top === true) ? 1 : -1;
        // save the index of the first center vertex
        centerIndexStart = this.index;
        // first we generate the center vertex data of the cap.
        // because the geometry needs one set of uvs per face,
        // we must generate a center vertex per face/segment
        for (x = 1; x <= this.parameters.radialSegments; x++) {
            // vertex
            this.vertices.push(0, this.halfHeight * sign, 0);
            // normal
            this.normals.push(0, sign, 0);
            // uv
            this.uvs.push(0.5, 0.5);
            // increase index
            this.indx++;
        }
        // save the index of the last center vertex
        centerIndexEnd = this.index;
        // now we generate the surrounding vertices, normals and uvs
        for (x = 0; x <= this.parameters.radialSegments; x++) {
            var u = x / this.parameters.radialSegments;
            var theta = u * this.parameters.thetaLength + this.parameters.thetaStart;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
            // vertex
            vertex.x = radius * sinTheta;
            vertex.y = this.halfHeight * sign;
            vertex.z = radius * cosTheta;
            this.vertices.push(vertex.x, vertex.y, vertex.z);
            // normal
            this.normals.push(0, sign, 0);
            // uv
            uv.x = (cosTheta * 0.5) + 0.5;
            uv.y = (sinTheta * 0.5 * sign) + 0.5;
            this.uvs.push(uv.x, uv.y);
            // increase index
            this.indx++;
        }
        // generate indices
        for (x = 0; x < this.parameters.radialSegments; x++) {
            var c = centerIndexStart + x;
            var i = centerIndexEnd + x;
            if (top === true) {
                // face top
                this.indices.push(i, i + 1, c);
            }
            else {
                // face bottom
                this.indices.push(i + 1, i, c);
            }
            groupCount += 3;
        }
        // add a group to the geometry. this will ensure multi material support
        this.addGroup(this.groupStart, groupCount, top === true ? 1 : 2);
        // calculate new start value for groups
        this.groupStart += groupCount;
    };
    return CylinderBufferGeometry;
}(BufferGeometry));
export { CylinderBufferGeometry };

/**
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
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Geometry } from '../core/Geometry';
import { _Math } from '../math/Math';
var EdgesGeometry = /** @class */ (function (_super) {
    __extends(EdgesGeometry, _super);
    function EdgesGeometry(geometry, thresholdAngle) {
        var _this = _super.call(this) || this;
        _this.type = 'EdgesGeometry';
        _this.vertices = [];
        thresholdAngle = (thresholdAngle !== undefined) ? thresholdAngle : 1;
        _this.parameters = {
            thresholdAngle: thresholdAngle
        };
        // buffer
        // helper variables
        var thresholdDot = Math.cos(_Math.DEG2RAD * thresholdAngle);
        var edge = [0, 0], edges = {}, edge1, edge2;
        var key, keys = ['a', 'b', 'c'];
        // prepare source geometry
        var geometry2;
        if (geometry.isBufferGeometry) {
            geometry2 = new Geometry();
            geometry2.fromBufferGeometry(geometry);
        }
        else {
            geometry2 = geometry.clone();
        }
        geometry2.mergeVertices();
        geometry2.computeFaceNormals();
        var sourceVertices = geometry2.vertices;
        var faces = geometry2.faces;
        // now create a data structure where each entry represents an edge with its adjoining faces
        for (var i = 0, l = faces.length; i < l; i++) {
            var face = faces[i];
            for (var j = 0; j < 3; j++) {
                edge1 = face[keys[j]];
                edge2 = face[keys[(j + 1) % 3]];
                edge[0] = Math.min(edge1, edge2);
                edge[1] = Math.max(edge1, edge2);
                key = edge[0] + ',' + edge[1];
                if (edges[key] === undefined) {
                    edges[key] = { index1: edge[0], index2: edge[1], face1: i, face2: undefined };
                }
                else {
                    edges[key].face2 = i;
                }
            }
        }
        // generate vertices
        for (key in edges) {
            var e = edges[key];
            // an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.
            if (e.face2 === undefined || faces[e.face1].normal.dot(faces[e.face2].normal) <= thresholdDot) {
                var vertex = sourceVertices[e.index1];
                _this.vertices.push(vertex.x, vertex.y, vertex.z);
                vertex = sourceVertices[e.index2];
                _this.vertices.push(vertex.x, vertex.y, vertex.z);
            }
        }
        // build geometry
        _this.position = new Float32BufferAttribute(_this.vertices, 3);
        return _this;
    }
    return EdgesGeometry;
}(BufferGeometry));
export { EdgesGeometry };

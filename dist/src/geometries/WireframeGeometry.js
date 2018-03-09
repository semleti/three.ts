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
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';
var WireframeGeometry = /** @class */ (function (_super) {
    __extends(WireframeGeometry, _super);
    function WireframeGeometry(geometry) {
        var _this = _super.call(this) || this;
        _this.type = 'WireframeGeometry';
        // buffer
        _this.vertices = [];
        _this.geometry = geometry;
        var i, j, l, o, ol;
        var edge = [0, 0], edges = {}, e, edge1, edge2;
        var key, keys = ['a', 'b', 'c'];
        var vertex;
        // different logic for Geometry and BufferGeometry
        if (geometry && geometry.isGeometry) {
            // create a data structure that contains all edges without duplicates
            var faces = geometry.faces;
            for (i = 0, l = faces.length; i < l; i++) {
                var face = faces[i];
                for (j = 0; j < 3; j++) {
                    edge1 = face[keys[j]];
                    edge2 = face[keys[(j + 1) % 3]];
                    edge[0] = Math.min(edge1, edge2); // sorting prevents duplicates
                    edge[1] = Math.max(edge1, edge2);
                    key = edge[0] + ',' + edge[1];
                    if (edges[key] === undefined) {
                        edges[key] = { index1: edge[0], index2: edge[1] };
                    }
                }
            }
            // generate vertices
            for (key in edges) {
                e = edges[key];
                vertex = geometry.vertices[e.index1];
                _this.vertices.push(vertex.x, vertex.y, vertex.z);
                vertex = geometry.vertices[e.index2];
                _this.vertices.push(vertex.x, vertex.y, vertex.z);
            }
        }
        else if (geometry && geometry.isBufferGeometry) {
            var position = void 0, indices = void 0, groups = void 0;
            var group = void 0, start = void 0, count = void 0;
            var index1 = void 0, index2 = void 0;
            vertex = new Vector3();
            if (geometry.index !== null) {
                // indexed BufferGeometry
                position = geometry.attributes.position;
                indices = geometry.index;
                groups = geometry.groups;
                if (groups.length === 0) {
                    groups = [{ start: 0, count: indices.count, materialIndex: 0 }];
                }
                // create a data structure that contains all eges without duplicates
                for (o = 0, ol = groups.length; o < ol; ++o) {
                    group = groups[o];
                    start = group.start;
                    count = group.count;
                    for (i = start, l = (start + count); i < l; i += 3) {
                        for (j = 0; j < 3; j++) {
                            edge1 = indices.getX(i + j);
                            edge2 = indices.getX(i + (j + 1) % 3);
                            edge[0] = Math.min(edge1, edge2); // sorting prevents duplicates
                            edge[1] = Math.max(edge1, edge2);
                            key = edge[0] + ',' + edge[1];
                            if (edges[key] === undefined) {
                                edges[key] = { index1: edge[0], index2: edge[1] };
                            }
                        }
                    }
                }
                // generate vertices
                for (key in edges) {
                    e = edges[key];
                    vertex.fromBufferAttribute(position, e.index1);
                    _this.vertices.push(vertex.x, vertex.y, vertex.z);
                    vertex.fromBufferAttribute(position, e.index2);
                    _this.vertices.push(vertex.x, vertex.y, vertex.z);
                }
            }
            else {
                // non-indexed BufferGeometry
                position = geometry.attributes.position;
                for (i = 0, l = (position.count / 3); i < l; i++) {
                    for (j = 0; j < 3; j++) {
                        // three edges per triangle, an edge is represented as (index1, index2)
                        // e.g. the first triangle has the following edges: (0,1),(1,2),(2,0)
                        index1 = 3 * i + j;
                        vertex.fromBufferAttribute(position, index1);
                        _this.vertices.push(vertex.x, vertex.y, vertex.z);
                        index2 = 3 * i + ((j + 1) % 3);
                        vertex.fromBufferAttribute(position, index2);
                        _this.vertices.push(vertex.x, vertex.y, vertex.z);
                    }
                }
            }
        }
        // build geometry
        _this.position = new Float32BufferAttribute(_this.vertices, 3);
        return _this;
    }
    WireframeGeometry.prototype.clone = function () {
        return new WireframeGeometry(this.geometry).copy(this);
    };
    WireframeGeometry.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.vertices = source.vertices;
        return this;
    };
    return WireframeGeometry;
}(BufferGeometry));
export { WireframeGeometry };

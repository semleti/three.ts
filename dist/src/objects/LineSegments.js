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
import { Line } from './Line';
import { Vector3 } from '../math/Vector3';
import { Float32BufferAttribute } from '../core/BufferAttribute';
/**
 * @author mrdoob / http://mrdoob.com/
 */
var LineSegments = /** @class */ (function (_super) {
    __extends(LineSegments, _super);
    function LineSegments(geometry, material) {
        var _this = _super.call(this, geometry, material) || this;
        _this.type = 'LineSegments';
        _this.isLineSegments = true;
        return _this;
    }
    LineSegments.prototype.computeLineDistances = function () {
        var start = new Vector3();
        var end = new Vector3();
        var geometry = this.geometry;
        var lineDistances;
        if (geometry.isBufferGeometry) {
            // we assume non-indexed geometry
            if (geometry.index === null) {
                var positionAttribute = geometry.attributes.position;
                lineDistances = [];
                for (var i = 0, l = positionAttribute.count; i < l; i += 2) {
                    start.fromBufferAttribute(positionAttribute, i);
                    end.fromBufferAttribute(positionAttribute, i + 1);
                    lineDistances[i] = (i === 0) ? 0 : lineDistances[i - 1];
                    lineDistances[i + 1] = lineDistances[i] + start.distanceTo(end);
                }
                geometry.addAttribute('lineDistance', new Float32BufferAttribute(lineDistances, 1));
            }
            else {
                console.warn('THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.');
            }
        }
        else if (geometry.isGeometry) {
            var vertices = geometry.vertices;
            lineDistances = geometry.lineDistances;
            for (var i = 0, l = vertices.length; i < l; i += 2) {
                start.copy(vertices[i]);
                end.copy(vertices[i + 1]);
                lineDistances[i] = (i === 0) ? 0 : lineDistances[i - 1];
                lineDistances[i + 1] = lineDistances[i] + start.distanceTo(end);
            }
        }
        return this;
    };
    return LineSegments;
}(Line));
export { LineSegments };

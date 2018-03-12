/**
 * @author mrdoob / http://mrdoob.com/
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
import { LineSegments } from '../objects/LineSegments';
import { VertexColors } from '../constants';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Color } from '../math/Color';
var GridHelper = /** @class */ (function (_super) {
    __extends(GridHelper, _super);
    function GridHelper(size, divisions, color1, color2) {
        if (size === void 0) { size = 10; }
        if (divisions === void 0) { divisions = 10; }
        if (color1 === void 0) { color1 = 0x444444; }
        if (color2 === void 0) { color2 = 0x888888; }
        return _super.call(this, GridHelper.constructGeom(divisions, size, new Color(color1), new Color(color2)), { vertexColors: VertexColors }) || this;
    }
    GridHelper.constructGeom = function (divisions, size, color1, color2) {
        var center = divisions / 2;
        var step = size / divisions;
        var halfSize = size / 2;
        var vertices = [], colors = [];
        for (var i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {
            vertices.push(-halfSize, 0, k, halfSize, 0, k);
            vertices.push(k, 0, -halfSize, k, 0, halfSize);
            var color = i === center ? color1 : color2;
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
        }
        var geometry = new BufferGeometry();
        geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.addAttribute('color', new Float32BufferAttribute(colors, 3));
        return geometry;
    };
    return GridHelper;
}(LineSegments));
export { GridHelper };

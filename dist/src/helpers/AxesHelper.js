/**
 * @author sroucheray / http://sroucheray.org/
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
var AxesHelper = /** @class */ (function (_super) {
    __extends(AxesHelper, _super);
    function AxesHelper(size) {
        return _super.call(this, AxesHelper.constructGeom(size || 1), { vertexColors: VertexColors }) || this;
    }
    AxesHelper.constructGeom = function (size) {
        var vertices = [
            0, 0, 0, size, 0, 0,
            0, 0, 0, 0, size, 0,
            0, 0, 0, 0, 0, size
        ];
        var colors = [
            1, 0, 0, 1, 0.6, 0,
            0, 1, 0, 0.6, 1, 0,
            0, 0, 1, 0, 0.6, 1
        ];
        var geometry = new BufferGeometry();
        geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.addAttribute('color', new Float32BufferAttribute(colors, 3));
        return geometry;
    };
    return AxesHelper;
}(LineSegments));
export { AxesHelper };

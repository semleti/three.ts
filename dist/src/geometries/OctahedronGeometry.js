/**
 * @author timothypratley / https://github.com/timothypratley
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
import { PolyhedronBufferGeometry } from './PolyhedronGeometry';
// OctahedronGeometry
var OctahedronGeometry = /** @class */ (function (_super) {
    __extends(OctahedronGeometry, _super);
    function OctahedronGeometry(radius, detail) {
        var _this = _super.call(this) || this;
        _this.type = 'OctahedronGeometry';
        _this.parameters = {
            radius: radius,
            detail: detail
        };
        _this.fromBufferGeometry(new OctahedronBufferGeometry(radius, detail));
        _this.mergeVertices();
        return _this;
    }
    return OctahedronGeometry;
}(Geometry));
export { OctahedronGeometry };
// OctahedronBufferGeometry
var OctahedronBufferGeometry = /** @class */ (function (_super) {
    __extends(OctahedronBufferGeometry, _super);
    function OctahedronBufferGeometry(radius, detail) {
        var _this = _super.call(this, OctahedronBufferGeometry.vertices, OctahedronBufferGeometry.indices, radius, detail) || this;
        _this.type = 'OctahedronBufferGeometry';
        _this.parameters = {
            radius: radius,
            detail: detail
        };
        return _this;
    }
    OctahedronBufferGeometry.vertices = [
        1, 0, 0, -1, 0, 0, 0, 1, 0,
        0, -1, 0, 0, 0, 1, 0, 0, -1
    ];
    OctahedronBufferGeometry.indices = [
        0, 2, 4, 0, 4, 3, 0, 3, 5,
        0, 5, 2, 1, 2, 5, 1, 5, 3,
        1, 3, 4, 1, 4, 2
    ];
    return OctahedronBufferGeometry;
}(PolyhedronBufferGeometry));
export { OctahedronBufferGeometry };

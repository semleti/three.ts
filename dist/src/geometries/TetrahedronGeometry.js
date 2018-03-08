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
// TetrahedronGeometry
var TetrahedronGeometry = /** @class */ (function (_super) {
    __extends(TetrahedronGeometry, _super);
    function TetrahedronGeometry(radius, detail) {
        var _this = _super.call(this) || this;
        _this.type = 'TetrahedronGeometry';
        _this.parameters = {
            radius: radius,
            detail: detail
        };
        _this.fromBufferGeometry(new TetrahedronBufferGeometry(radius, detail));
        _this.mergeVertices();
        return _this;
    }
    return TetrahedronGeometry;
}(Geometry));
export { TetrahedronGeometry };
// TetrahedronBufferGeometry
var TetrahedronBufferGeometry = /** @class */ (function (_super) {
    __extends(TetrahedronBufferGeometry, _super);
    function TetrahedronBufferGeometry(radius, detail) {
        var _this = _super.call(this, TetrahedronBufferGeometry.vertices, TetrahedronBufferGeometry.indices, radius, detail) || this;
        _this.type = 'TetrahedronBufferGeometry';
        _this.parameters = {
            radius: radius,
            detail: detail
        };
        return _this;
    }
    TetrahedronBufferGeometry.vertices = [
        1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
    ];
    TetrahedronBufferGeometry.indices = [
        2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
    ];
    return TetrahedronBufferGeometry;
}(PolyhedronBufferGeometry));
export { TetrahedronBufferGeometry };

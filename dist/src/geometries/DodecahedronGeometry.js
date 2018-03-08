/**
 * @author Abe Pazos / https://hamoid.com
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
// DodecahedronGeometry
var DodecahedronGeometry = /** @class */ (function (_super) {
    __extends(DodecahedronGeometry, _super);
    function DodecahedronGeometry(radius, detail) {
        var _this = _super.call(this) || this;
        _this.type = 'DodecahedronGeometry';
        _this.parameters = {
            radius: radius,
            detail: detail
        };
        _this.fromBufferGeometry(new DodecahedronBufferGeometry(radius, detail));
        _this.mergeVertices();
        return _this;
    }
    return DodecahedronGeometry;
}(Geometry));
export { DodecahedronGeometry };
// DodecahedronBufferGeometry
var DodecahedronBufferGeometry = /** @class */ (function (_super) {
    __extends(DodecahedronBufferGeometry, _super);
    function DodecahedronBufferGeometry(radius, detail) {
        var _this = _super.call(this, DodecahedronBufferGeometry.vertices, DodecahedronBufferGeometry.indices, radius, detail) || this;
        _this.type = 'DodecahedronBufferGeometry';
        _this.parameters = {
            radius: radius,
            detail: detail
        };
        return _this;
    }
    DodecahedronBufferGeometry.t = (1 + Math.sqrt(5)) / 2;
    DodecahedronBufferGeometry.r = 1 / DodecahedronBufferGeometry.t;
    DodecahedronBufferGeometry.vertices = [
        // (±1, ±1, ±1)
        -1, -1, -1, -1, -1, 1,
        -1, 1, -1, -1, 1, 1,
        1, -1, -1, 1, -1, 1,
        1, 1, -1, 1, 1, 1,
        // (0, ±1/φ, ±φ)
        0, -DodecahedronBufferGeometry.r, -DodecahedronBufferGeometry.t, 0, -DodecahedronBufferGeometry.r, DodecahedronBufferGeometry.t,
        0, DodecahedronBufferGeometry.r, -DodecahedronBufferGeometry.t, 0, DodecahedronBufferGeometry.r, DodecahedronBufferGeometry.t,
        // (±1/φ, ±φ, 0)
        -DodecahedronBufferGeometry.r, -DodecahedronBufferGeometry.t, 0, -DodecahedronBufferGeometry.r, DodecahedronBufferGeometry.t, 0,
        DodecahedronBufferGeometry.r, -DodecahedronBufferGeometry.t, 0, DodecahedronBufferGeometry.r, DodecahedronBufferGeometry.t, 0,
        // (±φ, 0, ±1/φ)
        -DodecahedronBufferGeometry.t, 0, -DodecahedronBufferGeometry.r, DodecahedronBufferGeometry.t, 0, -DodecahedronBufferGeometry.r,
        -DodecahedronBufferGeometry.t, 0, DodecahedronBufferGeometry.r, DodecahedronBufferGeometry.t, 0, DodecahedronBufferGeometry.r
    ];
    DodecahedronBufferGeometry.indices = [
        3, 11, 7, 3, 7, 15, 3, 15, 13,
        7, 19, 17, 7, 17, 6, 7, 6, 15,
        17, 4, 8, 17, 8, 10, 17, 10, 6,
        8, 0, 16, 8, 16, 2, 8, 2, 10,
        0, 12, 1, 0, 1, 18, 0, 18, 16,
        6, 10, 2, 6, 2, 13, 6, 13, 15,
        2, 16, 18, 2, 18, 3, 2, 3, 13,
        18, 1, 9, 18, 9, 11, 18, 11, 3,
        4, 14, 12, 4, 12, 0, 4, 0, 8,
        11, 9, 5, 11, 5, 19, 11, 19, 7,
        19, 5, 14, 19, 14, 4, 19, 4, 17,
        1, 12, 14, 1, 14, 5, 1, 5, 9
    ];
    return DodecahedronBufferGeometry;
}(PolyhedronBufferGeometry));
export { DodecahedronBufferGeometry };

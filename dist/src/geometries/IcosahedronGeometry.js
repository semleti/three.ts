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
// IcosahedronGeometry
var IcosahedronGeometry = /** @class */ (function (_super) {
    __extends(IcosahedronGeometry, _super);
    function IcosahedronGeometry(radius, detail) {
        var _this = _super.call(this) || this;
        _this.type = 'IcosahedronGeometry';
        _this.parameters = {
            radius: radius,
            detail: detail
        };
        _this.fromBufferGeometry(new IcosahedronBufferGeometry(radius, detail));
        _this.mergeVertices();
        return _this;
    }
    return IcosahedronGeometry;
}(Geometry));
export { IcosahedronGeometry };
// IcosahedronBufferGeometry
var IcosahedronBufferGeometry = /** @class */ (function (_super) {
    __extends(IcosahedronBufferGeometry, _super);
    function IcosahedronBufferGeometry(radius, detail) {
        var _this = _super.call(this, IcosahedronBufferGeometry.vertices, IcosahedronBufferGeometry.indices, radius, detail) || this;
        _this.type = 'IcosahedronBufferGeometry';
        _this.parameters = {
            radius: radius,
            detail: detail
        };
        return _this;
    }
    IcosahedronBufferGeometry.t = (1 + Math.sqrt(5)) / 2;
    IcosahedronBufferGeometry.vertices = [
        -1, IcosahedronBufferGeometry.t, 0, 1, IcosahedronBufferGeometry.t, 0, -1, -IcosahedronBufferGeometry.t, 0, 1, -IcosahedronBufferGeometry.t, 0,
        0, -1, IcosahedronBufferGeometry.t, 0, 1, IcosahedronBufferGeometry.t, 0, -1, -IcosahedronBufferGeometry.t, 0, 1, -IcosahedronBufferGeometry.t,
        IcosahedronBufferGeometry.t, 0, -1, IcosahedronBufferGeometry.t, 0, 1, -IcosahedronBufferGeometry.t, 0, -1, -IcosahedronBufferGeometry.t, 0, 1
    ];
    IcosahedronBufferGeometry.indices = [
        0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
        1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
        3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
        4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
    ];
    return IcosahedronBufferGeometry;
}(PolyhedronBufferGeometry));
export { IcosahedronBufferGeometry };

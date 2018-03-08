/**
 * @author abelnation / http://github.com/abelnation
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
import { CylinderGeometry } from './CylinderGeometry';
import { CylinderBufferGeometry } from './CylinderGeometry';
// ConeGeometry
var ConeGeometry = /** @class */ (function (_super) {
    __extends(ConeGeometry, _super);
    function ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        var _this = _super.call(this, 0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) || this;
        _this.type = 'ConeGeometry';
        _this.parameters = {
            radius: radius,
            height: height,
            radialSegments: radialSegments,
            heightSegments: heightSegments,
            openEnded: openEnded,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        return _this;
    }
    return ConeGeometry;
}(CylinderGeometry));
export { ConeGeometry };
// ConeBufferGeometry
var ConeBufferGeometry = /** @class */ (function (_super) {
    __extends(ConeBufferGeometry, _super);
    function ConeBufferGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        var _this = _super.call(this, 0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) || this;
        _this.type = 'ConeBufferGeometry';
        _this.parameters = {
            radius: radius,
            height: height,
            radialSegments: radialSegments,
            heightSegments: heightSegments,
            openEnded: openEnded,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        return _this;
    }
    return ConeBufferGeometry;
}(CylinderBufferGeometry));
export { ConeBufferGeometry };

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
import { Curve } from '../core/Curve';
import { QuadraticBezier } from '../core/Interpolations';
import { Vector3 } from '../../math/Vector3';
var QuadraticBezierCurve3 = /** @class */ (function (_super) {
    __extends(QuadraticBezierCurve3, _super);
    function QuadraticBezierCurve3(v0, v1, v2) {
        var _this = _super.call(this) || this;
        _this.type = 'QuadraticBezierCurve3';
        _this.isQuadraticBezierCurve3 = true;
        _this.v0 = v0 || new Vector3();
        _this.v1 = v1 || new Vector3();
        _this.v2 = v2 || new Vector3();
        return _this;
    }
    QuadraticBezierCurve3.prototype.getPoint = function (t, optionalTarget) {
        var point = optionalTarget || new Vector3();
        var v0 = this.v0, v1 = this.v1, v2 = this.v2;
        point.set(QuadraticBezier(t, v0.x, v1.x, v2.x), QuadraticBezier(t, v0.y, v1.y, v2.y), QuadraticBezier(t, v0.z, v1.z, v2.z));
        return point;
    };
    QuadraticBezierCurve3.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.v0.copy(source.v0);
        this.v1.copy(source.v1);
        this.v2.copy(source.v2);
        return this;
    };
    QuadraticBezierCurve3.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.v0 = this.v0.toArray();
        data.v1 = this.v1.toArray();
        data.v2 = this.v2.toArray();
        return data;
    };
    QuadraticBezierCurve3.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.v0.fromArray(json.v0);
        this.v1.fromArray(json.v1);
        this.v2.fromArray(json.v2);
        return this;
    };
    return QuadraticBezierCurve3;
}(Curve));
export { QuadraticBezierCurve3 };
(function (QuadraticBezierCurve3) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Curve.Data));
    QuadraticBezierCurve3.Data = Data;
})(QuadraticBezierCurve3 || (QuadraticBezierCurve3 = {}));

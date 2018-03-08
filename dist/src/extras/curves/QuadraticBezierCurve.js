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
import { Vector2 } from '../../math/Vector2';
var QuadraticBezierCurve = /** @class */ (function (_super) {
    __extends(QuadraticBezierCurve, _super);
    function QuadraticBezierCurve(v0, v1, v2) {
        var _this = _super.call(this) || this;
        _this.type = 'QuadraticBezierCurve';
        _this.isQuadraticBezierCurve = true;
        _this.v0 = v0 || new Vector2();
        _this.v1 = v1 || new Vector2();
        _this.v2 = v2 || new Vector2();
        return _this;
    }
    QuadraticBezierCurve.prototype.getPoint = function (t, optionalTarget) {
        var point = optionalTarget || new Vector2();
        var v0 = this.v0, v1 = this.v1, v2 = this.v2;
        point.set(QuadraticBezier(t, v0.x, v1.x, v2.x), QuadraticBezier(t, v0.y, v1.y, v2.y));
        return point;
    };
    QuadraticBezierCurve.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.v0.copy(source.v0);
        this.v1.copy(source.v1);
        this.v2.copy(source.v2);
        return this;
    };
    QuadraticBezierCurve.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.v0 = this.v0.toArray();
        data.v1 = this.v1.toArray();
        data.v2 = this.v2.toArray();
        return data;
    };
    QuadraticBezierCurve.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.v0.fromArray(json.v0);
        this.v1.fromArray(json.v1);
        this.v2.fromArray(json.v2);
        return this;
    };
    return QuadraticBezierCurve;
}(Curve));
export { QuadraticBezierCurve };
(function (QuadraticBezierCurve) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Curve.Data));
    QuadraticBezierCurve.Data = Data;
})(QuadraticBezierCurve || (QuadraticBezierCurve = {}));

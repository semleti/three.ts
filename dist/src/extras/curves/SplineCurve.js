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
import { CatmullRom } from '../core/Interpolations';
import { Vector2 } from '../../math/Vector2';
var SplineCurve = /** @class */ (function (_super) {
    __extends(SplineCurve, _super);
    function SplineCurve(points) {
        if (points === void 0) { points = []; }
        var _this = _super.call(this) || this;
        _this.type = 'SplineCurve';
        _this.isSplineCurve = true;
        _this.points = points;
        return _this;
    }
    SplineCurve.prototype.getPoint = function (t, optionalTarget) {
        var point = optionalTarget || new Vector2();
        var points = this.points;
        var p = (points.length - 1) * t;
        var intPoint = Math.floor(p);
        var weight = p - intPoint;
        var p0 = points[intPoint === 0 ? intPoint : intPoint - 1];
        var p1 = points[intPoint];
        var p2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1];
        var p3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2];
        point.set(CatmullRom(weight, p0.x, p1.x, p2.x, p3.x), CatmullRom(weight, p0.y, p1.y, p2.y, p3.y));
        return point;
    };
    SplineCurve.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.points = [];
        for (var i = 0, l = source.points.length; i < l; i++) {
            var point = source.points[i];
            this.points.push(point.clone());
        }
        return this;
    };
    SplineCurve.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.points = [];
        for (var i = 0, l = this.points.length; i < l; i++) {
            var point = this.points[i];
            data.points.push(point.toArray());
        }
        return data;
    };
    SplineCurve.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.points = [];
        for (var i = 0, l = json.points.length; i < l; i++) {
            var point = json.points[i];
            this.points.push(new Vector2().fromArray(point));
        }
        return this;
    };
    return SplineCurve;
}(Curve));
export { SplineCurve };
(function (SplineCurve) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Curve.Data));
    SplineCurve.Data = Data;
})(SplineCurve || (SplineCurve = {}));

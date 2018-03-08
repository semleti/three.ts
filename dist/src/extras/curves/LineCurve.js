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
import { Vector2 } from '../../math/Vector2';
import { Curve } from '../core/Curve';
var LineCurve = /** @class */ (function (_super) {
    __extends(LineCurve, _super);
    function LineCurve(v1, v2) {
        var _this = _super.call(this) || this;
        _this.type = 'LineCurve';
        _this.isLineCurve = true;
        _this.v1 = v1 || new Vector2();
        _this.v2 = v2 || new Vector2();
        return _this;
    }
    LineCurve.prototype.getPoint = function (t, optionalTarget) {
        var point = optionalTarget || new Vector2();
        if (t === 1) {
            point.copy(this.v2);
        }
        else {
            point.copy(this.v2).sub(this.v1);
            point.multiplyScalar(t).add(this.v1);
        }
        return point;
    };
    // Line curve is linear, so we can overwrite default getPointAt
    LineCurve.prototype.getPointAt = function (u, optionalTarget) {
        return this.getPoint(u, optionalTarget);
    };
    LineCurve.prototype.getTangent = function () {
        var tangent = this.v2.clone().sub(this.v1);
        return tangent.normalize();
    };
    LineCurve.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.v1.copy(source.v1);
        this.v2.copy(source.v2);
        return this;
    };
    LineCurve.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.v1 = this.v1.toArray();
        data.v2 = this.v2.toArray();
        return data;
    };
    LineCurve.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.v1.fromArray(json.v1);
        this.v2.fromArray(json.v2);
        return this;
    };
    return LineCurve;
}(Curve));
export { LineCurve };
(function (LineCurve) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Curve.Data));
    LineCurve.Data = Data;
})(LineCurve || (LineCurve = {}));

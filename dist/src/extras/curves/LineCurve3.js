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
import { Vector3 } from '../../math/Vector3';
import { Curve } from '../core/Curve';
var LineCurve3 = /** @class */ (function (_super) {
    __extends(LineCurve3, _super);
    function LineCurve3(v1, v2) {
        var _this = _super.call(this) || this;
        _this.type = 'LineCurve3';
        _this.isLineCurve3 = true;
        _this.v1 = v1 || new Vector3();
        _this.v2 = v2 || new Vector3();
        return _this;
    }
    LineCurve3.prototype.getPoint = function (t, optionalTarget) {
        var point = optionalTarget || new Vector3();
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
    LineCurve3.prototype.getPointAt = function (u, optionalTarget) {
        return this.getPoint(u, optionalTarget);
    };
    LineCurve3.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.v1.copy(source.v1);
        this.v2.copy(source.v2);
        return this;
    };
    LineCurve3.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.v1 = this.v1.toArray();
        data.v2 = this.v2.toArray();
        return data;
    };
    LineCurve3.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.v1.fromArray(json.v1);
        this.v2.fromArray(json.v2);
        return this;
    };
    return LineCurve3;
}(Curve));
export { LineCurve3 };
(function (LineCurve3) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Curve.Data));
    LineCurve3.Data = Data;
})(LineCurve3 || (LineCurve3 = {}));

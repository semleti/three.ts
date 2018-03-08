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
import { CubicBezier } from '../core/Interpolations';
import { Vector3 } from '../../math/Vector3';
var CubicBezierCurve3 = /** @class */ (function (_super) {
    __extends(CubicBezierCurve3, _super);
    function CubicBezierCurve3(v0, v1, v2, v3) {
        var _this = _super.call(this) || this;
        _this.type = 'CubicBezierCurve3';
        _this.isCubicBezierCurve3 = true;
        _this.v0 = v0 || new Vector3();
        _this.v1 = v1 || new Vector3();
        _this.v2 = v2 || new Vector3();
        _this.v3 = v3 || new Vector3();
        return _this;
    }
    CubicBezierCurve3.prototype.getPoint = function (t, optionalTarget) {
        var point = optionalTarget || new Vector3();
        var v0 = this.v0, v1 = this.v1, v2 = this.v2, v3 = this.v3;
        point.set(CubicBezier(t, v0.x, v1.x, v2.x, v3.x), CubicBezier(t, v0.y, v1.y, v2.y, v3.y), CubicBezier(t, v0.z, v1.z, v2.z, v3.z));
        return point;
    };
    CubicBezierCurve3.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.v0.copy(source.v0);
        this.v1.copy(source.v1);
        this.v2.copy(source.v2);
        this.v3.copy(source.v3);
        return this;
    };
    CubicBezierCurve3.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.v0 = this.v0.toArray();
        data.v1 = this.v1.toArray();
        data.v2 = this.v2.toArray();
        data.v3 = this.v3.toArray();
        return data;
    };
    CubicBezierCurve3.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.v0.fromArray(json.v0);
        this.v1.fromArray(json.v1);
        this.v2.fromArray(json.v2);
        this.v3.fromArray(json.v3);
        return this;
    };
    return CubicBezierCurve3;
}(Curve));
export { CubicBezierCurve3 };
(function (CubicBezierCurve3) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Curve.Data));
    CubicBezierCurve3.Data = Data;
})(CubicBezierCurve3 || (CubicBezierCurve3 = {}));

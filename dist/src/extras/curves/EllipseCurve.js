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
import { Vector2 } from '../../math/Vector2';
var EllipseCurve = /** @class */ (function (_super) {
    __extends(EllipseCurve, _super);
    function EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
        var _this = _super.call(this) || this;
        _this.type = 'EllipseCurve';
        _this.isEllipseCurve = true;
        _this.aX = aX || 0;
        _this.aY = aY || 0;
        _this.xRadius = xRadius || 1;
        _this.yRadius = yRadius || 1;
        _this.aStartAngle = aStartAngle || 0;
        _this.aEndAngle = aEndAngle || 2 * Math.PI;
        _this.aClockwise = aClockwise || false;
        _this.aRotation = aRotation || 0;
        return _this;
    }
    EllipseCurve.prototype.getPoint = function (t, optionalTarget) {
        var point = optionalTarget || new Vector2();
        var twoPi = Math.PI * 2;
        var deltaAngle = this.aEndAngle - this.aStartAngle;
        var samePoints = Math.abs(deltaAngle) < Number.EPSILON;
        // ensures that deltaAngle is 0 .. 2 PI
        while (deltaAngle < 0)
            deltaAngle += twoPi;
        while (deltaAngle > twoPi)
            deltaAngle -= twoPi;
        if (deltaAngle < Number.EPSILON) {
            if (samePoints) {
                deltaAngle = 0;
            }
            else {
                deltaAngle = twoPi;
            }
        }
        if (this.aClockwise === true && !samePoints) {
            if (deltaAngle === twoPi) {
                deltaAngle = -twoPi;
            }
            else {
                deltaAngle = deltaAngle - twoPi;
            }
        }
        var angle = this.aStartAngle + t * deltaAngle;
        var x = this.aX + this.xRadius * Math.cos(angle);
        var y = this.aY + this.yRadius * Math.sin(angle);
        if (this.aRotation !== 0) {
            var cos = Math.cos(this.aRotation);
            var sin = Math.sin(this.aRotation);
            var tx = x - this.aX;
            var ty = y - this.aY;
            // Rotate the point about the center of the ellipse.
            x = tx * cos - ty * sin + this.aX;
            y = tx * sin + ty * cos + this.aY;
        }
        return point.set(x, y);
    };
    EllipseCurve.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.aX = source.aX;
        this.aY = source.aY;
        this.xRadius = source.xRadius;
        this.yRadius = source.yRadius;
        this.aStartAngle = source.aStartAngle;
        this.aEndAngle = source.aEndAngle;
        this.aClockwise = source.aClockwise;
        this.aRotation = source.aRotation;
        return this;
    };
    EllipseCurve.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.aX = this.aX;
        data.aY = this.aY;
        data.xRadius = this.xRadius;
        data.yRadius = this.yRadius;
        data.aStartAngle = this.aStartAngle;
        data.aEndAngle = this.aEndAngle;
        data.aClockwise = this.aClockwise;
        data.aRotation = this.aRotation;
        return data;
    };
    EllipseCurve.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.aX = json.aX;
        this.aY = json.aY;
        this.xRadius = json.xRadius;
        this.yRadius = json.yRadius;
        this.aStartAngle = json.aStartAngle;
        this.aEndAngle = json.aEndAngle;
        this.aClockwise = json.aClockwise;
        this.aRotation = json.aRotation;
        return this;
    };
    return EllipseCurve;
}(Curve));
export { EllipseCurve };
(function (EllipseCurve) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Curve.Data));
    EllipseCurve.Data = Data;
})(EllipseCurve || (EllipseCurve = {}));

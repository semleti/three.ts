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
import { CurvePath } from './CurvePath';
import { EllipseCurve } from '../curves/EllipseCurve';
import { SplineCurve } from '../curves/SplineCurve';
import { CubicBezierCurve } from '../curves/CubicBezierCurve';
import { QuadraticBezierCurve } from '../curves/QuadraticBezierCurve';
import { LineCurve } from '../curves/LineCurve';
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Creates free form 2d path using series of points, lines or curves.
 **/
var Path = /** @class */ (function (_super) {
    __extends(Path, _super);
    function Path(points) {
        var _this = _super.call(this) || this;
        _this.type = 'Path';
        _this.currentPoint = new Vector2();
        if (points) {
            _this.setFromPoints(points);
        }
        return _this;
    }
    Path.prototype.setFromPoints = function (points) {
        this.moveTo(points[0].x, points[0].y);
        for (var i = 1, l = points.length; i < l; i++) {
            this.lineTo(points[i].x, points[i].y);
        }
    };
    Path.prototype.moveTo = function (x, y) {
        this.currentPoint.set(x, y); // TODO consider referencing vectors instead of copying?
    };
    Path.prototype.lineTo = function (x, y) {
        var curve = new LineCurve(this.currentPoint.clone(), new Vector2(x, y));
        this.curves.push(curve);
        this.currentPoint.set(x, y);
    };
    Path.prototype.quadraticCurveTo = function (aCPx, aCPy, aX, aY) {
        var curve = new QuadraticBezierCurve(this.currentPoint.clone(), new Vector2(aCPx, aCPy), new Vector2(aX, aY));
        this.curves.push(curve);
        this.currentPoint.set(aX, aY);
    };
    Path.prototype.bezierCurveTo = function (aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
        var curve = new CubicBezierCurve(this.currentPoint.clone(), new Vector2(aCP1x, aCP1y), new Vector2(aCP2x, aCP2y), new Vector2(aX, aY));
        this.curves.push(curve);
        this.currentPoint.set(aX, aY);
    };
    Path.prototype.splineThru = function (pts /*Array of Vector*/) {
        var npts = [this.currentPoint.clone()].concat(pts);
        var curve = new SplineCurve(npts);
        this.curves.push(curve);
        this.currentPoint.copy(pts[pts.length - 1]);
    };
    Path.prototype.arc = function (aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
        var x0 = this.currentPoint.x;
        var y0 = this.currentPoint.y;
        this.absarc(aX + x0, aY + y0, aRadius, aStartAngle, aEndAngle, aClockwise);
    };
    Path.prototype.absarc = function (aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
        this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
    };
    Path.prototype.ellipse = function (aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
        var x0 = this.currentPoint.x;
        var y0 = this.currentPoint.y;
        this.absellipse(aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
    };
    Path.prototype.absellipse = function (aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
        var curve = new EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
        if (this.curves.length > 0) {
            // if a previous curve is present, attempt to join
            var firstPoint = curve.getPoint(0);
            if (!firstPoint.equals(this.currentPoint)) {
                this.lineTo(firstPoint.x, firstPoint.y);
            }
        }
        this.curves.push(curve);
        var lastPoint = curve.getPoint(1);
        this.currentPoint.copy(lastPoint);
    };
    Path.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.currentPoint.copy(source.currentPoint);
        return this;
    };
    Path.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.currentPoint = this.currentPoint.toArray();
        return data;
    };
    Path.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.currentPoint.fromArray(json.currentPoint);
        return this;
    };
    return Path;
}(CurvePath));
export { Path };
(function (Path) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(CurvePath.Data));
    Path.Data = Data;
})(Path || (Path = {}));

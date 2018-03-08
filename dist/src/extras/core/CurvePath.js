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
import { Curve } from './Curve';
import * as Curves from '../curves/Curves';
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 **/
/**************************************************************
 *	Curved Path - a curve path is simply a array of connected
 *  curves, but retains the api of a curve
 **************************************************************/
var CurvePath = /** @class */ (function (_super) {
    __extends(CurvePath, _super);
    function CurvePath() {
        var _this = _super.call(this) || this;
        _this.type = 'CurvePath';
        _this.curves = [];
        _this.autoClose = false; // Automatically closes the path
        return _this;
    }
    CurvePath.prototype.add = function (curve) {
        this.curves.push(curve);
    };
    CurvePath.prototype.closePath = function () {
        // Add a line curve if start and end of lines are not connected
        var startPoint = this.curves[0].getPoint(0);
        var endPoint = this.curves[this.curves.length - 1].getPoint(1);
        if (!startPoint.equals(endPoint)) {
            this.curves.push(new Curves['LineCurve'](endPoint, startPoint));
        }
    };
    // To get accurate point with reference to
    // entire path distance at time t,
    // following has to be done:
    // 1. Length of each sub path have to be known
    // 2. Locate and identify type of curve
    // 3. Get t for the curve
    // 4. Return curve.getPointAt(t')
    CurvePath.prototype.getPoint = function (t) {
        var d = t * this.getLength();
        var curveLengths = this.getCurveLengths();
        var i = 0;
        // To think about boundaries points.
        while (i < curveLengths.length) {
            if (curveLengths[i] >= d) {
                var diff = curveLengths[i] - d;
                var curve = this.curves[i];
                var segmentLength = curve.getLength();
                var u = segmentLength === 0 ? 0 : 1 - diff / segmentLength;
                return curve.getPointAt(u);
            }
            i++;
        }
        return null;
        // loop where sum != 0, sum > d , sum+1 <d
    };
    // We cannot use the default THREE.Curve getPoint() with getLength() because in
    // THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
    // getPoint() depends on getLength
    CurvePath.prototype.getLength = function () {
        var lens = this.getCurveLengths();
        return lens[lens.length - 1];
    };
    // cacheLengths must be recalculated.
    CurvePath.prototype.updateArcLengths = function () {
        this.needsUpdate = true;
        this.cacheLengths = null;
        this.getCurveLengths();
    };
    // Compute lengths and cache them
    // We cannot overwrite getLengths() because UtoT mapping uses it.
    CurvePath.prototype.getCurveLengths = function () {
        // We use cache values if curves and cache array are same length
        if (this.cacheLengths && this.cacheLengths.length === this.curves.length) {
            return this.cacheLengths;
        }
        // Get length of sub-curve
        // Push sums into cached array
        var lengths = [], sums = 0;
        for (var i = 0, l = this.curves.length; i < l; i++) {
            sums += this.curves[i].getLength();
            lengths.push(sums);
        }
        this.cacheLengths = lengths;
        return lengths;
    };
    CurvePath.prototype.getSpacedPoints = function (divisions) {
        if (divisions === undefined)
            divisions = 40;
        var points = [];
        for (var i = 0; i <= divisions; i++) {
            points.push(this.getPoint(i / divisions));
        }
        if (this.autoClose) {
            points.push(points[0]);
        }
        return points;
    };
    CurvePath.prototype.getPoints = function (divisions) {
        divisions = divisions || 12;
        var points = [], last;
        for (var i = 0, curves = this.curves; i < curves.length; i++) {
            var curve = curves[i];
            var resolution = (curve && curve.isEllipseCurve) ? divisions * 2
                : (curve && curve.isLineCurve) ? 1
                    : (curve && curve.isSplineCurve) ? divisions * curve.points.length
                        : divisions;
            var pts = curve.getPoints(resolution);
            for (var j = 0; j < pts.length; j++) {
                var point = pts[j];
                if (last && last.equals(point))
                    continue; // ensures no consecutive points are duplicates
                points.push(point);
                last = point;
            }
        }
        if (this.autoClose && points.length > 1 && !points[points.length - 1].equals(points[0])) {
            points.push(points[0]);
        }
        return points;
    };
    CurvePath.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.curves = [];
        for (var i = 0, l = source.curves.length; i < l; i++) {
            var curve = source.curves[i];
            this.curves.push(curve.clone());
        }
        this.autoClose = source.autoClose;
        return this;
    };
    CurvePath.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.autoClose = this.autoClose;
        data.curves = [];
        for (var i = 0, l = this.curves.length; i < l; i++) {
            var curve = this.curves[i];
            data.curves.push(curve.toJSON());
        }
        return data;
    };
    CurvePath.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.autoClose = json.autoClose;
        this.curves = [];
        for (var i = 0, l = json.curves.length; i < l; i++) {
            var curve = json.curves[i];
            this.curves.push(new Curves[curve.type]().fromJSON(curve));
        }
        return this;
    };
    return CurvePath;
}(Curve));
export { CurvePath };
(function (CurvePath) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Curve.Data));
    CurvePath.Data = Data;
})(CurvePath || (CurvePath = {}));

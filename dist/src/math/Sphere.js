import { Box3 } from './Box3';
import { Vector3 } from './Vector3';
/**
 * @author bhouston / http://clara.io
 * @author mrdoob / http://mrdoob.com/
 */
var Sphere = /** @class */ (function () {
    function Sphere(center, radius) {
        if (radius === void 0) { radius = 0; }
        this.center = (center !== undefined) ? center : new Vector3();
        this.radius = radius;
    }
    Sphere.prototype.set = function (center, radius) {
        this.center.copy(center);
        this.radius = radius;
        return this;
    };
    Sphere.prototype.setFromPoints = function (points, optionalCenter) {
        var box = new Box3();
        var center = this.center;
        if (optionalCenter !== undefined) {
            center.copy(optionalCenter);
        }
        else {
            box.setFromPoints(points).getCenter(center);
        }
        var maxRadiusSq = 0;
        for (var i = 0, il = points.length; i < il; i++) {
            maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
        }
        this.radius = Math.sqrt(maxRadiusSq);
        return this;
    };
    Sphere.prototype.clone = function () {
        return new Sphere().copy(this);
    };
    Sphere.prototype.copy = function (sphere) {
        this.center.copy(sphere.center);
        this.radius = sphere.radius;
        return this;
    };
    Sphere.prototype.empty = function () {
        return (this.radius <= 0);
    };
    Sphere.prototype.containsPoint = function (point) {
        return (point.distanceToSquared(this.center) <= (this.radius * this.radius));
    };
    Sphere.prototype.distanceToPoint = function (point) {
        return (point.distanceTo(this.center) - this.radius);
    };
    Sphere.prototype.intersectsSphere = function (sphere) {
        var radiusSum = this.radius + sphere.radius;
        return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
    };
    Sphere.prototype.intersectsBox = function (box) {
        return box.intersectsSphere(this);
    };
    Sphere.prototype.intersectsPlane = function (plane) {
        return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
    };
    Sphere.prototype.clampPoint = function (point, optionalTarget) {
        var deltaLengthSq = this.center.distanceToSquared(point);
        var result = optionalTarget || new Vector3();
        result.copy(point);
        if (deltaLengthSq > (this.radius * this.radius)) {
            result.sub(this.center).normalize();
            result.multiplyScalar(this.radius).add(this.center);
        }
        return result;
    };
    Sphere.prototype.getBoundingBox = function (optionalTarget) {
        var box = optionalTarget || new Box3();
        box.set(this.center, this.center);
        box.expandByScalar(this.radius);
        return box;
    };
    Sphere.prototype.applyMatrix4 = function (matrix) {
        this.center.applyMatrix4(matrix);
        this.radius = this.radius * matrix.getMaxScaleOnAxis();
        return this;
    };
    Sphere.prototype.translate = function (offset) {
        this.center.add(offset);
        return this;
    };
    Sphere.prototype.equals = function (sphere) {
        return sphere.center.equals(this.center) && (sphere.radius === this.radius);
    };
    return Sphere;
}());
export { Sphere };

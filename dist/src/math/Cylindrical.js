/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Ref: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system
 *
 */
var Cylindrical = /** @class */ (function () {
    function Cylindrical(radius, theta, y) {
        if (radius === void 0) { radius = 1.0; }
        if (theta === void 0) { theta = 0; }
        if (y === void 0) { y = 0; }
        this.radius = radius; // distance from the origin to a point in the x-z plane
        this.theta = theta; // counterclockwise angle in the x-z plane measured in radians from the positive z-axis
        this.y = y; // height above the x-z plane
    }
    Cylindrical.prototype.set = function (radius, theta, y) {
        this.radius = radius;
        this.theta = theta;
        this.y = y;
        return this;
    };
    Cylindrical.prototype.clone = function () {
        return new Cylindrical().copy(this);
    };
    Cylindrical.prototype.copy = function (other) {
        this.radius = other.radius;
        this.theta = other.theta;
        this.y = other.y;
        return this;
    };
    Cylindrical.prototype.setFromVector3 = function (vec3) {
        this.radius = Math.sqrt(vec3.x * vec3.x + vec3.z * vec3.z);
        this.theta = Math.atan2(vec3.x, vec3.z);
        this.y = vec3.y;
        return this;
    };
    return Cylindrical;
}());
export { Cylindrical };

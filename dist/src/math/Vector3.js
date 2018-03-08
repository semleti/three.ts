import { _Math } from './Math';
import { Matrix4 } from './Matrix4';
import { Quaternion } from './Quaternion';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */
var Vector3 = /** @class */ (function () {
    function Vector3(x, y, z) {
        this.isVector3 = true;
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    Vector3.prototype.set = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    Vector3.prototype.setScalar = function (scalar) {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        return this;
    };
    Vector3.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Vector3.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Vector3.prototype.setZ = function (z) {
        this.z = z;
        return this;
    };
    Vector3.prototype.setComponent = function (index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default: throw new Error('index is out of range: ' + index);
        }
        return this;
    };
    Vector3.prototype.getComponent = function (index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            default: throw new Error('index is out of range: ' + index);
        }
    };
    Vector3.prototype.clone = function () {
        return new Vector3(this.x, this.y, this.z);
    };
    Vector3.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    };
    Vector3.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    };
    Vector3.prototype.addScalar = function (s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    };
    Vector3.prototype.addVectors = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    };
    Vector3.prototype.addScaledVector = function (v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;
    };
    Vector3.prototype.sub = function (v, w) {
        if (w !== undefined) {
            console.warn('THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
            return this.subVectors(v, w);
        }
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    };
    Vector3.prototype.subScalar = function (s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    };
    Vector3.prototype.subVectors = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    };
    Vector3.prototype.multiply = function (v, w) {
        if (w !== undefined) {
            console.warn('THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
            return this.multiplyVectors(v, w);
        }
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    };
    Vector3.prototype.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    };
    Vector3.prototype.multiplyVectors = function (a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    };
    Vector3.prototype.applyEuler = function (euler) {
        var quaternion = new Quaternion();
        if (!(euler && euler.isEuler)) {
            console.error('THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.');
        }
        return this.applyQuaternion(quaternion.setFromEuler(euler));
    };
    Vector3.prototype.applyAxisAngle = function () {
        var quaternion = new Quaternion();
        return function applyAxisAngle(axis, angle) {
            return this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
        };
    };
    Vector3.prototype.applyMatrix3 = function (m) {
        var x = this.x, y = this.y, z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;
        return this;
    };
    Vector3.prototype.applyMatrix4 = function (m) {
        var x = this.x, y = this.y, z = this.z;
        var e = m.elements;
        var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
        return this;
    };
    Vector3.prototype.applyQuaternion = function (q) {
        var x = this.x, y = this.y, z = this.z;
        var qx = q.x, qy = q.y, qz = q.z, qw = q.w;
        // calculate quat * vector
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;
        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    };
    Vector3.prototype.project = function (camera) {
        var matrix = new Matrix4();
        matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
        return this.applyMatrix4(matrix);
    };
    Vector3.prototype.unproject = function (camera) {
        var matrix = new Matrix4();
        matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
        return this.applyMatrix4(matrix);
    };
    Vector3.prototype.transformDirection = function (m) {
        // input: THREE.Matrix4 affine matrix
        // vector interpreted as a direction
        var x = this.x, y = this.y, z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        return this.normalize();
    };
    Vector3.prototype.divide = function (v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    };
    Vector3.prototype.divideScalar = function (scalar) {
        return this.multiplyScalar(1 / scalar);
    };
    Vector3.prototype.min = function (v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        return this;
    };
    Vector3.prototype.max = function (v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
    };
    Vector3.prototype.clamp = function (min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this;
    };
    Vector3.prototype.clampScalar = function (minVal, maxVal) {
        var min = new Vector3();
        var max = new Vector3();
        min.set(minVal, minVal, minVal);
        max.set(maxVal, maxVal, maxVal);
        return this.clamp(min, max);
    };
    Vector3.prototype.clampLength = function (min, max) {
        var length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    };
    Vector3.prototype.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    };
    Vector3.prototype.ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    };
    Vector3.prototype.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    };
    Vector3.prototype.roundToZero = function () {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
        return this;
    };
    Vector3.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    Vector3.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };
    // TODO lengthSquared?
    Vector3.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };
    Vector3.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector3.prototype.manhattanLength = function () {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    };
    Vector3.prototype.normalize = function () {
        return this.divideScalar(this.length() || 1);
    };
    Vector3.prototype.setLength = function (length) {
        return this.normalize().multiplyScalar(length);
    };
    Vector3.prototype.lerp = function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    };
    Vector3.prototype.lerpVectors = function (v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
    };
    Vector3.prototype.cross = function (v, w) {
        if (w !== undefined) {
            console.warn('THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
            return this.crossVectors(v, w);
        }
        return this.crossVectors(this, v);
    };
    Vector3.prototype.crossVectors = function (a, b) {
        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    };
    Vector3.prototype.projectOnVector = function (vector) {
        var scalar = vector.dot(this) / vector.lengthSq();
        return this.copy(vector).multiplyScalar(scalar);
    };
    Vector3.prototype.projectOnPlane = function (planeNormal) {
        var v1 = new Vector3();
        v1.copy(this).projectOnVector(planeNormal);
        return this.sub(v1);
    };
    // reflect incident vector off plane orthogonal to normal
    // normal is assumed to have unit length
    Vector3.prototype.reflect = function (normal) {
        var v1 = new Vector3();
        return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
    };
    Vector3.prototype.angleTo = function (v) {
        var theta = this.dot(v) / (Math.sqrt(this.lengthSq() * v.lengthSq()));
        // clamp, to handle numerical problems
        return Math.acos(_Math.clamp(theta, -1, 1));
    };
    Vector3.prototype.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };
    Vector3.prototype.distanceToSquared = function (v) {
        var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    };
    Vector3.prototype.manhattanDistanceTo = function (v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
    };
    Vector3.prototype.setFromSpherical = function (s) {
        var sinPhiRadius = Math.sin(s.phi) * s.radius;
        this.x = sinPhiRadius * Math.sin(s.theta);
        this.y = Math.cos(s.phi) * s.radius;
        this.z = sinPhiRadius * Math.cos(s.theta);
        return this;
    };
    Vector3.prototype.setFromCylindrical = function (c) {
        this.x = c.radius * Math.sin(c.theta);
        this.y = c.y;
        this.z = c.radius * Math.cos(c.theta);
        return this;
    };
    Vector3.prototype.setFromMatrixPosition = function (m) {
        var e = m.elements;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
    };
    Vector3.prototype.setFromMatrixScale = function (m) {
        var sx = this.setFromMatrixColumn(m, 0).length();
        var sy = this.setFromMatrixColumn(m, 1).length();
        var sz = this.setFromMatrixColumn(m, 2).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    };
    Vector3.prototype.setFromMatrixColumn = function (m, index) {
        return this.fromArray(m.elements, index * 4);
    };
    Vector3.prototype.equals = function (v) {
        return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
    };
    Vector3.prototype.fromArray = function (array, offset) {
        if (offset === undefined)
            offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    };
    Vector3.prototype.toArray = function (array, offset) {
        if (array === undefined)
            array = [];
        if (offset === undefined)
            offset = 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        return array;
    };
    Vector3.prototype.fromBufferAttribute = function (attribute, index, offset) {
        if (offset !== undefined) {
            console.warn('THREE.Vector3: offset has been removed from .fromBufferAttribute().');
        }
        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        this.z = attribute.getZ(index);
        return this;
    };
    return Vector3;
}());
export { Vector3 };

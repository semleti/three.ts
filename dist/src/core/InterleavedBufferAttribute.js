import { _Math } from '../math/Math';
/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */
var InterleavedBufferAttribute = /** @class */ (function () {
    function InterleavedBufferAttribute(interleavedBuffer, itemSize, offset, normalized) {
        this.uuid = _Math.generateUUID();
        this.isInterleavedBufferAttribute = true;
        this.data = interleavedBuffer;
        this.itemSize = itemSize;
        this.offset = offset;
        this.normalized = normalized === true;
    }
    Object.defineProperty(InterleavedBufferAttribute.prototype, "count", {
        get: function () {
            return this.data.count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InterleavedBufferAttribute.prototype, "array", {
        get: function () {
            return this.data.array;
        },
        enumerable: true,
        configurable: true
    });
    InterleavedBufferAttribute.prototype.setX = function (index, x) {
        this.data.array[index * this.data.stride + this.offset] = x;
        return this;
    };
    InterleavedBufferAttribute.prototype.setY = function (index, y) {
        this.data.array[index * this.data.stride + this.offset + 1] = y;
        return this;
    };
    InterleavedBufferAttribute.prototype.setZ = function (index, z) {
        this.data.array[index * this.data.stride + this.offset + 2] = z;
        return this;
    };
    InterleavedBufferAttribute.prototype.setW = function (index, w) {
        this.data.array[index * this.data.stride + this.offset + 3] = w;
        return this;
    };
    InterleavedBufferAttribute.prototype.getX = function (index) {
        return this.data.array[index * this.data.stride + this.offset];
    };
    InterleavedBufferAttribute.prototype.getY = function (index) {
        return this.data.array[index * this.data.stride + this.offset + 1];
    };
    InterleavedBufferAttribute.prototype.getZ = function (index) {
        return this.data.array[index * this.data.stride + this.offset + 2];
    };
    InterleavedBufferAttribute.prototype.getW = function (index) {
        return this.data.array[index * this.data.stride + this.offset + 3];
    };
    InterleavedBufferAttribute.prototype.setXY = function (index, x, y) {
        index = index * this.data.stride + this.offset;
        this.data.array[index + 0] = x;
        this.data.array[index + 1] = y;
        return this;
    };
    InterleavedBufferAttribute.prototype.setXYZ = function (index, x, y, z) {
        index = index * this.data.stride + this.offset;
        this.data.array[index + 0] = x;
        this.data.array[index + 1] = y;
        this.data.array[index + 2] = z;
        return this;
    };
    InterleavedBufferAttribute.prototype.setXYZW = function (index, x, y, z, w) {
        index = index * this.data.stride + this.offset;
        this.data.array[index + 0] = x;
        this.data.array[index + 1] = y;
        this.data.array[index + 2] = z;
        this.data.array[index + 3] = w;
        return this;
    };
    return InterleavedBufferAttribute;
}());
export { InterleavedBufferAttribute };

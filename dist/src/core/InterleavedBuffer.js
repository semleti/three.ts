import { _Math } from '../math/Math';
/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */
var InterleavedBuffer = /** @class */ (function () {
    function InterleavedBuffer(array, stride) {
        this.uuid = _Math.generateUUID();
        this.dynamic = false;
        this.updateRange = { offset: 0, count: -1 };
        this.version = 0;
        this.isInterleavedBuffer = true;
        this.onUploadCallback = function () { };
        this.array = array;
        this.stride = stride;
        this.count = array !== undefined ? array.length / stride : 0;
    }
    Object.defineProperty(InterleavedBuffer.prototype, "needsUpdate", {
        set: function (value) {
            if (value === true)
                this.version++;
        },
        enumerable: true,
        configurable: true
    });
    InterleavedBuffer.prototype.setArray = function (array) {
        if (Array.isArray(array)) {
            throw new TypeError('THREE.BufferAttribute: array should be a Typed Array.');
        }
        this.count = array !== undefined ? array.length / this.stride : 0;
        this.array = array;
    };
    InterleavedBuffer.prototype.setDynamic = function (value) {
        this.dynamic = value;
        return this;
    };
    InterleavedBuffer.prototype.copy = function (source) {
        this.array = new source.array.constructor(source.array);
        this.count = source.count;
        this.stride = source.stride;
        this.dynamic = source.dynamic;
        return this;
    };
    InterleavedBuffer.prototype.copyAt = function (index1, attribute, index2) {
        index1 *= this.stride;
        index2 *= attribute.stride;
        for (var i = 0, l = this.stride; i < l; i++) {
            this.array[index1 + i] = attribute.array[index2 + i];
        }
        return this;
    };
    InterleavedBuffer.prototype.set = function (value, offset) {
        if (offset === undefined)
            offset = 0;
        this.array.set(value, offset);
        return this;
    };
    InterleavedBuffer.prototype.clone = function () {
        return new InterleavedBuffer().copy(this);
    };
    InterleavedBuffer.prototype.onUpload = function (callback) {
        this.onUploadCallback = callback;
        return this;
    };
    return InterleavedBuffer;
}());
export { InterleavedBuffer };

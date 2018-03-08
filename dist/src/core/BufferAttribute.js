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
import { Vector4 } from '../math/Vector4';
import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';
import { Color } from '../math/Color';
import { _Math } from '../math/Math';
/**
 * @author mrdoob / http://mrdoob.com/
 */
var BufferAttribute = /** @class */ (function () {
    function BufferAttribute(array, itemSize, normalized) {
        this.uuid = _Math.generateUUID();
        this.name = '';
        this.dynamic = false;
        this.updateRange = { offset: 0, count: -1 };
        this.version = 0;
        this.isBufferAttribute = true;
        this.onUploadCallback = function () { };
        if (Array.isArray(array)) {
            throw new TypeError('THREE.BufferAttribute: array should be a Typed Array.');
        }
        this.array = array;
        this.itemSize = itemSize;
        this.count = array !== undefined ? array.length / itemSize : 0;
        this.normalized = normalized === true;
    }
    Object.defineProperty(BufferAttribute.prototype, "needsUpdate", {
        set: function (value) {
            if (value === true)
                this.version++;
        },
        enumerable: true,
        configurable: true
    });
    BufferAttribute.prototype.setArray = function (array) {
        if (Array.isArray(array)) {
            throw new TypeError('THREE.BufferAttribute: array should be a Typed Array.');
        }
        this.count = array !== undefined ? array.length / this.itemSize : 0;
        this.array = array;
    };
    BufferAttribute.prototype.setDynamic = function (value) {
        this.dynamic = value;
        return this;
    };
    BufferAttribute.prototype.copy = function (source) {
        this.array = new source.array.constructor(source.array);
        this.itemSize = source.itemSize;
        this.count = source.count;
        this.normalized = source.normalized;
        this.dynamic = source.dynamic;
        return this;
    };
    BufferAttribute.prototype.copyAt = function (index1, attribute, index2) {
        index1 *= this.itemSize;
        index2 *= attribute.itemSize;
        for (var i = 0, l = this.itemSize; i < l; i++) {
            this.array[index1 + i] = attribute.array[index2 + i];
        }
        return this;
    };
    BufferAttribute.prototype.copyArray = function (array) {
        this.array.set(array);
        return this;
    };
    BufferAttribute.prototype.copyColorsArray = function (colors) {
        var array = this.array, offset = 0;
        for (var i = 0, l = colors.length; i < l; i++) {
            var color = colors[i];
            if (color === undefined) {
                console.warn('THREE.BufferAttribute.copyColorsArray(): color is undefined', i);
                color = new Color();
            }
            array[offset++] = color.r;
            array[offset++] = color.g;
            array[offset++] = color.b;
        }
        return this;
    };
    BufferAttribute.prototype.copyIndicesArray = function (indices) {
        var array = this.array, offset = 0;
        for (var i = 0, l = indices.length; i < l; i++) {
            var index = indices[i];
            array[offset++] = index.a;
            array[offset++] = index.b;
            array[offset++] = index.c;
        }
        return this;
    };
    BufferAttribute.prototype.copyVector2sArray = function (vectors) {
        var array = this.array, offset = 0;
        for (var i = 0, l = vectors.length; i < l; i++) {
            var vector = vectors[i];
            if (vector === undefined) {
                console.warn('THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i);
                vector = new Vector2();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
        }
        return this;
    };
    BufferAttribute.prototype.copyVector3sArray = function (vectors) {
        var array = this.array, offset = 0;
        for (var i = 0, l = vectors.length; i < l; i++) {
            var vector = vectors[i];
            if (vector === undefined) {
                console.warn('THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i);
                vector = new Vector3();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
        }
        return this;
    };
    BufferAttribute.prototype.copyVector4sArray = function (vectors) {
        var array = this.array, offset = 0;
        for (var i = 0, l = vectors.length; i < l; i++) {
            var vector = vectors[i];
            if (vector === undefined) {
                console.warn('THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i);
                vector = new Vector4();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
            array[offset++] = vector.w;
        }
        return this;
    };
    BufferAttribute.prototype.set = function (value, offset) {
        if (offset === undefined)
            offset = 0;
        this.array.set(value, offset);
        return this;
    };
    BufferAttribute.prototype.getX = function (index) {
        return this.array[index * this.itemSize];
    };
    BufferAttribute.prototype.setX = function (index, x) {
        this.array[index * this.itemSize] = x;
        return this;
    };
    BufferAttribute.prototype.getY = function (index) {
        return this.array[index * this.itemSize + 1];
    };
    BufferAttribute.prototype.setY = function (index, y) {
        this.array[index * this.itemSize + 1] = y;
        return this;
    };
    BufferAttribute.prototype.getZ = function (index) {
        return this.array[index * this.itemSize + 2];
    };
    BufferAttribute.prototype.setZ = function (index, z) {
        this.array[index * this.itemSize + 2] = z;
        return this;
    };
    BufferAttribute.prototype.getW = function (index) {
        return this.array[index * this.itemSize + 3];
    };
    BufferAttribute.prototype.setW = function (index, w) {
        this.array[index * this.itemSize + 3] = w;
        return this;
    };
    BufferAttribute.prototype.setXY = function (index, x, y) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        return this;
    };
    BufferAttribute.prototype.setXYZ = function (index, x, y, z) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        return this;
    };
    BufferAttribute.prototype.setXYZW = function (index, x, y, z, w) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        this.array[index + 3] = w;
        return this;
    };
    BufferAttribute.prototype.onUpload = function (callback) {
        this.onUploadCallback = callback;
        return this;
    };
    BufferAttribute.prototype.clone = function () {
        return new BufferAttribute(this.array, this.itemSize).copy(this);
    };
    return BufferAttribute;
}());
export { BufferAttribute };
//
var Int8BufferAttribute = /** @class */ (function (_super) {
    __extends(Int8BufferAttribute, _super);
    function Int8BufferAttribute(array, itemSize, normalized) {
        return _super.call(this, new Int8Array(array), itemSize, normalized) || this;
    }
    return Int8BufferAttribute;
}(BufferAttribute));
export { Int8BufferAttribute };
var Uint8BufferAttribute = /** @class */ (function (_super) {
    __extends(Uint8BufferAttribute, _super);
    function Uint8BufferAttribute(array, itemSize, normalized) {
        return _super.call(this, new Uint8Array(array), itemSize, normalized) || this;
    }
    return Uint8BufferAttribute;
}(BufferAttribute));
export { Uint8BufferAttribute };
var Uint8ClampedBufferAttribute = /** @class */ (function (_super) {
    __extends(Uint8ClampedBufferAttribute, _super);
    function Uint8ClampedBufferAttribute(array, itemSize, normalized) {
        return _super.call(this, new Uint8ClampedArray(array), itemSize, normalized) || this;
    }
    return Uint8ClampedBufferAttribute;
}(BufferAttribute));
export { Uint8ClampedBufferAttribute };
var Int16BufferAttribute = /** @class */ (function (_super) {
    __extends(Int16BufferAttribute, _super);
    function Int16BufferAttribute(array, itemSize, normalized) {
        return _super.call(this, new Int16Array(array), itemSize, normalized) || this;
    }
    return Int16BufferAttribute;
}(BufferAttribute));
export { Int16BufferAttribute };
var Uint16BufferAttribute = /** @class */ (function (_super) {
    __extends(Uint16BufferAttribute, _super);
    function Uint16BufferAttribute(array, itemSize, normalized) {
        return _super.call(this, new Uint16Array(array), itemSize, normalized) || this;
    }
    return Uint16BufferAttribute;
}(BufferAttribute));
export { Uint16BufferAttribute };
var Int32BufferAttribute = /** @class */ (function (_super) {
    __extends(Int32BufferAttribute, _super);
    function Int32BufferAttribute(array, itemSize, normalized) {
        return _super.call(this, new Int32Array(array), itemSize, normalized) || this;
    }
    return Int32BufferAttribute;
}(BufferAttribute));
export { Int32BufferAttribute };
var Uint32BufferAttribute = /** @class */ (function (_super) {
    __extends(Uint32BufferAttribute, _super);
    function Uint32BufferAttribute(array, itemSize, normalized) {
        return _super.call(this, new Uint32Array(array), itemSize, normalized) || this;
    }
    return Uint32BufferAttribute;
}(BufferAttribute));
export { Uint32BufferAttribute };
var Float32BufferAttribute = /** @class */ (function (_super) {
    __extends(Float32BufferAttribute, _super);
    function Float32BufferAttribute(array, itemSize, normalized) {
        return _super.call(this, new Float32Array(array), itemSize, normalized) || this;
    }
    return Float32BufferAttribute;
}(BufferAttribute));
export { Float32BufferAttribute };
var Float64BufferAttribute = /** @class */ (function (_super) {
    __extends(Float64BufferAttribute, _super);
    function Float64BufferAttribute(array, itemSize, normalized) {
        return _super.call(this, new Float64Array(array), itemSize, normalized) || this;
    }
    return Float64BufferAttribute;
}(BufferAttribute));
export { Float64BufferAttribute };

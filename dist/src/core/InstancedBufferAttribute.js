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
import { BufferAttribute } from './BufferAttribute';
/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */
var InstancedBufferAttribute = /** @class */ (function (_super) {
    __extends(InstancedBufferAttribute, _super);
    function InstancedBufferAttribute(array, itemSize, meshPerAttribute) {
        var _this = _super.call(this, array, itemSize) || this;
        _this.isInstancedBufferAttribute = true;
        _this.meshPerAttribute = meshPerAttribute || 1;
        return _this;
    }
    InstancedBufferAttribute.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.meshPerAttribute = source.meshPerAttribute;
        return this;
    };
    return InstancedBufferAttribute;
}(BufferAttribute));
export { InstancedBufferAttribute };

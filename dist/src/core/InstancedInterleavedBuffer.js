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
import { InterleavedBuffer } from './InterleavedBuffer';
/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */
var InstancedInterleavedBuffer = /** @class */ (function (_super) {
    __extends(InstancedInterleavedBuffer, _super);
    function InstancedInterleavedBuffer(array, stride, meshPerAttribute) {
        var _this = _super.call(this, array, stride) || this;
        _this.isInstancedInterleavedBuffer = true;
        _this.meshPerAttribute = meshPerAttribute || 1;
        return _this;
    }
    InstancedInterleavedBuffer.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.meshPerAttribute = source.meshPerAttribute;
        return this;
    };
    return InstancedInterleavedBuffer;
}(InterleavedBuffer));
export { InstancedInterleavedBuffer };

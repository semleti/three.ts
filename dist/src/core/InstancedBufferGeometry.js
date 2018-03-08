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
import { BufferGeometry } from './BufferGeometry';
/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */
var InstancedBufferGeometry = /** @class */ (function (_super) {
    __extends(InstancedBufferGeometry, _super);
    function InstancedBufferGeometry() {
        var _this = _super.call(this) || this;
        _this.type = 'InstancedBufferGeometry';
        _this.isInstancedBufferGeometry = true;
        _this.maxInstancedCount = undefined;
        return _this;
    }
    InstancedBufferGeometry.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.maxInstancedCount = source.maxInstancedCount;
        return this;
    };
    InstancedBufferGeometry.prototype.clone = function () {
        return new InstancedBufferGeometry().copy(this);
    };
    return InstancedBufferGeometry;
}(BufferGeometry));
export { InstancedBufferGeometry };

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
import { Object3D } from '../../core/Object3D';
/**
 * @author alteredq / http://alteredqualia.com/
 */
var ImmediateRenderObject = /** @class */ (function (_super) {
    __extends(ImmediateRenderObject, _super);
    function ImmediateRenderObject(material) {
        var _this = _super.call(this) || this;
        _this.isImmediateRenderObject = true;
        _this.material = material;
        _this.render = function () { };
        return _this;
    }
    ImmediateRenderObject.prototype.clone = function () {
        return new ImmediateRenderObject(this.material).copy(this);
    };
    ImmediateRenderObject.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    return ImmediateRenderObject;
}(Object3D));
export { ImmediateRenderObject };

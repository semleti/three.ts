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
import { Object3D } from '../core/Object3D';
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */
var Bone = /** @class */ (function (_super) {
    __extends(Bone, _super);
    function Bone() {
        var _this = _super.call(this) || this;
        _this.type = 'Bone';
        _this.isBone = true;
        return _this;
    }
    Bone.prototype.clone = function () {
        return new Bone().copy(this);
    };
    Bone.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    return Bone;
}(Object3D));
export { Bone };

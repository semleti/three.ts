/**
 * @author mrdoob / http://mrdoob.com/
 */
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
import { PerspectiveCamera } from './PerspectiveCamera';
var ArrayCamera = /** @class */ (function (_super) {
    __extends(ArrayCamera, _super);
    function ArrayCamera(array) {
        var _this = _super.call(this) || this;
        _this.isArrayCamera = true;
        _this.cameras = array || [];
        return _this;
    }
    return ArrayCamera;
}(PerspectiveCamera));
export { ArrayCamera };

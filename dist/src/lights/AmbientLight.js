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
import { Light } from './Light';
/**
 * @author mrdoob / http://mrdoob.com/
 */
var AmbientLight = /** @class */ (function (_super) {
    __extends(AmbientLight, _super);
    function AmbientLight(color, intensity) {
        var _this = _super.call(this, color, intensity) || this;
        _this.type = 'AmbientLight';
        _this.isAmbientLight = true;
        _this.castShadow = undefined;
        return _this;
    }
    return AmbientLight;
}(Light));
export { AmbientLight };

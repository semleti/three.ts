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
import { Color } from '../math/Color';
import { Object3D } from '../core/Object3D';
/**
 * @author alteredq / http://alteredqualia.com/
 */
var HemisphereLight = /** @class */ (function (_super) {
    __extends(HemisphereLight, _super);
    function HemisphereLight(skyColor, groundColor, intensity) {
        var _this = _super.call(this, skyColor, intensity) || this;
        _this.type = 'HemisphereLight';
        _this.isHemisphereLight = true;
        _this.castShadow = undefined;
        _this.position.copy(Object3D.DefaultUp);
        _this.updateMatrix();
        _this.groundColor = new Color(groundColor);
        return _this;
    }
    HemisphereLight.prototype.clone = function () {
        return new HemisphereLight(this.color, this.groundColor, this.intensity).copy(this);
    };
    HemisphereLight.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.groundColor.copy(source.groundColor);
        return this;
    };
    return HemisphereLight;
}(Light));
export { HemisphereLight };

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
import { DirectionalLightShadow } from './DirectionalLightShadow';
import { Object3D } from '../core/Object3D';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
var DirectionalLight = /** @class */ (function (_super) {
    __extends(DirectionalLight, _super);
    function DirectionalLight(color, intensity) {
        var _this = _super.call(this, color, intensity) || this;
        _this.type = 'DirectionalLight';
        _this.isDirectionalLight = true;
        _this.position.copy(Object3D.DefaultUp);
        _this.updateMatrix();
        _this.target = new Object3D();
        _this.shadow = new DirectionalLightShadow();
        return _this;
    }
    DirectionalLight.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.target = source.target.clone();
        this.shadow = source.shadow.clone();
        return this;
    };
    return DirectionalLight;
}(Light));
export { DirectionalLight };

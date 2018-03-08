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
import { LightShadow } from './LightShadow';
import { OrthographicCamera } from '../cameras/OrthographicCamera';
/**
 * @author mrdoob / http://mrdoob.com/
 */
var DirectionalLightShadow = /** @class */ (function (_super) {
    __extends(DirectionalLightShadow, _super);
    function DirectionalLightShadow() {
        return _super.call(this, new OrthographicCamera(-5, 5, 5, -5, 0.5, 500)) || this;
    }
    return DirectionalLightShadow;
}(LightShadow));
export { DirectionalLightShadow };

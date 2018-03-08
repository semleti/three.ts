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
import { Line } from './Line';
/**
 * @author mgreter / http://github.com/mgreter
 */
var LineLoop = /** @class */ (function (_super) {
    __extends(LineLoop, _super);
    function LineLoop(geometry, material) {
        var _this = _super.call(this, geometry, material) || this;
        _this.type = 'LineLoop';
        _this.isLineLoop = true;
        return _this;
    }
    return LineLoop;
}(Line));
export { LineLoop };

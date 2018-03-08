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
 * @author abelnation / http://github.com/abelnation
 */
var RectAreaLight = /** @class */ (function (_super) {
    __extends(RectAreaLight, _super);
    function RectAreaLight(color, intensity, width, height) {
        var _this = _super.call(this, color, intensity) || this;
        _this.type = 'RectAreaLight';
        _this.isRectAreaLight = true;
        _this.width = (width !== undefined) ? width : 10;
        _this.height = (height !== undefined) ? height : 10;
        return _this;
    }
    RectAreaLight.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.width = source.width;
        this.height = source.height;
        return this;
    };
    RectAreaLight.prototype.toJSON = function (meta) {
        var data = _super.prototype.toJSON.call(this, meta);
        data.object.width = this.width;
        data.object.height = this.height;
        return data;
    };
    return RectAreaLight;
}(Light));
export { RectAreaLight };
(function (RectAreaLight) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Light.Data));
    RectAreaLight.Data = Data;
    var Obj = /** @class */ (function (_super) {
        __extends(Obj, _super);
        function Obj() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Obj;
    }(Light.Obj));
    RectAreaLight.Obj = Obj;
})(RectAreaLight || (RectAreaLight = {}));

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
import { Color } from '../math/Color';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
var Light = /** @class */ (function (_super) {
    __extends(Light, _super);
    function Light(color, intensity) {
        var _this = _super.call(this) || this;
        _this.type = 'Light';
        _this.isLight = true;
        _this.color = new Color(color);
        _this.intensity = intensity !== undefined ? intensity : 1;
        _this.receiveShadow = undefined;
        return _this;
    }
    Light.prototype.clone = function () {
        return new Light(this.color, this.intensity).copy(this);
    };
    Light.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.intensity = source.intensity;
        return this;
    };
    Light.prototype.toJSON = function (meta) {
        var data = _super.prototype.toJSON.call(this, meta);
        data.object.color = this.color.getHex();
        data.object.intensity = this.intensity;
        if (this.groundColor !== undefined)
            data.object.groundColor = this.groundColor.getHex();
        if (this.distance !== undefined)
            data.object.distance = this.distance;
        if (this.angle !== undefined)
            data.object.angle = this.angle;
        if (this.decay !== undefined)
            data.object.decay = this.decay;
        if (this.penumbra !== undefined)
            data.object.penumbra = this.penumbra;
        if (this.shadow !== undefined)
            data.object.shadow = this.shadow.toJSON();
        return data;
    };
    return Light;
}(Object3D));
export { Light };
(function (Light) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Object3D.Data));
    Light.Data = Data;
    var Obj = /** @class */ (function (_super) {
        __extends(Obj, _super);
        function Obj() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Obj;
    }(Object3D.Obj));
    Light.Obj = Obj;
})(Light || (Light = {}));

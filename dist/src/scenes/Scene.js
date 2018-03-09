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
 * @author mrdoob / http://mrdoob.com/
 */
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super.call(this) || this;
        _this.type = 'Scene';
        _this.background = null;
        _this.fog = null;
        _this.overrideMaterial = null;
        _this.autoUpdate = true; // checked by the renderer
        return _this;
    }
    Scene.prototype.clone = function () {
        return new Scene().copy(this);
    };
    Scene.prototype.copy = function (source, recursive) {
        _super.prototype.copy.call(this, source, recursive);
        if (source.background !== null)
            this.background = source.background.clone();
        if (source.fog !== null)
            this.fog = source.fog.clone();
        if (source.overrideMaterial !== null)
            this.overrideMaterial = source.overrideMaterial.clone();
        this.autoUpdate = source.autoUpdate;
        this.matrixAutoUpdate = source.matrixAutoUpdate;
        return this;
    };
    Scene.prototype.toJSON = function (meta) {
        var data = _super.prototype.toJSON.call(this, meta);
        if (this.background !== null)
            data.object.background = this.background.toJSON(meta);
        if (this.fog !== null)
            data.object.fog = this.fog.toJSON();
        return data;
    };
    return Scene;
}(Object3D));
export { Scene };
(function (Scene) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Object3D.Data));
    Scene.Data = Data;
    var Obj = /** @class */ (function (_super) {
        __extends(Obj, _super);
        function Obj() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Obj;
    }(Object3D.Obj));
    Scene.Obj = Obj;
})(Scene || (Scene = {}));

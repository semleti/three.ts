import { Matrix4 } from '../math/Matrix4';
import { Vector2 } from '../math/Vector2';
/**
 * @author mrdoob / http://mrdoob.com/
 */
var LightShadow = /** @class */ (function () {
    function LightShadow(camera) {
        this.bias = 0;
        this.radius = 1;
        this.mapSize = new Vector2(512, 512);
        this.matrix = new Matrix4();
        this.map = null;
        this.camera = camera;
    }
    LightShadow.prototype.copy = function (source) {
        this.camera = source.camera.clone();
        this.bias = source.bias;
        this.radius = source.radius;
        this.mapSize.copy(source.mapSize);
        return this;
    };
    LightShadow.prototype.clone = function () {
        return new LightShadow().copy(this);
    };
    LightShadow.prototype.toJSON = function () {
        var object = new LightShadow.Data();
        if (this.bias !== 0)
            object.bias = this.bias;
        if (this.radius !== 1)
            object.radius = this.radius;
        if (this.mapSize.x !== 512 || this.mapSize.y !== 512)
            object.mapSize = this.mapSize.toArray();
        object.camera = this.camera.toJSON(null).object;
        delete object.camera.matrix;
        return object;
    };
    return LightShadow;
}());
export { LightShadow };
(function (LightShadow) {
    var Data = /** @class */ (function () {
        function Data() {
        }
        return Data;
    }());
    LightShadow.Data = Data;
})(LightShadow || (LightShadow = {}));

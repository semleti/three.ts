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
import { Vector3 } from '../math/Vector3';
import { Object3D } from '../core/Object3D';
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */
var LOD = /** @class */ (function (_super) {
    __extends(LOD, _super);
    function LOD() {
        var _this = _super.call(this) || this;
        _this.type = 'LOD';
        _this.levels = [];
        return _this;
    }
    LOD.prototype.clone = function () {
        return new LOD().copy(this);
    };
    LOD.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source, false);
        var levels = source.levels;
        this.l = levels.length;
        for (var i = 0; i < this.l; i++) {
            var level = levels[i];
            this.addLevel(level.object.clone(), level.distance);
        }
        return this;
    };
    LOD.prototype.addLevel = function (object, distance) {
        if (distance === undefined)
            distance = 0;
        distance = Math.abs(distance);
        var levels = this.levels;
        var l = 0;
        for (l = 0; l < levels.length; l++) {
            if (distance < levels[l].distance) {
                break;
            }
        }
        levels.splice(l, 0, { distance: distance, object: object });
        this.add(object);
    };
    LOD.prototype.getObjectForDistance = function (distance) {
        var levels = this.levels;
        var i = 1;
        for (i = 1, this.l = levels.length; i < this.l; i++) {
            if (distance < levels[i].distance) {
                break;
            }
        }
        return levels[i - 1].object;
    };
    LOD.prototype.raycast = function (raycaster, intersects) {
        var matrixPosition = new Vector3();
        matrixPosition.setFromMatrixPosition(this.matrixWorld);
        var distance = raycaster.ray.origin.distanceTo(matrixPosition);
        return this.getObjectForDistance(distance).raycast(raycaster, intersects);
    };
    LOD.prototype.update = function (camera) {
        var v1 = new Vector3();
        var v2 = new Vector3();
        var levels = this.levels;
        if (levels.length > 1) {
            v1.setFromMatrixPosition(camera.matrixWorld);
            v2.setFromMatrixPosition(this.matrixWorld);
            var distance = v1.distanceTo(v2);
            levels[0].object.visible = true;
            var i = 1;
            for (i = 1, this.l = levels.length; i < this.l; i++) {
                if (distance >= levels[i].distance) {
                    levels[i - 1].object.visible = false;
                    levels[i].object.visible = true;
                }
                else {
                    break;
                }
            }
            for (; i < this.l; i++) {
                levels[i].object.visible = false;
            }
        }
    };
    LOD.prototype.toJSON = function (meta) {
        var data = _super.prototype.toJSON.call(this, meta);
        data.object.levels = [];
        var levels = this.levels;
        for (var i = 0, l = levels.length; i < l; i++) {
            var level = levels[i];
            data.object.levels.push({
                object: level.object.uuid,
                distance: level.distance
            });
        }
        return data;
    };
    return LOD;
}(Object3D));
export { LOD };
(function (LOD) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Object3D.Data));
    LOD.Data = Data;
    var Obj = /** @class */ (function (_super) {
        __extends(Obj, _super);
        function Obj() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Obj;
    }(Object3D.Obj));
    LOD.Obj = Obj;
})(LOD || (LOD = {}));

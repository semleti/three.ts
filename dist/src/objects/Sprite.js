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
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Object3D } from '../core/Object3D';
import { SpriteMaterial } from '../materials/SpriteMaterial';
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(material) {
        var _this = _super.call(this) || this;
        _this.type = 'Sprite';
        _this.isSprite = true;
        _this.material = (material !== undefined) ? material : new SpriteMaterial();
        _this.center = new Vector2(0.5, 0.5);
        return _this;
    }
    Sprite.prototype.raycast = function (raycaster, intersects) {
        var intersectPoint = new Vector3();
        var worldPosition = new Vector3();
        var worldScale = new Vector3();
        worldPosition.setFromMatrixPosition(this.matrixWorld);
        raycaster.ray.closestPointToPoint(worldPosition, intersectPoint);
        worldScale.setFromMatrixScale(this.matrixWorld);
        var guessSizeSq = worldScale.x * worldScale.y / 4;
        if (worldPosition.distanceToSquared(intersectPoint) > guessSizeSq)
            return;
        var distance = raycaster.ray.origin.distanceTo(intersectPoint);
        if (distance < raycaster.near || distance > raycaster.far)
            return;
        intersects.push({
            distance: distance,
            point: intersectPoint.clone(),
            face: null,
            object: this
        });
    };
    Sprite.prototype.clone = function () {
        return new Sprite(this.material).copy(this);
    };
    Sprite.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        if (source.center !== undefined)
            this.center.copy(source.center);
        return this;
    };
    return Sprite;
}(Object3D));
export { Sprite };

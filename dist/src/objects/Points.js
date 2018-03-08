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
import { Sphere } from '../math/Sphere';
import { Ray } from '../math/Ray';
import { Matrix4 } from '../math/Matrix4';
import { Object3D } from '../core/Object3D';
import { Vector3 } from '../math/Vector3';
import { PointsMaterial } from '../materials/PointsMaterial';
import { BufferGeometry } from '../core/BufferGeometry';
/**
 * @author alteredq / http://alteredqualia.com/
 */
var Points = /** @class */ (function (_super) {
    __extends(Points, _super);
    function Points(geometry, material) {
        var _this = _super.call(this) || this;
        _this.type = 'Points';
        _this.isPoints = true;
        _this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
        _this.material = material !== undefined ? material : new PointsMaterial({ color: Math.random() * 0xffffff });
        return _this;
    }
    Points.prototype.raycast = function (raycaster, intersects) {
        var inverseMatrix = new Matrix4();
        var ray = new Ray();
        var sphere = new Sphere();
        var object = this;
        var geometry = this.geometry;
        var matrixWorld = this.matrixWorld;
        var threshold = raycaster.params.Points.threshold;
        // Checking boundingSphere distance to ray
        if (geometry.boundingSphere === null)
            geometry.computeBoundingSphere();
        sphere.copy(geometry.boundingSphere);
        sphere.applyMatrix4(matrixWorld);
        sphere.radius += threshold;
        if (raycaster.ray.intersectsSphere(sphere) === false)
            return;
        //
        inverseMatrix.getInverse(matrixWorld);
        ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
        var localThreshold = threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3);
        var localThresholdSq = localThreshold * localThreshold;
        var position = new Vector3();
        function testPoint(point, index) {
            var rayPointDistanceSq = ray.distanceSqToPoint(point);
            if (rayPointDistanceSq < localThresholdSq) {
                var intersectPoint = ray.closestPointToPoint(point);
                intersectPoint.applyMatrix4(matrixWorld);
                var distance = raycaster.ray.origin.distanceTo(intersectPoint);
                if (distance < raycaster.near || distance > raycaster.far)
                    return;
                intersects.push({
                    distance: distance,
                    distanceToRay: Math.sqrt(rayPointDistanceSq),
                    point: intersectPoint.clone(),
                    index: index,
                    face: null,
                    object: object
                });
            }
        }
        if (geometry.isBufferGeometry) {
            var index = geometry.index;
            var attributes = geometry.attributes;
            var positions = attributes.position.array;
            if (index !== null) {
                var indices = index.array;
                for (var i = 0, il = indices.length; i < il; i++) {
                    var a = indices[i];
                    position.fromArray(positions, a * 3);
                    testPoint(position, a);
                }
            }
            else {
                for (var i = 0, l = positions.length / 3; i < l; i++) {
                    position.fromArray(positions, i * 3);
                    testPoint(position, i);
                }
            }
        }
        else {
            var vertices = geometry.vertices;
            for (var i = 0, lt = vertices.length; i < lt; i++) {
                testPoint(vertices[i], i);
            }
        }
    };
    Points.prototype.clone = function () {
        return new Points(this.geometry, this.material).copy(this);
    };
    Points.prototype.copy = function (source) {
        return _super.prototype.copy.call(this, source);
    };
    return Points;
}(Object3D));
export { Points };

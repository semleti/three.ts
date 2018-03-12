import { Ray } from '../math/Ray';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://clara.io/
 * @author stephomi / http://stephaneginier.com/
 */
var Raycaster = /** @class */ (function () {
    function Raycaster(origin, direction, near, far) {
        if (near === void 0) { near = 0; }
        if (far === void 0) { far = Infinity; }
        this.linePrecision = 1;
        this.ray = new Ray(origin, direction);
        // direction is assumed to be normalized (for accurate distance calculations)
        this.near = near;
        this.far = far;
        this.params = {
            Mesh: {},
            Line: {},
            LOD: {},
            Points: { threshold: 1 },
            Sprite: {},
            get PointCloud() {
                console.warn('THREE.Raycaster: params.PointCloud has been renamed to params.Points.');
                return this.Points;
            }
        };
    }
    Raycaster.prototype.set = function (origin, direction) {
        // direction is assumed to be normalized (for accurate distance calculations)
        this.ray.set(origin, direction);
    };
    Raycaster.prototype.setFromCamera = function (coords, camera) {
        if ((camera && camera.isPerspectiveCamera)) {
            this.ray.origin.setFromMatrixPosition(camera.matrixWorld);
            this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();
        }
        else if ((camera && camera.isOrthographicCamera)) {
            var cameraOrtho = camera;
            this.ray.origin.set(coords.x, coords.y, (cameraOrtho.near + cameraOrtho.far) / (cameraOrtho.near - cameraOrtho.far)).unproject(camera); // set origin in plane of camera
            this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
        }
        else {
            console.error('THREE.Raycaster: Unsupported camera type.');
        }
    };
    Raycaster.prototype.intersectObject = function (object, recursive) {
        var intersects = [];
        Raycaster.intersectObject(object, this, intersects, recursive);
        intersects.sort(Raycaster.ascSort);
        return intersects;
    };
    Raycaster.prototype.intersectObjects = function (objects, recursive) {
        var intersects = [];
        if (Array.isArray(objects) === false) {
            console.warn('THREE.Raycaster.intersectObjects: objects is not an Array.');
            return intersects;
        }
        for (var i = 0, l = objects.length; i < l; i++) {
            Raycaster.intersectObject(objects[i], this, intersects, recursive);
        }
        intersects.sort(Raycaster.ascSort);
        return intersects;
    };
    return Raycaster;
}());
export { Raycaster };
(function (Raycaster) {
    function ascSort(a, b) {
        return a.distance - b.distance;
    }
    Raycaster.ascSort = ascSort;
    function intersectObject(object, raycaster, intersects, recursive) {
        if (object.visible === false)
            return;
        object.raycast(raycaster, intersects);
        if (recursive === true) {
            var children = object.children;
            for (var i = 0, l = children.length; i < l; i++) {
                intersectObject(children[i], raycaster, intersects, true);
            }
        }
    }
    Raycaster.intersectObject = intersectObject;
})(Raycaster || (Raycaster = {}));

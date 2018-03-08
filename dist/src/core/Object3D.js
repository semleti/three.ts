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
import { Quaternion } from '../math/Quaternion';
import { Vector3 } from '../math/Vector3';
import { Matrix4 } from '../math/Matrix4';
import { EventDispatcher } from './EventDispatcher';
import { Euler } from '../math/Euler';
import { Layers } from './Layers';
import { Matrix3 } from '../math/Matrix3';
import { _Math } from '../math/Math';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author elephantatwork / www.elephantatwork.ch
 */
var Object3D = /** @class */ (function (_super) {
    __extends(Object3D, _super);
    function Object3D() {
        var _this = _super.call(this) || this;
        _this.uuid = _Math.generateUUID();
        _this.name = '';
        _this.type = 'Object3D';
        _this.parent = null;
        _this.children = [];
        _this.up = Object3D.DefaultUp.clone();
        _this.position = new Vector3();
        _this.rotation = new Euler();
        _this.quaternion = new Quaternion();
        _this.scale = new Vector3(1, 1, 1);
        _this.matrix = new Matrix4();
        _this.matrixWorld = new Matrix4();
        _this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
        _this.matrixWorldNeedsUpdate = false;
        _this.layers = new Layers();
        _this.visible = true;
        _this.castShadow = false;
        _this.receiveShadow = false;
        _this.frustumCulled = true;
        _this.renderOrder = 0;
        //TODO: create class
        _this.userData = {};
        _this.isObject3D = true;
        _this.modelViewMatrix = new Matrix4();
        _this.normalMatrix = new Matrix3();
        _this.onBeforeRender = function () { };
        _this.onAfterRender = function () { };
        _this.id = Object3D.object3DId++;
        var scope = _this;
        _this.rotation.onChange(function () { scope.onRotationChange(); });
        _this.quaternion.onChange(function () { scope.onQuaternionChange(); });
        return _this;
    }
    Object3D.prototype.onRotationChange = function () {
        this.quaternion.setFromEuler(this.rotation, false);
    };
    Object3D.prototype.onQuaternionChange = function () {
        this.rotation.setFromQuaternion(this.quaternion, undefined, false);
    };
    Object3D.prototype.applyMatrix = function (matrix) {
        this.matrix.multiplyMatrices(matrix, this.matrix);
        this.matrix.decompose(this.position, this.quaternion, this.scale);
    };
    Object3D.prototype.applyQuaternion = function (q) {
        this.quaternion.premultiply(q);
        return this;
    };
    Object3D.prototype.setRotationFromAxisAngle = function (axis, angle) {
        // assumes axis is normalized
        this.quaternion.setFromAxisAngle(axis, angle);
    };
    Object3D.prototype.setRotationFromEuler = function (euler) {
        this.quaternion.setFromEuler(euler, true);
    };
    Object3D.prototype.setRotationFromMatrix = function (m) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        this.quaternion.setFromRotationMatrix(m);
    };
    Object3D.prototype.setRotationFromQuaternion = function (q) {
        // assumes q is normalized
        this.quaternion.copy(q);
    };
    // rotate object on axis in object space
    // axis is assumed to be normalized
    Object3D.prototype.rotateOnAxis = function (axis, angle) {
        var q1 = new Quaternion();
        q1.setFromAxisAngle(axis, angle);
        this.quaternion.multiply(q1);
        return this;
    };
    // rotate object on axis in world space
    // axis is assumed to be normalized
    // method assumes no rotated parent
    Object3D.prototype.rotateOnWorldAxis = function (axis, angle) {
        var q1 = new Quaternion();
        q1.setFromAxisAngle(axis, angle);
        this.quaternion.premultiply(q1);
        return this;
    };
    Object3D.prototype.rotateX = function (angle) {
        var v1 = new Vector3(1, 0, 0);
        return this.rotateOnAxis(v1, angle);
    };
    Object3D.prototype.rotateY = function (angle) {
        var v1 = new Vector3(0, 1, 0);
        return this.rotateOnAxis(v1, angle);
    };
    Object3D.prototype.rotateZ = function (angle) {
        var v1 = new Vector3(0, 0, 1);
        return this.rotateOnAxis(v1, angle);
    };
    // translate object by distance along axis in object space
    // axis is assumed to be normalized
    Object3D.prototype.translateOnAxis = function (axis, distance) {
        var v1 = new Vector3();
        v1.copy(axis).applyQuaternion(this.quaternion);
        this.position.add(v1.multiplyScalar(distance));
        return this;
    };
    Object3D.prototype.translateX = function (distance) {
        var v1 = new Vector3(1, 0, 0);
        return this.translateOnAxis(v1, distance);
    };
    Object3D.prototype.translateY = function (distance) {
        var v1 = new Vector3(0, 1, 0);
        return this.translateOnAxis(v1, distance);
    };
    Object3D.prototype.translateZ = function (distance) {
        var v1 = new Vector3(0, 0, 1);
        return this.translateOnAxis(v1, distance);
    };
    Object3D.prototype.localToWorld = function (vector) {
        return vector.applyMatrix4(this.matrixWorld);
    };
    Object3D.prototype.worldToLocal = function (vector) {
        var m1 = new Matrix4();
        return vector.applyMatrix4(m1.getInverse(this.matrixWorld));
    };
    Object3D.prototype.lookAt = function (x, y, z) {
        var m1 = new Matrix4();
        var vector = new Vector3();
        if (x.isVector3) {
            vector.copy(x);
        }
        else {
            vector.set(x, y, z);
        }
        if (this.isCamera) {
            m1.lookAt(this.position, vector, this.up);
        }
        else {
            m1.lookAt(vector, this.position, this.up);
        }
        this.quaternion.setFromRotationMatrix(m1);
    };
    Object3D.prototype.add = function (object) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        if (object === this) {
            console.error("THREE.Object3D.add: object can't be added as a child of itself.", object);
            return this;
        }
        if ((object && object.isObject3D)) {
            if (object.parent !== null) {
                object.parent.remove(object);
            }
            object.parent = this;
            object.dispatchEvent({ type: 'added' });
            this.children.push(object);
        }
        else {
            console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object);
        }
        return this;
    };
    Object3D.prototype.remove = function (object) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.remove(arguments[i]);
            }
            return this;
        }
        var index = this.children.indexOf(object);
        if (index !== -1) {
            object.parent = null;
            object.dispatchEvent({ type: 'removed' });
            this.children.splice(index, 1);
        }
        return this;
    };
    Object3D.prototype.getObjectById = function (id) {
        return this.getObjectByProperty('id', id);
    };
    Object3D.prototype.getObjectByName = function (name) {
        return this.getObjectByProperty('name', name);
    };
    Object3D.prototype.getObjectByProperty = function (name, value) {
        if (this[name] === value)
            return this;
        for (var i = 0, l = this.children.length; i < l; i++) {
            var child = this.children[i];
            var object = child.getObjectByProperty(name, value);
            if (object !== undefined) {
                return object;
            }
        }
        return undefined;
    };
    Object3D.prototype.getWorldPosition = function (optionalTarget) {
        var result = optionalTarget || new Vector3();
        this.updateMatrixWorld(true);
        return result.setFromMatrixPosition(this.matrixWorld);
    };
    Object3D.prototype.getWorldQuaternion = function (optionalTarget) {
        var position = new Vector3();
        var scale = new Vector3();
        var result = optionalTarget || new Quaternion();
        this.updateMatrixWorld(true);
        this.matrixWorld.decompose(position, result, scale);
        return result;
    };
    Object3D.prototype.getWorldRotation = function (optionalTarget) {
        var quaternion = new Quaternion();
        var result = optionalTarget || new Euler();
        this.getWorldQuaternion(quaternion);
        return result.setFromQuaternion(quaternion, this.rotation.order, false);
    };
    Object3D.prototype.getWorldScale = function (optionalTarget) {
        var position = new Vector3();
        var quaternion = new Quaternion();
        var result = optionalTarget || new Vector3();
        this.updateMatrixWorld(true);
        this.matrixWorld.decompose(position, quaternion, result);
        return result;
    };
    Object3D.prototype.getWorldDirection = function (optionalTarget) {
        var quaternion = new Quaternion();
        var result = optionalTarget || new Vector3();
        this.getWorldQuaternion(quaternion);
        return result.set(0, 0, 1).applyQuaternion(quaternion);
    };
    Object3D.prototype.raycast = function (raycaster, intersects) { return null; };
    ;
    Object3D.prototype.traverse = function (callback) {
        callback(this);
        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            children[i].traverse(callback);
        }
    };
    Object3D.prototype.traverseVisible = function (callback) {
        if (this.visible === false)
            return;
        callback(this);
        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            children[i].traverseVisible(callback);
        }
    };
    Object3D.prototype.traverseAncestors = function (callback) {
        var parent = this.parent;
        if (parent !== null) {
            callback(parent);
            parent.traverseAncestors(callback);
        }
    };
    Object3D.prototype.updateMatrix = function () {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        this.matrixWorldNeedsUpdate = true;
    };
    Object3D.prototype.updateMatrixWorld = function (force) {
        if (this.matrixAutoUpdate)
            this.updateMatrix();
        if (this.matrixWorldNeedsUpdate || force) {
            if (this.parent === null) {
                this.matrixWorld.copy(this.matrix);
            }
            else {
                this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
            }
            this.matrixWorldNeedsUpdate = false;
            force = true;
        }
        // update children
        var children = this.children;
        for (var i = 0, l = children.length; i < l; i++) {
            children[i].updateMatrixWorld(force);
        }
    };
    Object3D.prototype.toJSON = function (meta) {
        // meta is a string when called from JSON.stringify
        var isRootObject = (meta === undefined || typeof meta === 'string');
        //TODO: create class
        var output = new Object3D.Data();
        // meta is a hash used to collect geometries, materials.
        // not providing it implies that this is the root object
        // being serialized.
        if (isRootObject) {
            // initialize meta obj
            meta = new Object3D.MetaData();
            output.metadata = {
                version: 4.5,
                type: 'Object',
                generator: 'Object3D.toJSON'
            };
        }
        // standard Object3D serialization
        //TODO: create class
        var object = new Object3D.Obj();
        object.uuid = this.uuid;
        object.type = this.type;
        if (this.name !== '')
            object.name = this.name;
        if (this.castShadow === true)
            object.castShadow = true;
        if (this.receiveShadow === true)
            object.receiveShadow = true;
        if (this.visible === false)
            object.visible = false;
        if (JSON.stringify(this.userData) !== '{}')
            object.userData = this.userData;
        object.matrix = this.matrix.toArray();
        //
        function serialize(library, element) {
            if (library[element.uuid] === undefined) {
                library[element.uuid] = element.toJSON(meta);
            }
            return element.uuid;
        }
        if (this.geometry !== undefined) {
            object.geometry = serialize(meta.geometries, this.geometry);
            var parameters = this.geometry.parameters;
            if (parameters !== undefined && parameters.shapes !== undefined) {
                var shapes = parameters.shapes;
                if (Array.isArray(shapes)) {
                    for (var i = 0, l = shapes.length; i < l; i++) {
                        var shape = shapes[i];
                        serialize(meta.shapes, shape);
                    }
                }
                else {
                    serialize(meta.shapes, shapes);
                }
            }
        }
        if (this.material !== undefined) {
            if (Array.isArray(this.material)) {
                var uuids = [];
                for (var i = 0, l = this.material.length; i < l; i++) {
                    uuids.push(serialize(meta.materials, this.material[i]));
                }
                object.material = uuids;
            }
            else {
                object.material = serialize(meta.materials, this.material);
            }
        }
        //
        if (this.children.length > 0) {
            object.children = [];
            for (var i = 0; i < this.children.length; i++) {
                object.children.push(this.children[i].toJSON(meta).object);
            }
        }
        if (isRootObject) {
            var geometries = extractFromCache(meta.geometries);
            var materials = extractFromCache(meta.materials);
            var textures = extractFromCache(meta.textures);
            var images = extractFromCache(meta.images);
            var shapest = extractFromCache(meta.shapes);
            if (geometries.length > 0)
                output.geometries = geometries;
            if (materials.length > 0)
                output.materials = materials;
            if (textures.length > 0)
                output.textures = textures;
            if (images.length > 0)
                output.images = images;
            if (shapest.length > 0)
                output.shapes = shapest;
        }
        output.object = object;
        return output;
        // extract data from the cache hash
        // remove metadata on each item
        // and return as array
        function extractFromCache(cache) {
            var values = [];
            for (var key in cache) {
                var data = cache[key];
                delete data.metadata;
                values.push(data);
            }
            return values;
        }
    };
    Object3D.prototype.clone = function (recursive) {
        return new Object3D().copy(this, recursive);
    };
    Object3D.prototype.copy = function (source, recursive) {
        if (recursive === undefined)
            recursive = true;
        this.name = source.name;
        this.up.copy(source.up);
        this.position.copy(source.position);
        this.quaternion.copy(source.quaternion);
        this.scale.copy(source.scale);
        this.matrix.copy(source.matrix);
        this.matrixWorld.copy(source.matrixWorld);
        this.matrixAutoUpdate = source.matrixAutoUpdate;
        this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;
        this.layers.mask = source.layers.mask;
        this.visible = source.visible;
        this.castShadow = source.castShadow;
        this.receiveShadow = source.receiveShadow;
        this.frustumCulled = source.frustumCulled;
        this.renderOrder = source.renderOrder;
        this.userData = JSON.parse(JSON.stringify(source.userData));
        if (recursive === true) {
            for (var i = 0; i < source.children.length; i++) {
                var child = source.children[i];
                this.add(child.clone());
            }
        }
        return this;
    };
    Object3D.object3DId = 0;
    Object3D.DefaultUp = new Vector3(0, 1, 0);
    Object3D.DefaultMatrixAutoUpdate = true;
    return Object3D;
}(EventDispatcher));
export { Object3D };
(function (Object3D) {
    var MetaData = /** @class */ (function () {
        function MetaData() {
            this.geometries = {};
            this.materials = {};
            this.textures = {};
            this.images = {};
            this.shapes = {};
        }
        return MetaData;
    }());
    Object3D.MetaData = MetaData;
    var Data = /** @class */ (function () {
        function Data() {
        }
        return Data;
    }());
    Object3D.Data = Data;
    var Obj = /** @class */ (function () {
        function Obj() {
        }
        return Obj;
    }());
    Object3D.Obj = Obj;
})(Object3D || (Object3D = {}));

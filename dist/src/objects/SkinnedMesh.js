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
import { Mesh } from './Mesh';
import { Vector4 } from '../math/Vector4';
import { Skeleton } from './Skeleton';
import { Bone } from './Bone';
import { Matrix4 } from '../math/Matrix4';
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */
var SkinnedMesh = /** @class */ (function (_super) {
    __extends(SkinnedMesh, _super);
    function SkinnedMesh(geometry, material) {
        var _this = _super.call(this, geometry, material) || this;
        _this.type = 'SkinnedMesh';
        _this.isSkinnedMesh = true;
        _this.bindMode = 'attached';
        _this.bindMatrix = new Matrix4();
        _this.bindMatrixInverse = new Matrix4();
        var bones = _this.initBones();
        var skeleton = new Skeleton(bones);
        _this.bind(skeleton, _this.matrixWorld);
        _this.normalizeSkinWeights();
        return _this;
    }
    SkinnedMesh.prototype.initBones = function () {
        var bones = [], bone, gbone;
        var i, il;
        if (this.geometry && this.geometry.bones !== undefined) {
            // first, create array of 'Bone' objects from geometry data
            for (i = 0, il = this.geometry.bones.length; i < il; i++) {
                gbone = this.geometry.bones[i];
                // create new 'Bone' object
                bone = new Bone();
                bones.push(bone);
                // apply values
                bone.name = gbone.name;
                bone.position.fromArray(gbone.pos);
                bone.quaternion.fromArray(gbone.rotq);
                if (gbone.scl !== undefined)
                    bone.scale.fromArray(gbone.scl);
            }
            // second, create bone hierarchy
            for (i = 0, il = this.geometry.bones.length; i < il; i++) {
                gbone = this.geometry.bones[i];
                if ((gbone.parent !== -1) && (gbone.parent !== null) && (bones[gbone.parent] !== undefined)) {
                    // subsequent bones in the hierarchy
                    bones[gbone.parent].add(bones[i]);
                }
                else {
                    // topmost bone, immediate child of the skinned mesh
                    this.add(bones[i]);
                }
            }
        }
        // now the bones are part of the scene graph and children of the skinned mesh.
        // let's update the corresponding matrices
        this.updateMatrixWorld(true);
        return bones;
    };
    SkinnedMesh.prototype.bind = function (skeleton, bindMatrix) {
        this.skeleton = skeleton;
        if (bindMatrix === undefined) {
            this.updateMatrixWorld(true);
            this.skeleton.calculateInverses();
            bindMatrix = this.matrixWorld;
        }
        this.bindMatrix.copy(bindMatrix);
        this.bindMatrixInverse.getInverse(bindMatrix);
    };
    SkinnedMesh.prototype.pose = function () {
        this.skeleton.pose();
    };
    SkinnedMesh.prototype.normalizeSkinWeights = function () {
        var scale, i;
        if (this.geometry && this.geometry.isGeometry) {
            for (i = 0; i < this.geometry.skinWeights.length; i++) {
                var sw = this.geometry.skinWeights[i];
                scale = 1.0 / sw.manhattanLength();
                if (scale !== Infinity) {
                    sw.multiplyScalar(scale);
                }
                else {
                    sw.set(1, 0, 0, 0); // do something reasonable
                }
            }
        }
        else if (this.geometry && this.geometry.isBufferGeometry) {
            var vec = new Vector4();
            var skinWeight = this.geometry.attributes.skinWeight;
            for (i = 0; i < skinWeight.count; i++) {
                vec.x = skinWeight.getX(i);
                vec.y = skinWeight.getY(i);
                vec.z = skinWeight.getZ(i);
                vec.w = skinWeight.getW(i);
                scale = 1.0 / vec.manhattanLength();
                if (scale !== Infinity) {
                    vec.multiplyScalar(scale);
                }
                else {
                    vec.set(1, 0, 0, 0); // do something reasonable
                }
                skinWeight.setXYZW(i, vec.x, vec.y, vec.z, vec.w);
            }
        }
    };
    SkinnedMesh.prototype.updateMatrixWorld = function (force) {
        Mesh.prototype.updateMatrixWorld.call(this, force);
        if (this.bindMode === 'attached') {
            this.bindMatrixInverse.getInverse(this.matrixWorld);
        }
        else if (this.bindMode === 'detached') {
            this.bindMatrixInverse.getInverse(this.bindMatrix);
        }
        else {
            console.warn('THREE.SkinnedMesh: Unrecognized bindMode: ' + this.bindMode);
        }
    };
    SkinnedMesh.prototype.clone = function () {
        return new SkinnedMesh(this.geometry, this.material).copy(this);
    };
    SkinnedMesh.prototype.copy = function (source) {
        return _super.prototype.copy.call(this, source);
    };
    return SkinnedMesh;
}(Mesh));
export { SkinnedMesh };

/**
 * @author Sean Griffin / http://twitter.com/sgrif
 * @author Michael Guerrero / http://realitymeltdown.com
 * @author mrdoob / http://mrdoob.com/
 * @author ikerr / http://verold.com
 * @author Mugen87 / https://github.com/Mugen87
 */
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
import { LineSegments } from '../objects/LineSegments';
import { Matrix4 } from '../math/Matrix4';
import { VertexColors } from '../constants';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
function getBoneList(object) {
    var boneList = [];
    if (object && object.isBone) {
        boneList.push(object);
    }
    for (var i = 0; i < object.children.length; i++) {
        boneList.push.apply(boneList, getBoneList(object.children[i]));
    }
    return boneList;
}
var SkeletonHelper = /** @class */ (function (_super) {
    __extends(SkeletonHelper, _super);
    function SkeletonHelper(object) {
        var _this = _super.call(this, SkeletonHelper.constructGeom(object), new LineBasicMaterial({ vertexColors: VertexColors, depthTest: false, depthWrite: false, transparent: true })) || this;
        _this.root = object;
        _this.bones = SkeletonHelper.tempBones;
        _this.matrix = object.matrixWorld;
        _this.matrixAutoUpdate = false;
        return _this;
    }
    SkeletonHelper.constructGeom = function (object) {
        var bones = getBoneList(object);
        var geometry = new BufferGeometry();
        var vertices = [];
        var colors = [];
        var color1 = new Color(0, 0, 1);
        var color2 = new Color(0, 1, 0);
        for (var i = 0; i < bones.length; i++) {
            var bone = bones[i];
            if (bone.parent && bone.parent.isBone) {
                vertices.push(0, 0, 0);
                vertices.push(0, 0, 0);
                colors.push(color1.r, color1.g, color1.b);
                colors.push(color2.r, color2.g, color2.b);
            }
        }
        geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.addAttribute('color', new Float32BufferAttribute(colors, 3));
        SkeletonHelper.tempBones = bones;
        return geometry;
    };
    SkeletonHelper.prototype.updateMatrixWorld = function (force) {
        var vector = new Vector3();
        var boneMatrix = new Matrix4();
        var matrixWorldInv = new Matrix4();
        var bones = this.bones;
        var geometry = this.geometry;
        var position = geometry.getAttribute('position');
        matrixWorldInv.getInverse(this.root.matrixWorld);
        for (var i = 0, j = 0; i < bones.length; i++) {
            var bone = bones[i];
            if (bone.parent && bone.parent.isBone) {
                boneMatrix.multiplyMatrices(matrixWorldInv, bone.matrixWorld);
                vector.setFromMatrixPosition(boneMatrix);
                position.setXYZ(j, vector.x, vector.y, vector.z);
                boneMatrix.multiplyMatrices(matrixWorldInv, bone.parent.matrixWorld);
                vector.setFromMatrixPosition(boneMatrix);
                position.setXYZ(j + 1, vector.x, vector.y, vector.z);
                j += 2;
            }
        }
        geometry.getAttribute('position').needsUpdate = true;
        _super.prototype.updateMatrixWorld.call(this, force);
    };
    return SkeletonHelper;
}(LineSegments));
export { SkeletonHelper };

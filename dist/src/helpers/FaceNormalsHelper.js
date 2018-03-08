/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
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
import { Matrix3 } from '../math/Matrix3';
import { Vector3 } from '../math/Vector3';
import { LineSegments } from '../objects/LineSegments';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
var FaceNormalsHelper = /** @class */ (function (_super) {
    __extends(FaceNormalsHelper, _super);
    function FaceNormalsHelper(object, size, hex, linewidth) {
        var _this = _super.call(this, FaceNormalsHelper.constructGeom(object), new LineBasicMaterial({ color: hex || 0xffff00, linewidth: linewidth || 1 })) || this;
        _this.size = (size !== undefined) ? size : 1;
        _this.object = object;
        _this.matrixAutoUpdate = false;
        _this.update();
        return _this;
    }
    FaceNormalsHelper.constructGeom = function (object) {
        var nNormals = 0;
        var objGeometry = object.geometry;
        if (objGeometry && objGeometry.isGeometry) {
            nNormals = objGeometry.faces.length;
        }
        else {
            console.warn('THREE.FaceNormalsHelper: only THREE.Geometry is supported. Use THREE.VertexNormalsHelper, instead.');
        }
        //
        var geometry = new BufferGeometry();
        var positions = new Float32BufferAttribute(nNormals * 2 * 3, 3);
        geometry.addAttribute('position', positions);
        return geometry;
    };
    FaceNormalsHelper.prototype.update = function () {
        var v1 = new Vector3();
        var v2 = new Vector3();
        var normalMatrix = new Matrix3();
        this.object.updateMatrixWorld(true);
        normalMatrix.getNormalMatrix(this.object.matrixWorld);
        var matrixWorld = this.object.matrixWorld;
        var position = this.geometry.attributes.position;
        //
        var objGeometry = this.object.geometry;
        var vertices = objGeometry.vertices;
        var faces = objGeometry.faces;
        var idx = 0;
        for (var i = 0, l = faces.length; i < l; i++) {
            var face = faces[i];
            var normal = face.normal;
            v1.copy(vertices[face.a])
                .add(vertices[face.b])
                .add(vertices[face.c])
                .divideScalar(3)
                .applyMatrix4(matrixWorld);
            v2.copy(normal).applyMatrix3(normalMatrix).normalize().multiplyScalar(this.size).add(v1);
            position.setXYZ(idx, v1.x, v1.y, v1.z);
            idx = idx + 1;
            position.setXYZ(idx, v2.x, v2.y, v2.z);
            idx = idx + 1;
        }
        position.needsUpdate = true;
    };
    return FaceNormalsHelper;
}(LineSegments));
export { FaceNormalsHelper };

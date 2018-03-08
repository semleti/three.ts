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
import { Vector2 } from '../math/Vector2';
import { Sphere } from '../math/Sphere';
import { Ray } from '../math/Ray';
import { Matrix4 } from '../math/Matrix4';
import { Object3D } from '../core/Object3D';
import { Triangle } from '../math/Triangle';
import { Face3 } from '../core/Face3';
import { DoubleSide, BackSide, TrianglesDrawMode } from '../constants';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { BufferGeometry } from '../core/BufferGeometry';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */
var Mesh = /** @class */ (function (_super) {
    __extends(Mesh, _super);
    function Mesh(geometry, material) {
        var _this = _super.call(this) || this;
        _this.type = 'Mesh';
        _this.isMesh = true;
        _this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
        _this.material = material !== undefined ? material : new MeshBasicMaterial({ color: Math.random() * 0xffffff });
        _this.drawMode = TrianglesDrawMode;
        _this.updateMorphTargets();
        return _this;
    }
    Mesh.prototype.setDrawMode = function (value) {
        this.drawMode = value;
    };
    Mesh.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.drawMode = source.drawMode;
        if (source.morphTargetInfluences !== undefined) {
            this.morphTargetInfluences = source.morphTargetInfluences.slice();
        }
        if (source.morphTargetDictionary !== undefined) {
            this.morphTargetDictionary = Object.assign({}, source.morphTargetDictionary);
        }
        return this;
    };
    Mesh.prototype.updateMorphTargets = function () {
        var geometry = this.geometry;
        var m, ml, name;
        if (geometry.isBufferGeometry) {
            var morphAttributes = geometry.morphAttributes;
            var keys = Object.keys(morphAttributes);
            if (keys.length > 0) {
                var morphAttribute = morphAttributes[keys[0]];
                if (morphAttribute !== undefined) {
                    this.morphTargetInfluences = [];
                    this.morphTargetDictionary = {};
                    for (m = 0, ml = morphAttribute.length; m < ml; m++) {
                        name = morphAttribute[m].name || String(m);
                        this.morphTargetInfluences.push(0);
                        this.morphTargetDictionary[name] = m;
                    }
                }
            }
        }
        else {
            var morphTargets = geometry.morphTargets;
            if (morphTargets !== undefined && morphTargets.length > 0) {
                this.morphTargetInfluences = [];
                this.morphTargetDictionary = {};
                for (m = 0, ml = morphTargets.length; m < ml; m++) {
                    name = morphTargets[m].name || String(m);
                    this.morphTargetInfluences.push(0);
                    this.morphTargetDictionary[name] = m;
                }
            }
        }
    };
    Mesh.prototype.raycast = function (raycaster, intersects) {
        var inverseMatrix = new Matrix4();
        var ray = new Ray();
        var sphere = new Sphere();
        var vA = new Vector3();
        var vB = new Vector3();
        var vC = new Vector3();
        var tempA = new Vector3();
        var tempB = new Vector3();
        var tempC = new Vector3();
        var uvA = new Vector2();
        var uvB = new Vector2();
        var uvC = new Vector2();
        var barycoord = new Vector3();
        var intersectionPoint = new Vector3();
        var intersectionPointWorld = new Vector3();
        function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
            Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord);
            uv1.multiplyScalar(barycoord.x);
            uv2.multiplyScalar(barycoord.y);
            uv3.multiplyScalar(barycoord.z);
            uv1.add(uv2).add(uv3);
            return uv1.clone();
        }
        function checkIntersection(object, material, raycaster, ray, pA, pB, pC, point) {
            var intersect;
            if (material.side === BackSide) {
                intersect = ray.intersectTriangle(pC, pB, pA, true, point);
            }
            else {
                intersect = ray.intersectTriangle(pA, pB, pC, material.side !== DoubleSide, point);
            }
            if (intersect === null)
                return null;
            intersectionPointWorld.copy(point);
            intersectionPointWorld.applyMatrix4(object.matrixWorld);
            var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);
            if (distance < raycaster.near || distance > raycaster.far)
                return null;
            return {
                distance: distance,
                point: intersectionPointWorld.clone(),
                object: object
            };
        }
        function checkBufferGeometryIntersection(object, raycaster, ray, position, uv, a, b, c) {
            vA.fromBufferAttribute(position, a);
            vB.fromBufferAttribute(position, b);
            vC.fromBufferAttribute(position, c);
            //TODO: create class
            var intersection = checkIntersection(object, object.material, raycaster, ray, vA, vB, vC, intersectionPoint);
            if (intersection) {
                if (uv) {
                    uvA.fromBufferAttribute(uv, a);
                    uvB.fromBufferAttribute(uv, b);
                    uvC.fromBufferAttribute(uv, c);
                    intersection.uv = uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);
                }
                intersection.face = new Face3(a, b, c, Triangle.normal(vA, vB, vC));
                intersection.faceIndex = a;
            }
            return intersection;
        }
        var geometry = this.geometry;
        var material = this.material;
        var matrixWorld = this.matrixWorld;
        if (material === undefined)
            return;
        // Checking boundingSphere distance to ray
        if (geometry.boundingSphere === null)
            geometry.computeBoundingSphere();
        sphere.copy(geometry.boundingSphere);
        sphere.applyMatrix4(matrixWorld);
        if (raycaster.ray.intersectsSphere(sphere) === false)
            return;
        //
        inverseMatrix.getInverse(matrixWorld);
        ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
        // Check boundingBox before continuing
        if (geometry.boundingBox !== null) {
            if (ray.intersectsBox(geometry.boundingBox) === false)
                return;
        }
        var intersection;
        if (geometry.isBufferGeometry) {
            var a = void 0, b = void 0, c = void 0;
            var index = geometry.index;
            var position = geometry.attributes.position;
            var uv = geometry.attributes.uv;
            var i = void 0, l = void 0;
            if (index !== null) {
                // indexed buffer geometry
                for (i = 0, l = index.count; i < l; i += 3) {
                    a = index.getX(i);
                    b = index.getX(i + 1);
                    c = index.getX(i + 2);
                    intersection = checkBufferGeometryIntersection(this, raycaster, ray, position, uv, a, b, c);
                    if (intersection) {
                        intersection.faceIndex = Math.floor(i / 3); // triangle number in indices buffer semantics
                        intersects.push(intersection);
                    }
                }
            }
            else if (position !== undefined) {
                // non-indexed buffer geometry
                for (i = 0, l = position.count; i < l; i += 3) {
                    a = i;
                    b = i + 1;
                    c = i + 2;
                    intersection = checkBufferGeometryIntersection(this, raycaster, ray, position, uv, a, b, c);
                    if (intersection) {
                        intersection.index = a; // triangle number in positions buffer semantics
                        intersects.push(intersection);
                    }
                }
            }
        }
        else if (geometry.isGeometry) {
            var fvA = void 0, fvB = void 0, fvC = void 0;
            var isMultiMaterial = Array.isArray(material);
            var vertices = geometry.vertices;
            var faces = geometry.faces;
            var uvs = void 0;
            var faceVertexUvs = geometry.faceVertexUvs[0];
            if (faceVertexUvs.length > 0)
                uvs = faceVertexUvs;
            for (var f = 0, fl = faces.length; f < fl; f++) {
                var face = faces[f];
                var faceMaterial = isMultiMaterial ? material[face.materialIndex] : material;
                if (faceMaterial === undefined)
                    continue;
                fvA = vertices[face.a];
                fvB = vertices[face.b];
                fvC = vertices[face.c];
                if (faceMaterial.morphTargets === true) {
                    var morphTargets = geometry.morphTargets;
                    var morphInfluences = this.morphTargetInfluences;
                    vA.set(0, 0, 0);
                    vB.set(0, 0, 0);
                    vC.set(0, 0, 0);
                    for (var t = 0, tl = morphTargets.length; t < tl; t++) {
                        var influence = morphInfluences[t];
                        if (influence === 0)
                            continue;
                        var targets = morphTargets[t].vertices;
                        vA.addScaledVector(tempA.subVectors(targets[face.a], fvA), influence);
                        vB.addScaledVector(tempB.subVectors(targets[face.b], fvB), influence);
                        vC.addScaledVector(tempC.subVectors(targets[face.c], fvC), influence);
                    }
                    vA.add(fvA);
                    vB.add(fvB);
                    vC.add(fvC);
                    fvA = vA;
                    fvB = vB;
                    fvC = vC;
                }
                intersection = checkIntersection(this, faceMaterial, raycaster, ray, fvA, fvB, fvC, intersectionPoint);
                if (intersection) {
                    if (uvs && uvs[f]) {
                        var uvs_f = uvs[f];
                        uvA.copy(uvs_f[0]);
                        uvB.copy(uvs_f[1]);
                        uvC.copy(uvs_f[2]);
                        intersection.uv = uvIntersection(intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC);
                    }
                    intersection.face = face;
                    intersection.faceIndex = f;
                    intersects.push(intersection);
                }
            }
        }
    };
    Mesh.prototype.clone = function () {
        return new Mesh(this.geometry, this.material).copy(this);
    };
    return Mesh;
}(Object3D));
export { Mesh };

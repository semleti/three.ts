/**
 * @author alteredq / http://alteredqualia.com/
 * @author Mugen87 / https://github.com/Mugen87
 *
 *	- shows frustum, line of sight and up of the camera
 *	- suitable for fast updates
 * 	- based on frustum visualization in lightgl.js shadowmap example
 *		http://evanw.github.com/lightgl.js/tests/shadowmap.html
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
import { Camera } from '../cameras/Camera';
import { Vector3 } from '../math/Vector3';
import { LineSegments } from '../objects/LineSegments';
import { Color } from '../math/Color';
import { FaceColors } from '../constants';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
var CameraHelper = /** @class */ (function (_super) {
    __extends(CameraHelper, _super);
    function CameraHelper(camera) {
        var _this = _super.call(this, CameraHelper.constructGeom(), new LineBasicMaterial({ color: 0xffffff, vertexColors: FaceColors })) || this;
        _this.camera = camera;
        if (_this.camera.updateProjectionMatrix)
            _this.camera.updateProjectionMatrix();
        _this.matrix = camera.matrixWorld;
        _this.matrixAutoUpdate = false;
        _this.pointMap = CameraHelper.tempPointMap;
        _this.update();
        return _this;
    }
    CameraHelper.constructGeom = function () {
        var geometry = new BufferGeometry();
        var material = new LineBasicMaterial({ color: 0xffffff, vertexColors: FaceColors });
        var vertices = [];
        var colors = [];
        var pointMap = {};
        // colors
        var colorFrustum = new Color(0xffaa00);
        var colorCone = new Color(0xff0000);
        var colorUp = new Color(0x00aaff);
        var colorTarget = new Color(0xffffff);
        var colorCross = new Color(0x333333);
        // near
        addLine('n1', 'n2', colorFrustum);
        addLine('n2', 'n4', colorFrustum);
        addLine('n4', 'n3', colorFrustum);
        addLine('n3', 'n1', colorFrustum);
        // far
        addLine('f1', 'f2', colorFrustum);
        addLine('f2', 'f4', colorFrustum);
        addLine('f4', 'f3', colorFrustum);
        addLine('f3', 'f1', colorFrustum);
        // sides
        addLine('n1', 'f1', colorFrustum);
        addLine('n2', 'f2', colorFrustum);
        addLine('n3', 'f3', colorFrustum);
        addLine('n4', 'f4', colorFrustum);
        // cone
        addLine('p', 'n1', colorCone);
        addLine('p', 'n2', colorCone);
        addLine('p', 'n3', colorCone);
        addLine('p', 'n4', colorCone);
        // up
        addLine('u1', 'u2', colorUp);
        addLine('u2', 'u3', colorUp);
        addLine('u3', 'u1', colorUp);
        // target
        addLine('c', 't', colorTarget);
        addLine('p', 'c', colorCross);
        // cross
        addLine('cn1', 'cn2', colorCross);
        addLine('cn3', 'cn4', colorCross);
        addLine('cf1', 'cf2', colorCross);
        addLine('cf3', 'cf4', colorCross);
        function addLine(a, b, color) {
            addPoint(a, color);
            addPoint(b, color);
        }
        function addPoint(id, color) {
            vertices.push(0, 0, 0);
            colors.push(color.r, color.g, color.b);
            if (pointMap[id] === undefined) {
                pointMap[id] = [];
            }
            pointMap[id].push((vertices.length / 3) - 1);
        }
        geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.addAttribute('color', new Float32BufferAttribute(colors, 3));
        CameraHelper.tempPointMap = pointMap;
        return geometry;
    };
    CameraHelper.prototype.update = function () {
        var geometry, pointMap;
        var vector = new Vector3();
        var camera = new Camera();
        function setPoint(point, x, y, z) {
            vector.set(x, y, z).unproject(camera);
            var points = pointMap[point];
            if (points !== undefined) {
                var position = geometry.getAttribute('position');
                for (var i = 0, l = points.length; i < l; i++) {
                    position.setXYZ(points[i], vector.x, vector.y, vector.z);
                }
            }
        }
        geometry = this.geometry;
        pointMap = this.pointMap;
        var w = 1, h = 1;
        // we need just camera projection matrix
        // world matrix must be identity
        camera.projectionMatrix.copy(this.camera.projectionMatrix);
        // center / target
        setPoint('c', 0, 0, -1);
        setPoint('t', 0, 0, 1);
        // near
        setPoint('n1', -w, -h, -1);
        setPoint('n2', w, -h, -1);
        setPoint('n3', -w, h, -1);
        setPoint('n4', w, h, -1);
        // far
        setPoint('f1', -w, -h, 1);
        setPoint('f2', w, -h, 1);
        setPoint('f3', -w, h, 1);
        setPoint('f4', w, h, 1);
        // up
        setPoint('u1', w * 0.7, h * 1.1, -1);
        setPoint('u2', -w * 0.7, h * 1.1, -1);
        setPoint('u3', 0, h * 2, -1);
        // cross
        setPoint('cf1', -w, 0, 1);
        setPoint('cf2', w, 0, 1);
        setPoint('cf3', 0, -h, 1);
        setPoint('cf4', 0, h, 1);
        setPoint('cn1', -w, 0, -1);
        setPoint('cn2', w, 0, -1);
        setPoint('cn3', 0, -h, -1);
        setPoint('cn4', 0, h, -1);
        geometry.getAttribute('position').needsUpdate = true;
    };
    return CameraHelper;
}(LineSegments));
export { CameraHelper };

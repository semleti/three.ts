/**
 * @author WestLangley / http://github.com/WestLangley
 * @author zz85 / http://github.com/zz85
 * @author bhouston / http://clara.io
 *
 * Creates an arrow for visualizing directions
 *
 * Parameters:
 *  dir - Vector3
 *  origin - Vector3
 *  length - Number
 *  color - color in hex value
 *  headLength - Number
 *  headWidth - Number
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
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Object3D } from '../core/Object3D';
import { CylinderBufferGeometry } from '../geometries/CylinderGeometry';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Mesh } from '../objects/Mesh';
import { Line } from '../objects/Line';
import { Vector3 } from '../math/Vector3';
var lineGeometry, coneGeometry;
var ArrowHelper = /** @class */ (function (_super) {
    __extends(ArrowHelper, _super);
    function ArrowHelper(dir, origin, length, color, headLength, headWidth) {
        if (length === void 0) { length = 1; }
        if (color === void 0) { color = 0xffff00; }
        if (headLength === void 0) { headLength = 0.2 * length; }
        if (headWidth === void 0) { headWidth = 0.2 * headLength; }
        var _this = _super.call(this) || this;
        _this.dir = dir;
        _this.origin = origin;
        _this.length = length;
        _this.color = color;
        _this.headLength = headLength;
        _this.headWidth = headWidth;
        if (lineGeometry === undefined) {
            lineGeometry = new BufferGeometry();
            lineGeometry.addAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));
            coneGeometry = new CylinderBufferGeometry(0, 0.5, 1, 5, 1);
            coneGeometry.translate(0, -0.5, 0);
        }
        _this.position.copy(origin);
        _this.line = new Line(lineGeometry, new LineBasicMaterial({ color: color }));
        _this.line.matrixAutoUpdate = false;
        _this.add(_this.line);
        _this.cone = new Mesh(coneGeometry, new MeshBasicMaterial({ color: color }));
        _this.cone.matrixAutoUpdate = false;
        _this.add(_this.cone);
        _this.setDirection(dir);
        _this.setLength(length, headLength, headWidth);
        return _this;
    }
    ArrowHelper.prototype.clone = function () {
        return new ArrowHelper(this.dir, this.origin, this.length, this.color, this.headLength, this.headWidth).copy(this);
    };
    ArrowHelper.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        return this;
    };
    ArrowHelper.prototype.setDirection = function (dir) {
        var axis = new Vector3();
        var radians;
        // dir is assumed to be normalized
        if (dir.y > 0.99999) {
            this.quaternion.set(0, 0, 0, 1);
        }
        else if (dir.y < -0.99999) {
            this.quaternion.set(1, 0, 0, 0);
        }
        else {
            axis.set(dir.z, 0, -dir.x).normalize();
            radians = Math.acos(dir.y);
            this.quaternion.setFromAxisAngle(axis, radians);
        }
    };
    ArrowHelper.prototype.setLength = function (length, headLength, headWidth) {
        if (headLength === undefined)
            headLength = 0.2 * length;
        if (headWidth === undefined)
            headWidth = 0.2 * headLength;
        this.line.scale.set(1, Math.max(0, length - headLength), 1);
        this.line.updateMatrix();
        this.cone.scale.set(headWidth, headLength, headWidth);
        this.cone.position.y = length;
        this.cone.updateMatrix();
    };
    ArrowHelper.prototype.setColor = function (color) {
        this.line.material.color.copy(color);
        this.cone.material.color.copy(color);
    };
    return ArrowHelper;
}(Object3D));
export { ArrowHelper };

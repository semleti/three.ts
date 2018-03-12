/**
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
import { Line } from '../objects/Line';
import { Mesh } from '../objects/Mesh';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
var PlaneHelper = /** @class */ (function (_super) {
    __extends(PlaneHelper, _super);
    function PlaneHelper(plane, size, hex) {
        if (size === void 0) { size = 1; }
        if (hex === void 0) { hex = 0xffff00; }
        var _this = _super.call(this, PlaneHelper.constructGeom(), new LineBasicMaterial({ color: hex })) || this;
        _this.type = 'PlaneHelper';
        _this.plane = plane;
        _this.size = size;
        var color = hex;
        //
        var positions2 = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1];
        var geometry2 = new BufferGeometry();
        geometry2.addAttribute('position', new Float32BufferAttribute(positions2, 3));
        geometry2.computeBoundingSphere();
        _this.add(new Mesh(geometry2, new MeshBasicMaterial({ color: color, opacity: 0.2, transparent: true, depthWrite: false })));
        return _this;
    }
    PlaneHelper.constructGeom = function () {
        var positions = [1, -1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0];
        var geometry = new BufferGeometry();
        geometry.addAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.computeBoundingSphere();
        return geometry;
    };
    PlaneHelper.prototype.updateMatrixWorld = function (force) {
        var scale = -this.plane.constant;
        if (Math.abs(scale) < 1e-8)
            scale = 1e-8; // sign does not matter
        this.scale.set(0.5 * this.size, 0.5 * this.size, scale);
        this.lookAt(this.plane.normal);
        _super.prototype.updateMatrixWorld.call(this, force);
    };
    return PlaneHelper;
}(Line));
export { PlaneHelper };

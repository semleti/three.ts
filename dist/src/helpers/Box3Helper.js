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
import { LineSegments } from '../objects/LineSegments';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { BufferAttribute } from '../core/BufferAttribute';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
var Box3Helper = /** @class */ (function (_super) {
    __extends(Box3Helper, _super);
    function Box3Helper(box, hex) {
        var _this = _super.call(this, box, hex) || this;
        _this.type = 'Box3Helper';
        _this.box = box;
        var color = (hex !== undefined) ? hex : 0xffff00;
        var indices = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]);
        var positions = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1];
        var geometry = new BufferGeometry();
        geometry.setIndex(new BufferAttribute(indices, 1));
        geometry.addAttribute('position', new Float32BufferAttribute(positions, 3));
        LineSegments.call(_this, geometry, new LineBasicMaterial({ color: color }));
        _this.geometry.computeBoundingSphere();
        return _this;
    }
    Box3Helper.prototype.updateMatrixWorld = function (force) {
        var box = this.box;
        if (box.isEmpty())
            return;
        box.getCenter(this.position);
        box.getSize(this.scale);
        this.scale.multiplyScalar(0.5);
        _super.prototype.updateMatrixWorld.call(this, force);
    };
    return Box3Helper;
}(LineSegments));
export { Box3Helper };

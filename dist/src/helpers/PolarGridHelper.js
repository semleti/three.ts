/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / http://github.com/Mugen87
 * @author Hectate / http://www.github.com/Hectate
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
import { VertexColors } from '../constants';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Color } from '../math/Color';
var PolarGridHelper = /** @class */ (function (_super) {
    __extends(PolarGridHelper, _super);
    function PolarGridHelper(radius, radials, circles, divisions, color1, color2) {
        if (radius === void 0) { radius = 10; }
        if (radials === void 0) { radials = 16; }
        if (circles === void 0) { circles = 8; }
        if (divisions === void 0) { divisions = 64; }
        if (color1 === void 0) { color1 = 0x444444; }
        if (color2 === void 0) { color2 = 0x888888; }
        return _super.call(this, PolarGridHelper.constructGeom(radius, radials, circles, divisions, new Color(color1), new Color(color2)), new LineBasicMaterial({ vertexColors: VertexColors })) || this;
    }
    PolarGridHelper.constructGeom = function (radius, radials, circles, divisions, color1, color2) {
        var vertices = [];
        var colors = [];
        var x, z;
        var v, i, j, r, color;
        // create the radials
        for (i = 0; i <= radials; i++) {
            v = (i / radials) * (Math.PI * 2);
            x = Math.sin(v) * radius;
            z = Math.cos(v) * radius;
            vertices.push(0, 0, 0);
            vertices.push(x, 0, z);
            color = (i & 1) ? color1 : color2;
            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
        }
        // create the circles
        for (i = 0; i <= circles; i++) {
            color = (i & 1) ? color1 : color2;
            r = radius - (radius / circles * i);
            for (j = 0; j < divisions; j++) {
                // first vertex
                v = (j / divisions) * (Math.PI * 2);
                x = Math.sin(v) * r;
                z = Math.cos(v) * r;
                vertices.push(x, 0, z);
                colors.push(color.r, color.g, color.b);
                // second vertex
                v = ((j + 1) / divisions) * (Math.PI * 2);
                x = Math.sin(v) * r;
                z = Math.cos(v) * r;
                vertices.push(x, 0, z);
                colors.push(color.r, color.g, color.b);
            }
        }
        var geometry = new BufferGeometry();
        geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.addAttribute('color', new Float32BufferAttribute(colors, 3));
        return geometry;
    };
    return PolarGridHelper;
}(LineSegments));
export { PolarGridHelper };

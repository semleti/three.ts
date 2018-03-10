/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * Text = 3D Text
 *
 * parameters = {
 *  font: <THREE.Font>, // font
 *
 *  size: <float>, // size of the text
 *  height: <float>, // thickness to extrude text
 *  curveSegments: <int>, // number of points on the curves
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into text bevel goes
 *  bevelSize: <float> // how far from text outline is bevel
 * }
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
import { Geometry } from '../core/Geometry';
import { ExtrudeBufferGeometry } from './ExtrudeGeometry';
// TextGeometry
var TextGeometry = /** @class */ (function (_super) {
    __extends(TextGeometry, _super);
    //TODO: create class
    function TextGeometry(text, parameters) {
        var _this = _super.call(this) || this;
        _this.type = 'TextGeometry';
        _this.parameters = {
            text: text,
            parameters: parameters
        };
        _this.fromBufferGeometry(new TextBufferGeometry(text, parameters));
        _this.mergeVertices();
        return _this;
    }
    return TextGeometry;
}(Geometry));
export { TextGeometry };
// TextBufferGeometry
var TextBufferGeometry = /** @class */ (function (_super) {
    __extends(TextBufferGeometry, _super);
    //TODO: create class
    function TextBufferGeometry(text, parameters) {
        var _this = 
        //FIXME: executed correction code before super call
        _super.call(this, parameters.font.generateShapes(text, parameters.size, parameters.curveSegments), parameters || {}) || this;
        _this.type = 'TextBufferGeometry';
        var font = parameters.font;
        if (!(font && font.isFont)) {
            console.error('THREE.TextGeometry: font parameter is not an instance of THREE.Font.');
            return null;
            //return new Geometry();
        }
        // translate parameters to ExtrudeGeometry API
        parameters.amount = parameters.height !== undefined ? parameters.height : 50;
        // defaults
        if (parameters.bevelThickness === undefined)
            parameters.bevelThickness = 10;
        if (parameters.bevelSize === undefined)
            parameters.bevelSize = 8;
        if (parameters.bevelEnabled === undefined)
            parameters.bevelEnabled = false;
        return _this;
    }
    return TextBufferGeometry;
}(ExtrudeBufferGeometry));
export { TextBufferGeometry };

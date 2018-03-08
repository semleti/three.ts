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
import { Path } from './Path';
import { _Math } from '../../math/Math';
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Defines a 2d shape plane using paths.
 **/
// STEP 1 Create a path.
// STEP 2 Turn path into shape.
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// STEP 3a - Extract points from each shape, turn to vertices
// STEP 3b - Triangulate each shape, add faces.
var Shape = /** @class */ (function (_super) {
    __extends(Shape, _super);
    function Shape(points) {
        var _this = _super.call(this, points) || this;
        _this.uuid = _Math.generateUUID();
        _this.type = 'Shape';
        _this.holes = [];
        return _this;
    }
    Shape.prototype.getPointsHoles = function (divisions) {
        var holesPts = [];
        for (var i = 0, l = this.holes.length; i < l; i++) {
            holesPts[i] = this.holes[i].getPoints(divisions);
        }
        return holesPts;
    };
    // get points of shape and holes (keypoints based on segments parameter)
    Shape.prototype.extractPoints = function (divisions) {
        return {
            shape: this.getPoints(divisions),
            holes: this.getPointsHoles(divisions)
        };
    };
    Shape.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.holes = [];
        for (var i = 0, l = source.holes.length; i < l; i++) {
            var hole = source.holes[i];
            this.holes.push(hole.clone());
        }
        return this;
    };
    Shape.prototype.toJSON = function () {
        var data = _super.prototype.toJSON.call(this);
        data.uuid = this.uuid;
        data.holes = [];
        for (var i = 0, l = this.holes.length; i < l; i++) {
            var hole = this.holes[i];
            data.holes.push(hole.toJSON());
        }
        return data;
    };
    Shape.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.uuid = json.uuid;
        this.holes = [];
        for (var i = 0, l = json.holes.length; i < l; i++) {
            var hole = json.holes[i];
            this.holes.push(new Path().fromJSON(hole));
        }
        return this;
    };
    return Shape;
}(Path));
export { Shape };
(function (Shape) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Path.Data));
    Shape.Data = Data;
})(Shape || (Shape = {}));

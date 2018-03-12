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
import { Camera } from './Camera';
import { Object3D } from '../core/Object3D';
/**
 * @author alteredq / http://alteredqualia.com/
 * @author arose / http://github.com/arose
 */
var OrthographicCamera = /** @class */ (function (_super) {
    __extends(OrthographicCamera, _super);
    function OrthographicCamera(left, right, top, bottom, near, far) {
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 2000; }
        var _this = _super.call(this) || this;
        _this.type = 'OrthographicCamera';
        _this.zoom = 1;
        //TODO: create class defined in setviewofsset
        _this.view = null;
        _this.isOrthographicCamera = true;
        _this.left = left;
        _this.right = right;
        _this.top = top;
        _this.bottom = bottom;
        _this.near = near;
        _this.far = far;
        _this.updateProjectionMatrix();
        return _this;
    }
    OrthographicCamera.prototype.clone = function () {
        var cam = new OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far);
        cam.copy(this);
        return cam;
    };
    OrthographicCamera.prototype.copy = function (source, recursive) {
        _super.prototype.copy.call(this, source, recursive);
        this.left = source.left;
        this.right = source.right;
        this.top = source.top;
        this.bottom = source.bottom;
        this.near = source.near;
        this.far = source.far;
        this.zoom = source.zoom;
        this.view = source.view === null ? null : Object.assign({}, source.view);
        return this;
    };
    OrthographicCamera.prototype.setViewOffset = function (fullWidth, fullHeight, x, y, width, height) {
        if (this.view === null) {
            this.view = {
                enabled: true,
                fullWidth: 1,
                fullHeight: 1,
                offsetX: 0,
                offsetY: 0,
                width: 1,
                height: 1
            };
        }
        this.view.enabled = true;
        this.view.fullWidth = fullWidth;
        this.view.fullHeight = fullHeight;
        this.view.offsetX = x;
        this.view.offsetY = y;
        this.view.width = width;
        this.view.height = height;
        this.updateProjectionMatrix();
    };
    OrthographicCamera.prototype.clearViewOffset = function () {
        if (this.view !== null) {
            this.view.enabled = false;
        }
        this.updateProjectionMatrix();
    };
    OrthographicCamera.prototype.updateProjectionMatrix = function () {
        var dx = (this.right - this.left) / (2 * this.zoom);
        var dy = (this.top - this.bottom) / (2 * this.zoom);
        var cx = (this.right + this.left) / 2;
        var cy = (this.top + this.bottom) / 2;
        var left = cx - dx;
        var right = cx + dx;
        var top = cy + dy;
        var bottom = cy - dy;
        if (this.view !== null && this.view.enabled) {
            var zoomW = this.zoom / (this.view.width / this.view.fullWidth);
            var zoomH = this.zoom / (this.view.height / this.view.fullHeight);
            var scaleW = (this.right - this.left) / this.view.width;
            var scaleH = (this.top - this.bottom) / this.view.height;
            left += scaleW * (this.view.offsetX / zoomW);
            right = left + scaleW * (this.view.width / zoomW);
            top -= scaleH * (this.view.offsetY / zoomH);
            bottom = top - scaleH * (this.view.height / zoomH);
        }
        this.projectionMatrix.makeOrthographic(left, right, top, bottom, this.near, this.far);
    };
    OrthographicCamera.prototype.toJSON = function (meta) {
        var data = _super.prototype.toJSON.call(this, meta);
        data.object.zoom = this.zoom;
        data.object.left = this.left;
        data.object.right = this.right;
        data.object.top = this.top;
        data.object.bottom = this.bottom;
        data.object.near = this.near;
        data.object.far = this.far;
        if (this.view !== null)
            data.object.view = Object.assign({}, this.view);
        return data;
    };
    return OrthographicCamera;
}(Camera));
export { OrthographicCamera };
(function (OrthographicCamera) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Object3D.Data));
    OrthographicCamera.Data = Data;
    var Obj = /** @class */ (function (_super) {
        __extends(Obj, _super);
        function Obj() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Obj;
    }(Object3D.Obj));
    OrthographicCamera.Obj = Obj;
})(OrthographicCamera || (OrthographicCamera = {}));

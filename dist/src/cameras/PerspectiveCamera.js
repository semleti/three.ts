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
import { _Math } from '../math/Math';
/**
 * @author mrdoob / http://mrdoob.com/
 * @author greggman / http://games.greggman.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author tschw
 */
var PerspectiveCamera = /** @class */ (function (_super) {
    __extends(PerspectiveCamera, _super);
    function PerspectiveCamera(fov, aspect, near, far) {
        var _this = _super.call(this) || this;
        _this.type = 'PerspectiveCamera';
        _this.zoom = 1;
        _this.focus = 10;
        _this.view = null;
        _this.filmGauge = 35; // width of the film (default in millimeters)
        _this.filmOffset = 0; // horizontal film offset (same unit as gauge)
        _this.isPerspectiveCamera = true;
        _this.fov = fov !== undefined ? fov : 50;
        _this.near = near !== undefined ? near : 0.1;
        _this.far = far !== undefined ? far : 2000;
        _this.aspect = aspect !== undefined ? aspect : 1;
        _this.updateProjectionMatrix();
        return _this;
    }
    PerspectiveCamera.prototype.copy = function (source, recursive) {
        _super.prototype.copy.call(this, source, recursive);
        this.fov = source.fov;
        this.zoom = source.zoom;
        this.near = source.near;
        this.far = source.far;
        this.focus = source.focus;
        this.aspect = source.aspect;
        this.view = source.view === null ? null : source.view;
        this.filmGauge = source.filmGauge;
        this.filmOffset = source.filmOffset;
        return this;
    };
    PerspectiveCamera.prototype.clone = function () {
        return new PerspectiveCamera().copy(this);
    };
    /**
     * Sets the FOV by focal length in respect to the current .filmGauge.
     *
     * The default film gauge is 35, so that the focal length can be specified for
     * a 35mm (full frame) camera.
     *
     * Values for focal length and film gauge must have the same unit.
     */
    PerspectiveCamera.prototype.setFocalLength = function (focalLength) {
        // see http://www.bobatkins.com/photography/technical/field_of_view.html
        var vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;
        this.fov = _Math.RAD2DEG * 2 * Math.atan(vExtentSlope);
        this.updateProjectionMatrix();
    };
    /**
     * Calculates the focal length from the current .fov and .filmGauge.
     */
    PerspectiveCamera.prototype.getFocalLength = function () {
        var vExtentSlope = Math.tan(_Math.DEG2RAD * 0.5 * this.fov);
        return 0.5 * this.getFilmHeight() / vExtentSlope;
    };
    PerspectiveCamera.prototype.getEffectiveFOV = function () {
        return _Math.RAD2DEG * 2 * Math.atan(Math.tan(_Math.DEG2RAD * 0.5 * this.fov) / this.zoom);
    };
    PerspectiveCamera.prototype.getFilmWidth = function () {
        // film not completely covered in portrait format (aspect < 1)
        return this.filmGauge * Math.min(this.aspect, 1);
    };
    PerspectiveCamera.prototype.getFilmHeight = function () {
        // film not completely covered in landscape format (aspect > 1)
        return this.filmGauge / Math.max(this.aspect, 1);
    };
    /**
     * Sets an offset in a larger frustum. This is useful for multi-window or
     * multi-monitor/multi-machine setups.
     *
     * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
     * the monitors are in grid like this
     *
     *   +---+---+---+
     *   | A | B | C |
     *   +---+---+---+
     *   | D | E | F |
     *   +---+---+---+
     *
     * then for each monitor you would call it like this
     *
     *   let w = 1920;
     *   let h = 1080;
     *   let fullWidth = w * 3;
     *   let fullHeight = h * 2;
     *
     *   --A--
     *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
     *   --B--
     *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
     *   --C--
     *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
     *   --D--
     *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
     *   --E--
     *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
     *   --F--
     *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
     *
     *   Note there is no reason monitors have to be the same size or in a grid.
     */
    PerspectiveCamera.prototype.setViewOffset = function (fullWidth, fullHeight, x, y, width, height) {
        this.aspect = fullWidth / fullHeight;
        if (this.view === null) {
            //TODO: create class
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
    PerspectiveCamera.prototype.clearViewOffset = function () {
        if (this.view !== null) {
            this.view.enabled = false;
        }
        this.updateProjectionMatrix();
    };
    PerspectiveCamera.prototype.updateProjectionMatrix = function () {
        var near = this.near, top = near * Math.tan(_Math.DEG2RAD * 0.5 * this.fov) / this.zoom, height = 2 * top, width = this.aspect * height, left = -0.5 * width, view = this.view;
        if (this.view !== null && this.view.enabled) {
            var fullWidth = view.fullWidth, fullHeight = view.fullHeight;
            left += view.offsetX * width / fullWidth;
            top -= view.offsetY * height / fullHeight;
            width *= view.width / fullWidth;
            height *= view.height / fullHeight;
        }
        var skew = this.filmOffset;
        if (skew !== 0)
            left += near * skew / this.getFilmWidth();
        this.projectionMatrix.makePerspective(left, left + width, top, top - height, near, this.far);
    };
    PerspectiveCamera.prototype.toJSON = function (meta) {
        var data = _super.prototype.toJSON.call(this, meta);
        data.object.fov = this.fov;
        data.object.zoom = this.zoom;
        data.object.near = this.near;
        data.object.far = this.far;
        data.object.focus = this.focus;
        data.object.aspect = this.aspect;
        if (this.view !== null)
            data.object.view = this.view;
        data.object.filmGauge = this.filmGauge;
        data.object.filmOffset = this.filmOffset;
        return data;
    };
    return PerspectiveCamera;
}(Camera));
export { PerspectiveCamera };
(function (PerspectiveCamera) {
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Data;
    }(Object3D.Data));
    PerspectiveCamera.Data = Data;
    var Obj = /** @class */ (function (_super) {
        __extends(Obj, _super);
        function Obj() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Obj;
    }(Object3D.Obj));
    PerspectiveCamera.Obj = Obj;
})(PerspectiveCamera || (PerspectiveCamera = {}));

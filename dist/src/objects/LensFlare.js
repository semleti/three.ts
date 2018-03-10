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
import { Object3D } from '../core/Object3D.js';
import { NormalBlending } from '../constants.js';
import { Color } from '../math/Color.js';
import { Vector3 } from '../math/Vector3.js';
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */
var LensFlare = /** @class */ (function (_super) {
    __extends(LensFlare, _super);
    function LensFlare(texture, size, distance, blending, color) {
        var _this = _super.call(this) || this;
        _this.isLensFlare = true;
        _this.lensFlares = [];
        _this.positionScreen = new Vector3();
        _this.customUpdateCallback = undefined;
        if (texture !== undefined) {
            _this.add(texture, size, distance, blending, color);
        }
        return _this;
    }
    LensFlare.prototype.copy = function (source, recursive) {
        _super.prototype.copy.call(this, source, recursive);
        this.positionScreen.copy(source.positionScreen);
        this.customUpdateCallback = source.customUpdateCallback;
        for (var i = 0, l = source.lensFlares.length; i < l; i++) {
            this.lensFlares.push(source.lensFlares[i]);
        }
        return this;
    };
    LensFlare.prototype.add = function (texture, size, distance, blending, color, opacity) {
        if (size === undefined)
            size = -1;
        if (distance === undefined)
            distance = 0;
        if (opacity === undefined)
            opacity = 1;
        if (color === undefined)
            color = new Color(0xffffff);
        if (blending === undefined)
            blending = NormalBlending;
        distance = Math.min(distance, Math.max(0, distance));
        this.lensFlares.push({
            texture: texture,
            size: size,
            distance: distance,
            x: 0, y: 0, z: 0,
            scale: 1,
            rotation: 0,
            opacity: opacity,
            color: color,
            blending: blending // blending
        });
        return this;
    };
    /*
     * Update lens flares update positions on all flares based on the screen position
     * Set myLensFlare.customUpdateCallback to alter the flares in your project specific way.
     */
    LensFlare.prototype.updateLensFlares = function () {
        var f, fl = this.lensFlares.length;
        var flare;
        var vecX = -this.positionScreen.x * 2;
        var vecY = -this.positionScreen.y * 2;
        for (f = 0; f < fl; f++) {
            flare = this.lensFlares[f];
            flare.x = this.positionScreen.x + vecX * flare.distance;
            flare.y = this.positionScreen.y + vecY * flare.distance;
            flare.wantedRotation = flare.x * Math.PI * 0.25;
            flare.rotation += (flare.wantedRotation - flare.rotation) * 0.25;
        }
    };
    return LensFlare;
}(Object3D));
export { LensFlare };

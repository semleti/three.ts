/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
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
import { EventDispatcher } from '../core/EventDispatcher';
import { UVMapping } from '../constants';
import { MirroredRepeatWrapping, ClampToEdgeWrapping, RepeatWrapping, LinearEncoding, UnsignedByteType, RGBAFormat, LinearMipMapLinearFilter, LinearFilter } from '../constants';
import { _Math } from '../math/Math';
import { Vector2 } from '../math/Vector2';
import { Matrix3 } from '../math/Matrix3';
var Texture = /** @class */ (function (_super) {
    __extends(Texture, _super);
    function Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {
        if (image === void 0) { image = Texture.DEFAULT_IMAGE; }
        if (mapping === void 0) { mapping = Texture.DEFAULT_MAPPING; }
        if (wrapS === void 0) { wrapS = ClampToEdgeWrapping; }
        if (wrapT === void 0) { wrapT = ClampToEdgeWrapping; }
        if (magFilter === void 0) { magFilter = LinearFilter; }
        if (minFilter === void 0) { minFilter = LinearMipMapLinearFilter; }
        if (format === void 0) { format = RGBAFormat; }
        if (type === void 0) { type = UnsignedByteType; }
        if (anisotropy === void 0) { anisotropy = 1; }
        if (encoding === void 0) { encoding = LinearEncoding; }
        var _this = _super.call(this) || this;
        _this.onUpdate = function () { };
        _this.isTexture = true;
        _this.id = Texture.textureId++;
        _this.uuid = _Math.generateUUID();
        _this.name = '';
        _this.image = image;
        _this.mipmaps = [];
        _this.mapping = mapping;
        _this.wrapS = wrapS;
        _this.wrapT = wrapT;
        _this.magFilter = magFilter;
        _this.minFilter = minFilter;
        _this.anisotropy = anisotropy;
        _this.format = format;
        _this.type = type;
        _this.offset = new Vector2(0, 0);
        _this.repeat = new Vector2(1, 1);
        _this.center = new Vector2(0, 0);
        _this.rotation = 0;
        _this.matrixAutoUpdate = true;
        _this.matrix = new Matrix3();
        _this.generateMipmaps = true;
        _this.premultiplyAlpha = false;
        _this.flipY = true;
        _this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)
        // Values of encoding !== THREE.LinearEncoding only supported on map, envMap and emissiveMap.
        //
        // Also changing the encoding after already used by a Material will not automatically make the Material
        // update.  You need to explicitly call Material.needsUpdate to trigger it to recompile.
        _this.encoding = encoding;
        _this.version = 0;
        _this.onUpdate = null;
        return _this;
    }
    Texture.prototype.clone = function () {
        return new Texture().copy(this);
    };
    Texture.prototype.copy = function (source) {
        this.name = source.name;
        this.image = source.image;
        this.mipmaps = source.mipmaps.slice(0);
        this.mapping = source.mapping;
        this.wrapS = source.wrapS;
        this.wrapT = source.wrapT;
        this.magFilter = source.magFilter;
        this.minFilter = source.minFilter;
        this.anisotropy = source.anisotropy;
        this.format = source.format;
        this.type = source.type;
        this.offset.copy(source.offset);
        this.repeat.copy(source.repeat);
        this.center.copy(source.center);
        this.rotation = source.rotation;
        this.matrixAutoUpdate = source.matrixAutoUpdate;
        this.matrix.copy(source.matrix);
        this.generateMipmaps = source.generateMipmaps;
        this.premultiplyAlpha = source.premultiplyAlpha;
        this.flipY = source.flipY;
        this.unpackAlignment = source.unpackAlignment;
        this.encoding = source.encoding;
        return this;
    };
    Texture.prototype.toJSON = function (meta) {
        var isRootObject = (meta === undefined || typeof meta === 'string');
        if (!isRootObject && meta.textures[this.uuid] !== undefined) {
            return meta.textures[this.uuid];
        }
        function getDataURL(image) {
            var canvas;
            if (image instanceof HTMLCanvasElement) {
                canvas = image;
            }
            else {
                canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext('2d');
                if (image instanceof ImageData) {
                    context.putImageData(image, 0, 0);
                }
                else {
                    context.drawImage(image, 0, 0, image.width, image.height);
                }
            }
            if (canvas.width > 2048 || canvas.height > 2048) {
                return canvas.toDataURL('image/jpeg', 0.6);
            }
            else {
                return canvas.toDataURL('image/png');
            }
        }
        var output = {
            metadata: {
                version: 4.5,
                type: 'Texture',
                generator: 'Texture.toJSON'
            },
            uuid: this.uuid,
            name: this.name,
            mapping: this.mapping,
            repeat: [this.repeat.x, this.repeat.y],
            offset: [this.offset.x, this.offset.y],
            center: [this.center.x, this.center.y],
            rotation: this.rotation,
            wrap: [this.wrapS, this.wrapT],
            minFilter: this.minFilter,
            magFilter: this.magFilter,
            anisotropy: this.anisotropy,
            flipY: this.flipY,
            image: null
        };
        if (this.image !== undefined) {
            // TODO: Move to THREE.Image
            var image = this.image;
            if (image.uuid === undefined) {
                image.uuid = _Math.generateUUID(); // UGH
            }
            if (!isRootObject && meta.images[image.uuid] === undefined) {
                meta.images[image.uuid] = {
                    uuid: image.uuid,
                    url: getDataURL(image)
                };
            }
            output.image = image.uuid;
        }
        if (!isRootObject) {
            meta.textures[this.uuid] = output;
        }
        return output;
    };
    Texture.prototype.dispose = function () {
        this.dispatchEvent({ type: 'dispose' });
    };
    Texture.prototype.transformUv = function (uv) {
        if (this.mapping !== UVMapping)
            return;
        uv.applyMatrix3(this.matrix);
        if (uv.x < 0 || uv.x > 1) {
            switch (this.wrapS) {
                case RepeatWrapping:
                    uv.x = uv.x - Math.floor(uv.x);
                    break;
                case ClampToEdgeWrapping:
                    uv.x = uv.x < 0 ? 0 : 1;
                    break;
                case MirroredRepeatWrapping:
                    if (Math.abs(Math.floor(uv.x) % 2) === 1) {
                        uv.x = Math.ceil(uv.x) - uv.x;
                    }
                    else {
                        uv.x = uv.x - Math.floor(uv.x);
                    }
                    break;
            }
        }
        if (uv.y < 0 || uv.y > 1) {
            switch (this.wrapT) {
                case RepeatWrapping:
                    uv.y = uv.y - Math.floor(uv.y);
                    break;
                case ClampToEdgeWrapping:
                    uv.y = uv.y < 0 ? 0 : 1;
                    break;
                case MirroredRepeatWrapping:
                    if (Math.abs(Math.floor(uv.y) % 2) === 1) {
                        uv.y = Math.ceil(uv.y) - uv.y;
                    }
                    else {
                        uv.y = uv.y - Math.floor(uv.y);
                    }
                    break;
            }
        }
        if (this.flipY) {
            uv.y = 1 - uv.y;
        }
    };
    Object.defineProperty(Texture.prototype, "needsUpdate", {
        set: function (value) {
            if (value === true)
                this.version++;
        },
        enumerable: true,
        configurable: true
    });
    Texture.textureId = 0;
    Texture.DEFAULT_IMAGE = undefined;
    Texture.DEFAULT_MAPPING = UVMapping;
    return Texture;
}(EventDispatcher));
export { Texture };

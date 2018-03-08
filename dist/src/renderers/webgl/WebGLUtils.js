/**
 * @author thespite / http://www.twitter.com/thespite
 */
import { MaxEquation, MinEquation, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_10x10_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGB_ETC1_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT5_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT1_Format, RGB_S3TC_DXT1_Format, SrcAlphaSaturateFactor, OneMinusDstColorFactor, DstColorFactor, OneMinusDstAlphaFactor, DstAlphaFactor, OneMinusSrcAlphaFactor, SrcAlphaFactor, OneMinusSrcColorFactor, SrcColorFactor, OneFactor, ZeroFactor, ReverseSubtractEquation, SubtractEquation, AddEquation, DepthFormat, DepthStencilFormat, LuminanceAlphaFormat, LuminanceFormat, RGBAFormat, RGBFormat, AlphaFormat, HalfFloatType, FloatType, UnsignedIntType, IntType, UnsignedShortType, ShortType, ByteType, UnsignedInt248Type, UnsignedShort565Type, UnsignedShort5551Type, UnsignedShort4444Type, UnsignedByteType, LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearFilter, NearestMipMapLinearFilter, NearestMipMapNearestFilter, NearestFilter, MirroredRepeatWrapping, ClampToEdgeWrapping, RepeatWrapping } from '../../constants';
var WebGLUtils = /** @class */ (function () {
    function WebGLUtils(gl, extensions) {
        this.gl = gl;
        this.extensions = extensions;
    }
    WebGLUtils.prototype.convert = function (p) {
        var extension;
        if (p === RepeatWrapping)
            return this.gl.REPEAT;
        if (p === ClampToEdgeWrapping)
            return this.gl.CLAMP_TO_EDGE;
        if (p === MirroredRepeatWrapping)
            return this.gl.MIRRORED_REPEAT;
        if (p === NearestFilter)
            return this.gl.NEAREST;
        if (p === NearestMipMapNearestFilter)
            return this.gl.NEAREST_MIPMAP_NEAREST;
        if (p === NearestMipMapLinearFilter)
            return this.gl.NEAREST_MIPMAP_LINEAR;
        if (p === LinearFilter)
            return this.gl.LINEAR;
        if (p === LinearMipMapNearestFilter)
            return this.gl.LINEAR_MIPMAP_NEAREST;
        if (p === LinearMipMapLinearFilter)
            return this.gl.LINEAR_MIPMAP_LINEAR;
        if (p === UnsignedByteType)
            return this.gl.UNSIGNED_BYTE;
        if (p === UnsignedShort4444Type)
            return this.gl.UNSIGNED_SHORT_4_4_4_4;
        if (p === UnsignedShort5551Type)
            return this.gl.UNSIGNED_SHORT_5_5_5_1;
        if (p === UnsignedShort565Type)
            return this.gl.UNSIGNED_SHORT_5_6_5;
        if (p === ByteType)
            return this.gl.BYTE;
        if (p === ShortType)
            return this.gl.SHORT;
        if (p === UnsignedShortType)
            return this.gl.UNSIGNED_SHORT;
        if (p === IntType)
            return this.gl.INT;
        if (p === UnsignedIntType)
            return this.gl.UNSIGNED_INT;
        if (p === FloatType)
            return this.gl.FLOAT;
        if (p === HalfFloatType) {
            extension = this.extensions.get('OES_texture_half_float');
            if (extension !== null)
                return extension.HALF_FLOAT_OES;
        }
        if (p === AlphaFormat)
            return this.gl.ALPHA;
        if (p === RGBFormat)
            return this.gl.RGB;
        if (p === RGBAFormat)
            return this.gl.RGBA;
        if (p === LuminanceFormat)
            return this.gl.LUMINANCE;
        if (p === LuminanceAlphaFormat)
            return this.gl.LUMINANCE_ALPHA;
        if (p === DepthFormat)
            return this.gl.DEPTH_COMPONENT;
        if (p === DepthStencilFormat)
            return this.gl.DEPTH_STENCIL;
        if (p === AddEquation)
            return this.gl.FUNC_ADD;
        if (p === SubtractEquation)
            return this.gl.FUNC_SUBTRACT;
        if (p === ReverseSubtractEquation)
            return this.gl.FUNC_REVERSE_SUBTRACT;
        if (p === ZeroFactor)
            return this.gl.ZERO;
        if (p === OneFactor)
            return this.gl.ONE;
        if (p === SrcColorFactor)
            return this.gl.SRC_COLOR;
        if (p === OneMinusSrcColorFactor)
            return this.gl.ONE_MINUS_SRC_COLOR;
        if (p === SrcAlphaFactor)
            return this.gl.SRC_ALPHA;
        if (p === OneMinusSrcAlphaFactor)
            return this.gl.ONE_MINUS_SRC_ALPHA;
        if (p === DstAlphaFactor)
            return this.gl.DST_ALPHA;
        if (p === OneMinusDstAlphaFactor)
            return this.gl.ONE_MINUS_DST_ALPHA;
        if (p === DstColorFactor)
            return this.gl.DST_COLOR;
        if (p === OneMinusDstColorFactor)
            return this.gl.ONE_MINUS_DST_COLOR;
        if (p === SrcAlphaSaturateFactor)
            return this.gl.SRC_ALPHA_SATURATE;
        if (p === RGB_S3TC_DXT1_Format || p === RGBA_S3TC_DXT1_Format ||
            p === RGBA_S3TC_DXT3_Format || p === RGBA_S3TC_DXT5_Format) {
            extension = this.extensions.get('WEBGL_compressed_texture_s3tc');
            if (extension !== null) {
                if (p === RGB_S3TC_DXT1_Format)
                    return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
                if (p === RGBA_S3TC_DXT1_Format)
                    return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                if (p === RGBA_S3TC_DXT3_Format)
                    return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                if (p === RGBA_S3TC_DXT5_Format)
                    return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
            }
        }
        if (p === RGB_PVRTC_4BPPV1_Format || p === RGB_PVRTC_2BPPV1_Format ||
            p === RGBA_PVRTC_4BPPV1_Format || p === RGBA_PVRTC_2BPPV1_Format) {
            extension = this.extensions.get('WEBGL_compressed_texture_pvrtc');
            if (extension !== null) {
                if (p === RGB_PVRTC_4BPPV1_Format)
                    return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                if (p === RGB_PVRTC_2BPPV1_Format)
                    return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                if (p === RGBA_PVRTC_4BPPV1_Format)
                    return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                if (p === RGBA_PVRTC_2BPPV1_Format)
                    return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
            }
        }
        if (p === RGB_ETC1_Format) {
            extension = this.extensions.get('WEBGL_compressed_texture_etc1');
            if (extension !== null)
                return extension.COMPRESSED_RGB_ETC1_WEBGL;
        }
        if (p === RGBA_ASTC_4x4_Format || p === RGBA_ASTC_5x4_Format || p === RGBA_ASTC_5x5_Format ||
            p === RGBA_ASTC_6x5_Format || p === RGBA_ASTC_6x6_Format || p === RGBA_ASTC_8x5_Format ||
            p === RGBA_ASTC_8x6_Format || p === RGBA_ASTC_8x8_Format || p === RGBA_ASTC_10x5_Format ||
            p === RGBA_ASTC_10x6_Format || p === RGBA_ASTC_10x8_Format || p === RGBA_ASTC_10x10_Format ||
            p === RGBA_ASTC_12x10_Format || p === RGBA_ASTC_12x12_Format) {
            extension = this.extensions.get('WEBGL_compressed_texture_astc');
            if (extension !== null) {
                return p;
            }
        }
        if (p === MinEquation || p === MaxEquation) {
            extension = this.extensions.get('EXT_blend_minmax');
            if (extension !== null) {
                if (p === MinEquation)
                    return extension.MIN_EXT;
                if (p === MaxEquation)
                    return extension.MAX_EXT;
            }
        }
        if (p === UnsignedInt248Type) {
            extension = this.extensions.get('WEBGL_depth_texture');
            if (extension !== null)
                return extension.UNSIGNED_INT_24_8_WEBGL;
        }
        return 0;
    };
    return WebGLUtils;
}());
export { WebGLUtils };

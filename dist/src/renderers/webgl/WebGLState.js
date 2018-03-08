/**
 * @author mrdoob / http://mrdoob.com/
 */
import { NotEqualDepth, GreaterDepth, GreaterEqualDepth, EqualDepth, LessEqualDepth, LessDepth, AlwaysDepth, NeverDepth, CullFaceFront, CullFaceBack, CullFaceNone, CustomBlending, MultiplyBlending, SubtractiveBlending, AdditiveBlending, NoBlending, DoubleSide, BackSide } from '../../constants';
import { Vector4 } from '../../math/Vector4';
var WebGLState = /** @class */ (function () {
    function WebGLState(gl, extensions, utils) {
        this.gl = gl;
        this.extensions = extensions;
        this.utils = utils;
        this.colorBuffer = new WebGLState.ColorBuffer(gl);
        this.depthBuffer = new WebGLState.DepthBuffer(gl);
        this.stencilBuffer = new WebGLState.StencilBuffer(gl);
        var maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this.newAttributes = new Uint8Array(maxVertexAttributes);
        this.enabledAttributes = new Uint8Array(maxVertexAttributes);
        this.attributeDivisors = new Uint8Array(maxVertexAttributes);
        this.capabilities = {};
        this.compressedTextureFormats = null;
        this.currentProgram = null;
        this.currentBlending = null;
        this.currentBlendEquation = null;
        this.currentBlendSrc = null;
        this.currentBlendDst = null;
        this.currentBlendEquationAlpha = null;
        this.currentBlendSrcAlpha = null;
        this.currentBlendDstAlpha = null;
        this.currentPremultipledAlpha = false;
        this.currentFlipSided = null;
        this.currentCullFace = null;
        this.currentLineWidth = null;
        this.currentPolygonOffsetFactor = null;
        this.currentPolygonOffsetUnits = null;
        this.maxTextures = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        this.lineWidthAvailable = false;
        var version = 0;
        var glVersion = gl.getParameter(gl.VERSION);
        if (glVersion.indexOf('WebGL') !== -1) {
            version = parseFloat(/^WebGL\ ([0-9])/.exec(glVersion)[1]);
            this.lineWidthAvailable = (version >= 1.0);
        }
        else if (glVersion.indexOf('OpenGL ES') !== -1) {
            version = parseFloat(/^OpenGL\ ES\ ([0-9])/.exec(glVersion)[1]);
            this.lineWidthAvailable = (version >= 2.0);
        }
        this.currentTextureSlot = null;
        this.currentBoundTextures = {};
        this.currentScissor = new Vector4();
        this.currentViewport = new Vector4();
        this.emptyTextures = {};
        this.emptyTextures[gl.TEXTURE_2D] = this.createTexture(gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
        this.emptyTextures[gl.TEXTURE_CUBE_MAP] = this.createTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);
        // init
        this.colorBuffer.setClear(0, 0, 0, 1);
        this.depthBuffer.setClear(1);
        this.stencilBuffer.setClear(0);
        //enable( gl.DEPTH_TEST );
        this.depthBuffer.setFunc(LessEqualDepth);
        //setFlipSided( false );
        //setCullFace( CullFaceBack );
        //enable( gl.CULL_FACE );
        //enable( gl.BLEND );
        //setBlending( NormalBlending );
        this.buffers = {
            color: this.colorBuffer,
            depth: this.depthBuffer,
            stencil: this.stencilBuffer
        };
    }
    //
    WebGLState.prototype.createTexture = function (type, target, count) {
        var data = new Uint8Array(4); // 4 is required to match default unpack alignment of 4.
        var texture = this.gl.createTexture();
        this.gl.bindTexture(type, texture);
        this.gl.texParameteri(type, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(type, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        for (var i = 0; i < count; i++) {
            this.gl.texImage2D(target + i, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        }
        return texture;
    };
    //
    WebGLState.prototype.initAttributes = function () {
        for (var i = 0, l = this.newAttributes.length; i < l; i++) {
            this.newAttributes[i] = 0;
        }
    };
    WebGLState.prototype.enableAttribute = function (attribute) {
        this.newAttributes[attribute] = 1;
        if (this.enabledAttributes[attribute] === 0) {
            this.gl.enableVertexAttribArray(attribute);
            this.enabledAttributes[attribute] = 1;
        }
        if (this.attributeDivisors[attribute] !== 0) {
            var extension = this.extensions.get('ANGLE_instanced_arrays');
            extension.vertexAttribDivisorANGLE(attribute, 0);
            this.attributeDivisors[attribute] = 0;
        }
    };
    WebGLState.prototype.enableAttributeAndDivisor = function (attribute, meshPerAttribute) {
        this.newAttributes[attribute] = 1;
        if (this.enabledAttributes[attribute] === 0) {
            this.gl.enableVertexAttribArray(attribute);
            this.enabledAttributes[attribute] = 1;
        }
        if (this.attributeDivisors[attribute] !== meshPerAttribute) {
            var extension = this.extensions.get('ANGLE_instanced_arrays');
            extension.vertexAttribDivisorANGLE(attribute, meshPerAttribute);
            this.attributeDivisors[attribute] = meshPerAttribute;
        }
    };
    WebGLState.prototype.disableUnusedAttributes = function () {
        for (var i = 0, l = this.enabledAttributes.length; i !== l; ++i) {
            if (this.enabledAttributes[i] !== this.newAttributes[i]) {
                this.gl.disableVertexAttribArray(i);
                this.enabledAttributes[i] = 0;
            }
        }
    };
    WebGLState.prototype.enable = function (id) {
        if (this.capabilities[id] !== true) {
            this.gl.enable(id);
            this.capabilities[id] = true;
        }
    };
    WebGLState.prototype.disable = function (id) {
        if (this.capabilities[id] !== false) {
            this.gl.disable(id);
            this.capabilities[id] = false;
        }
    };
    WebGLState.prototype.getCompressedTextureFormats = function () {
        if (this.compressedTextureFormats === null) {
            this.compressedTextureFormats = [];
            if (this.extensions.get('WEBGL_compressed_texture_pvrtc') ||
                this.extensions.get('WEBGL_compressed_texture_s3tc') ||
                this.extensions.get('WEBGL_compressed_texture_etc1') ||
                this.extensions.get('WEBGL_compressed_texture_astc')) {
                var formats = this.gl.getParameter(this.gl.COMPRESSED_TEXTURE_FORMATS);
                for (var i = 0; i < formats.length; i++) {
                    this.compressedTextureFormats.push(formats[i]);
                }
            }
        }
        return this.compressedTextureFormats;
    };
    WebGLState.prototype.useProgram = function (program) {
        if (this.currentProgram !== program) {
            this.gl.useProgram(program);
            this.currentProgram = program;
            return true;
        }
        return false;
    };
    WebGLState.prototype.setBlending = function (blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha) {
        if (blending !== NoBlending) {
            this.enable(this.gl.BLEND);
        }
        else {
            this.disable(this.gl.BLEND);
        }
        if (blending !== CustomBlending) {
            if (blending !== this.currentBlending || premultipliedAlpha !== this.currentPremultipledAlpha) {
                switch (blending) {
                    case AdditiveBlending:
                        if (premultipliedAlpha) {
                            this.gl.blendEquationSeparate(this.gl.FUNC_ADD, this.gl.FUNC_ADD);
                            this.gl.blendFuncSeparate(this.gl.ONE, this.gl.ONE, this.gl.ONE, this.gl.ONE);
                        }
                        else {
                            this.gl.blendEquation(this.gl.FUNC_ADD);
                            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
                        }
                        break;
                    case SubtractiveBlending:
                        if (premultipliedAlpha) {
                            this.gl.blendEquationSeparate(this.gl.FUNC_ADD, this.gl.FUNC_ADD);
                            this.gl.blendFuncSeparate(this.gl.ZERO, this.gl.ZERO, this.gl.ONE_MINUS_SRC_COLOR, this.gl.ONE_MINUS_SRC_ALPHA);
                        }
                        else {
                            this.gl.blendEquation(this.gl.FUNC_ADD);
                            this.gl.blendFunc(this.gl.ZERO, this.gl.ONE_MINUS_SRC_COLOR);
                        }
                        break;
                    case MultiplyBlending:
                        if (premultipliedAlpha) {
                            this.gl.blendEquationSeparate(this.gl.FUNC_ADD, this.gl.FUNC_ADD);
                            this.gl.blendFuncSeparate(this.gl.ZERO, this.gl.SRC_COLOR, this.gl.ZERO, this.gl.SRC_ALPHA);
                        }
                        else {
                            this.gl.blendEquation(this.gl.FUNC_ADD);
                            this.gl.blendFunc(this.gl.ZERO, this.gl.SRC_COLOR);
                        }
                        break;
                    default:
                        if (premultipliedAlpha) {
                            this.gl.blendEquationSeparate(this.gl.FUNC_ADD, this.gl.FUNC_ADD);
                            this.gl.blendFuncSeparate(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
                        }
                        else {
                            this.gl.blendEquationSeparate(this.gl.FUNC_ADD, this.gl.FUNC_ADD);
                            this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
                        }
                }
            }
            this.currentBlendEquation = null;
            this.currentBlendSrc = null;
            this.currentBlendDst = null;
            this.currentBlendEquationAlpha = null;
            this.currentBlendSrcAlpha = null;
            this.currentBlendDstAlpha = null;
        }
        else {
            blendEquationAlpha = blendEquationAlpha || blendEquation;
            blendSrcAlpha = blendSrcAlpha || blendSrc;
            blendDstAlpha = blendDstAlpha || blendDst;
            if (blendEquation !== this.currentBlendEquation || blendEquationAlpha !== this.currentBlendEquationAlpha) {
                this.gl.blendEquationSeparate(this.utils.convert(blendEquation), this.utils.convert(blendEquationAlpha));
                this.currentBlendEquation = blendEquation;
                this.currentBlendEquationAlpha = blendEquationAlpha;
            }
            if (blendSrc !== this.currentBlendSrc || blendDst !== this.currentBlendDst || blendSrcAlpha !== this.currentBlendSrcAlpha || blendDstAlpha !== this.currentBlendDstAlpha) {
                this.gl.blendFuncSeparate(this.utils.convert(blendSrc), this.utils.convert(blendDst), this.utils.convert(blendSrcAlpha), this.utils.convert(blendDstAlpha));
                this.currentBlendSrc = blendSrc;
                this.currentBlendDst = blendDst;
                this.currentBlendSrcAlpha = blendSrcAlpha;
                this.currentBlendDstAlpha = blendDstAlpha;
            }
        }
        this.currentBlending = blending;
        this.currentPremultipledAlpha = premultipliedAlpha;
    };
    WebGLState.prototype.setMaterial = function (material, frontFaceCW) {
        material.side === DoubleSide
            ? this.disable(this.gl.CULL_FACE)
            : this.enable(this.gl.CULL_FACE);
        var flipSided = (material.side === BackSide);
        if (frontFaceCW)
            flipSided = !flipSided;
        this.setFlipSided(flipSided);
        material.transparent === true
            ? this.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha)
            : this.setBlending(NoBlending);
        this.depthBuffer.setFunc(material.depthFunc);
        this.depthBuffer.setTest(material.depthTest);
        this.depthBuffer.setMask(material.depthWrite);
        this.colorBuffer.setMask(material.colorWrite);
        this.setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);
    };
    //
    WebGLState.prototype.setFlipSided = function (flipSided) {
        if (this.currentFlipSided !== flipSided) {
            if (flipSided) {
                this.gl.frontFace(this.gl.CW);
            }
            else {
                this.gl.frontFace(this.gl.CCW);
            }
            this.currentFlipSided = flipSided;
        }
    };
    WebGLState.prototype.setCullFace = function (cullFace) {
        if (cullFace !== CullFaceNone) {
            this.enable(this.gl.CULL_FACE);
            if (cullFace !== this.currentCullFace) {
                if (cullFace === CullFaceBack) {
                    this.gl.cullFace(this.gl.BACK);
                }
                else if (cullFace === CullFaceFront) {
                    this.gl.cullFace(this.gl.FRONT);
                }
                else {
                    this.gl.cullFace(this.gl.FRONT_AND_BACK);
                }
            }
        }
        else {
            this.disable(this.gl.CULL_FACE);
        }
        this.currentCullFace = cullFace;
    };
    WebGLState.prototype.setLineWidth = function (width) {
        if (width !== this.currentLineWidth) {
            if (this.lineWidthAvailable)
                this.gl.lineWidth(width);
            this.currentLineWidth = width;
        }
    };
    WebGLState.prototype.setPolygonOffset = function (polygonOffset, factor, units) {
        if (polygonOffset) {
            this.enable(this.gl.POLYGON_OFFSET_FILL);
            if (this.currentPolygonOffsetFactor !== factor || this.currentPolygonOffsetUnits !== units) {
                this.gl.polygonOffset(factor, units);
                this.currentPolygonOffsetFactor = factor;
                this.currentPolygonOffsetUnits = units;
            }
        }
        else {
            this.disable(this.gl.POLYGON_OFFSET_FILL);
        }
    };
    WebGLState.prototype.setScissorTest = function (scissorTest) {
        if (scissorTest) {
            this.enable(this.gl.SCISSOR_TEST);
        }
        else {
            this.disable(this.gl.SCISSOR_TEST);
        }
    };
    // texture
    WebGLState.prototype.activeTexture = function (webglSlot) {
        if (webglSlot === undefined)
            webglSlot = this.gl.TEXTURE0 + this.maxTextures - 1;
        if (this.currentTextureSlot !== webglSlot) {
            this.gl.activeTexture(webglSlot);
            this.currentTextureSlot = webglSlot;
        }
    };
    WebGLState.prototype.bindTexture = function (webglType, webglTexture) {
        if (this.currentTextureSlot === null) {
            this.activeTexture();
        }
        var boundTexture = this.currentBoundTextures[this.currentTextureSlot];
        if (boundTexture === undefined) {
            boundTexture = { type: undefined, texture: undefined };
            this.currentBoundTextures[this.currentTextureSlot] = boundTexture;
        }
        if (boundTexture.type !== webglType || boundTexture.texture !== webglTexture) {
            this.gl.bindTexture(webglType, webglTexture || this.emptyTextures[webglType]);
            boundTexture.type = webglType;
            boundTexture.texture = webglTexture;
        }
    };
    WebGLState.prototype.compressedTexImage2D = function () {
        try {
            this.gl.compressedTexImage2D.apply(this.gl, arguments);
        }
        catch (error) {
            console.error('THREE.WebGLState:', error);
        }
    };
    WebGLState.prototype.texImage2D = function () {
        try {
            this.gl.texImage2D.apply(this.gl, arguments);
        }
        catch (error) {
            console.error('THREE.WebGLState:', error);
        }
    };
    //
    WebGLState.prototype.scissor = function (scissor) {
        if (this.currentScissor.equals(scissor) === false) {
            this.gl.scissor(scissor.x, scissor.y, scissor.z, scissor.w);
            this.currentScissor.copy(scissor);
        }
    };
    WebGLState.prototype.viewport = function (viewport) {
        if (this.currentViewport.equals(viewport) === false) {
            this.gl.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
            this.currentViewport.copy(viewport);
        }
    };
    //
    WebGLState.prototype.reset = function () {
        for (var i = 0; i < this.enabledAttributes.length; i++) {
            if (this.enabledAttributes[i] === 1) {
                this.gl.disableVertexAttribArray(i);
                this.enabledAttributes[i] = 0;
            }
        }
        this.capabilities = {};
        this.compressedTextureFormats = null;
        this.currentTextureSlot = null;
        this.currentBoundTextures = {};
        this.currentProgram = null;
        this.currentBlending = null;
        this.currentFlipSided = null;
        this.currentCullFace = null;
        this.colorBuffer.reset();
        this.depthBuffer.reset();
        this.stencilBuffer.reset();
    };
    return WebGLState;
}());
export { WebGLState };
(function (WebGLState) {
    var ColorBuffer = /** @class */ (function () {
        function ColorBuffer(gl) {
            this.gl = gl;
            this.locked = false;
            this.color = new Vector4();
            this.currentColorMask = null;
            this.currentColorClear = new Vector4(0, 0, 0, 0);
        }
        ColorBuffer.prototype.setMask = function (colorMask) {
            if (this.currentColorMask !== colorMask && !this.locked) {
                this.gl.colorMask(colorMask, colorMask, colorMask, colorMask);
                this.currentColorMask = colorMask;
            }
        };
        ColorBuffer.prototype.setLocked = function (lock) {
            this.locked = lock;
        };
        ColorBuffer.prototype.setClear = function (r, g, b, a, premultipliedAlpha) {
            if (premultipliedAlpha === true) {
                r *= a;
                g *= a;
                b *= a;
            }
            this.color.set(r, g, b, a);
            if (this.currentColorClear.equals(this.color) === false) {
                this.gl.clearColor(r, g, b, a);
                this.currentColorClear.copy(this.color);
            }
        };
        ColorBuffer.prototype.reset = function () {
            this.locked = false;
            this.currentColorMask = null;
            this.currentColorClear.set(-1, 0, 0, 0); // set to invalid state
        };
        return ColorBuffer;
    }());
    WebGLState.ColorBuffer = ColorBuffer;
    var DepthBuffer = /** @class */ (function () {
        function DepthBuffer(gl) {
            this.locked = false;
            this.currentDepthMask = null;
            this.currentDepthFunc = null;
            this.currentDepthClear = null;
            this.gl = gl;
        }
        //TODO:
        DepthBuffer.prototype.setTest = function (depthTest) {
            if (depthTest) {
                //enable( this.gl.DEPTH_TEST );
            }
            else {
                //disable( this.gl.DEPTH_TEST );
            }
        };
        DepthBuffer.prototype.setMask = function (depthMask) {
            if (this.currentDepthMask !== depthMask && !this.locked) {
                this.gl.depthMask(depthMask);
                this.currentDepthMask = depthMask;
            }
        };
        DepthBuffer.prototype.setFunc = function (depthFunc) {
            if (this.currentDepthFunc !== depthFunc) {
                if (depthFunc) {
                    switch (depthFunc) {
                        case NeverDepth:
                            this.gl.depthFunc(this.gl.NEVER);
                            break;
                        case AlwaysDepth:
                            this.gl.depthFunc(this.gl.ALWAYS);
                            break;
                        case LessDepth:
                            this.gl.depthFunc(this.gl.LESS);
                            break;
                        case LessEqualDepth:
                            this.gl.depthFunc(this.gl.LEQUAL);
                            break;
                        case EqualDepth:
                            this.gl.depthFunc(this.gl.EQUAL);
                            break;
                        case GreaterEqualDepth:
                            this.gl.depthFunc(this.gl.GEQUAL);
                            break;
                        case GreaterDepth:
                            this.gl.depthFunc(this.gl.GREATER);
                            break;
                        case NotEqualDepth:
                            this.gl.depthFunc(this.gl.NOTEQUAL);
                            break;
                        default:
                            this.gl.depthFunc(this.gl.LEQUAL);
                    }
                }
                else {
                    this.gl.depthFunc(this.gl.LEQUAL);
                }
                this.currentDepthFunc = depthFunc;
            }
        };
        DepthBuffer.prototype.setLocked = function (lock) {
            this.locked = lock;
        };
        DepthBuffer.prototype.setClear = function (depth) {
            if (this.currentDepthClear !== depth) {
                this.gl.clearDepth(depth);
                this.currentDepthClear = depth;
            }
        };
        DepthBuffer.prototype.reset = function () {
            this.locked = false;
            this.currentDepthMask = null;
            this.currentDepthFunc = null;
            this.currentDepthClear = null;
        };
        return DepthBuffer;
    }());
    WebGLState.DepthBuffer = DepthBuffer;
    var StencilBuffer = /** @class */ (function () {
        function StencilBuffer(gl) {
            this.locked = false;
            this.currentStencilMask = null;
            this.currentStencilFunc = null;
            this.currentStencilRef = null;
            this.currentStencilFuncMask = null;
            this.currentStencilFail = null;
            this.currentStencilZFail = null;
            this.currentStencilZPass = null;
            this.currentStencilClear = null;
            this.gl = gl;
        }
        //TODO:
        StencilBuffer.prototype.setTest = function (stencilTest) {
            if (stencilTest) {
                //enable( this.gl.STENCIL_TEST );
            }
            else {
                //disable( this.gl.STENCIL_TEST );
            }
        };
        StencilBuffer.prototype.setMask = function (stencilMask) {
            if (this.currentStencilMask !== stencilMask && !this.locked) {
                this.gl.stencilMask(stencilMask);
                this.currentStencilMask = stencilMask;
            }
        };
        StencilBuffer.prototype.setFunc = function (stencilFunc, stencilRef, stencilMask) {
            if (this.currentStencilFunc !== stencilFunc ||
                this.currentStencilRef !== stencilRef ||
                this.currentStencilFuncMask !== stencilMask) {
                this.gl.stencilFunc(stencilFunc, stencilRef, stencilMask);
                this.currentStencilFunc = stencilFunc;
                this.currentStencilRef = stencilRef;
                this.currentStencilFuncMask = stencilMask;
            }
        };
        StencilBuffer.prototype.setOp = function (stencilFail, stencilZFail, stencilZPass) {
            if (this.currentStencilFail !== stencilFail ||
                this.currentStencilZFail !== stencilZFail ||
                this.currentStencilZPass !== stencilZPass) {
                this.gl.stencilOp(stencilFail, stencilZFail, stencilZPass);
                this.currentStencilFail = stencilFail;
                this.currentStencilZFail = stencilZFail;
                this.currentStencilZPass = stencilZPass;
            }
        };
        StencilBuffer.prototype.setLocked = function (lock) {
            this.locked = lock;
        };
        StencilBuffer.prototype.setClear = function (stencil) {
            if (this.currentStencilClear !== stencil) {
                this.gl.clearStencil(stencil);
                this.currentStencilClear = stencil;
            }
        };
        StencilBuffer.prototype.reset = function () {
            this.locked = false;
            this.currentStencilMask = null;
            this.currentStencilFunc = null;
            this.currentStencilRef = null;
            this.currentStencilFuncMask = null;
            this.currentStencilFail = null;
            this.currentStencilZFail = null;
            this.currentStencilZPass = null;
            this.currentStencilClear = null;
        };
        return StencilBuffer;
    }());
    WebGLState.StencilBuffer = StencilBuffer;
})(WebGLState || (WebGLState = {}));

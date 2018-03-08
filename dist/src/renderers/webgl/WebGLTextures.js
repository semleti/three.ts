/**
 * @author mrdoob / http://mrdoob.com/
 */
import { LinearFilter, NearestFilter, RGBFormat, RGBAFormat, DepthFormat, DepthStencilFormat, UnsignedShortType, UnsignedIntType, UnsignedInt248Type, FloatType, HalfFloatType, ClampToEdgeWrapping, NearestMipMapLinearFilter, NearestMipMapNearestFilter } from '../../constants';
import { _Math } from '../../math/Math';
var WebGLTextures = /** @class */ (function () {
    function WebGLTextures(_gl, extensions, state, properties, capabilities, utils, infoMemory, infoRender) {
        this._videoTextures = [];
        this._gl = _gl;
        this.extensions = extensions;
        this.properties = properties;
        this.capabilities = capabilities;
        this.state = state;
        this.utils = utils;
        this.infoMemory = infoMemory;
        this.infoRender = infoRender;
        this._isWebGL2 = false; // ( typeof WebGL2RenderingContext !== 'undefined' && _gl instanceof WebGL2RenderingContext );
    }
    //
    WebGLTextures.prototype.clampToMaxSize = function (image, maxSize) {
        if (image.width > maxSize || image.height > maxSize) {
            // Warning: Scaling through the canvas will only work with images that use
            // premultiplied alpha.
            var scale = maxSize / Math.max(image.width, image.height);
            var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            canvas.width = Math.floor(image.width * scale);
            canvas.height = Math.floor(image.height * scale);
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            console.warn('THREE.WebGLRenderer: image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);
            return canvas;
        }
        return image;
    };
    WebGLTextures.prototype.isPowerOfTwo = function (image) {
        return _Math.isPowerOfTwo(image.width) && _Math.isPowerOfTwo(image.height);
    };
    WebGLTextures.prototype.makePowerOfTwo = function (image) {
        if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement || false) {
            if (this._canvas === undefined)
                this._canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            this._canvas.width = _Math.floorPowerOfTwo(image.width);
            this._canvas.height = _Math.floorPowerOfTwo(image.height);
            var context = this._canvas.getContext('2d');
            context.drawImage(image, 0, 0, this._canvas.width, this._canvas.height);
            console.warn('THREE.WebGLRenderer: image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + this._canvas.width + 'x' + this._canvas.height, image);
            return this._canvas;
        }
        return image;
    };
    WebGLTextures.prototype.textureNeedsPowerOfTwo = function (texture) {
        return (texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping) ||
            (texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter);
    };
    WebGLTextures.prototype.textureNeedsGenerateMipmaps = function (texture, isPowerOfTwo) {
        return texture.generateMipmaps && isPowerOfTwo &&
            texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter;
    };
    // Fallback filters for non-power-of-2 textures
    WebGLTextures.prototype.filterFallback = function (f) {
        if (f === NearestFilter || f === NearestMipMapNearestFilter || f === NearestMipMapLinearFilter) {
            return this._gl.NEAREST;
        }
        return this._gl.LINEAR;
    };
    //
    WebGLTextures.prototype.onTextureDispose = function (event) {
        var texture = event.target;
        texture.removeEventListener('dispose', this.onTextureDispose);
        this.deallocateTexture(texture);
        if (texture.isVideoTexture) {
            delete this._videoTextures[texture.id];
        }
        this.infoMemory.textures--;
    };
    WebGLTextures.prototype.onRenderTargetDispose = function (event) {
        var renderTarget = event.target;
        renderTarget.removeEventListener('dispose', this.onRenderTargetDispose);
        this.deallocateRenderTarget(renderTarget);
        this.infoMemory.textures--;
    };
    //
    WebGLTextures.prototype.deallocateTexture = function (texture) {
        var textureProperties = this.properties.get(texture);
        if (texture.image && textureProperties.__image__webglTextureCube) {
            // cube texture
            this._gl.deleteTexture(textureProperties.__image__webglTextureCube);
        }
        else {
            // 2D texture
            if (textureProperties.__webglInit === undefined)
                return;
            this._gl.deleteTexture(textureProperties.__webglTexture);
        }
        // remove all webgl properties
        this.properties.remove(texture);
    };
    WebGLTextures.prototype.deallocateRenderTarget = function (renderTarget) {
        var renderTargetProperties = this.properties.get(renderTarget);
        var textureProperties = this.properties.get(renderTarget.texture);
        if (!renderTarget)
            return;
        if (textureProperties.__webglTexture !== undefined) {
            this._gl.deleteTexture(textureProperties.__webglTexture);
        }
        if (renderTarget.depthTexture) {
            renderTarget.depthTexture.dispose();
        }
        if (renderTarget.isWebGLRenderTargetCube) {
            for (var i = 0; i < 6; i++) {
                this._gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer[i]);
                if (renderTargetProperties.__webglDepthbuffer)
                    this._gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer[i]);
            }
        }
        else {
            this._gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer);
            if (renderTargetProperties.__webglDepthbuffer)
                this._gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer);
        }
        this.properties.remove(renderTarget.texture);
        this.properties.remove(renderTarget);
    };
    //
    WebGLTextures.prototype.setTexture2D = function (texture, slot) {
        var textureProperties = this.properties.get(texture);
        if (texture.isVideoTexture)
            this.updateVideoTexture(texture);
        if (texture.version > 0 && textureProperties.__version !== texture.version) {
            var image = texture.image;
            if (image === undefined) {
                console.warn('THREE.WebGLRenderer: Texture marked for update but image is undefined', texture);
            }
            else if (image.complete === false) {
                console.warn('THREE.WebGLRenderer: Texture marked for update but image is incomplete', texture);
            }
            else {
                this.uploadTexture(textureProperties, texture, slot);
                return;
            }
        }
        this.state.activeTexture(this._gl.TEXTURE0 + slot);
        this.state.bindTexture(this._gl.TEXTURE_2D, textureProperties.__webglTexture);
    };
    WebGLTextures.prototype.setTextureCube = function (texture, slot) {
        var textureProperties = this.properties.get(texture);
        if (texture.image.length === 6) {
            if (texture.version > 0 && textureProperties.__version !== texture.version) {
                if (!textureProperties.__image__webglTextureCube) {
                    texture.addEventListener('dispose', this.onTextureDispose);
                    textureProperties.__image__webglTextureCube = this._gl.createTexture();
                    this.infoMemory.textures++;
                }
                this.state.activeTexture(this._gl.TEXTURE0 + slot);
                this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);
                this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
                var isCompressed = (texture && texture.isCompressedTexture);
                var isDataTexture = (texture.image[0] && texture.image[0].isDataTexture);
                var cubeImage = [];
                for (var i = 0; i < 6; i++) {
                    if (!isCompressed && !isDataTexture) {
                        cubeImage[i] = this.clampToMaxSize(texture.image[i], this.capabilities.maxCubemapSize);
                    }
                    else {
                        cubeImage[i] = isDataTexture ? texture.image[i].image : texture.image[i];
                    }
                }
                var image = cubeImage[0], isPowerOfTwoImage = this.isPowerOfTwo(image), glFormat = this.utils.convert(texture.format), glType = this.utils.convert(texture.type);
                this.setTextureParameters(this._gl.TEXTURE_CUBE_MAP, texture, isPowerOfTwoImage);
                for (var i = 0; i < 6; i++) {
                    if (!isCompressed) {
                        if (isDataTexture) {
                            this.state.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[i].width, cubeImage[i].height, 0, glFormat, glType, cubeImage[i].data);
                        }
                        else {
                            this.state.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[i]);
                        }
                    }
                    else {
                        var mipmap = void 0, mipmaps = cubeImage[i].mipmaps;
                        for (var j = 0, jl = mipmaps.length; j < jl; j++) {
                            mipmap = mipmaps[j];
                            if (texture.format !== RGBAFormat && texture.format !== RGBFormat) {
                                if (this.state.getCompressedTextureFormats().indexOf(glFormat) > -1) {
                                    this.state.compressedTexImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);
                                }
                                else {
                                    console.warn('THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()');
                                }
                            }
                            else {
                                this.state.texImage2D(this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
                            }
                        }
                    }
                }
                if (this.textureNeedsGenerateMipmaps(texture, isPowerOfTwoImage)) {
                    this._gl.generateMipmap(this._gl.TEXTURE_CUBE_MAP);
                }
                textureProperties.__version = texture.version;
                if (texture.onUpdate)
                    texture.onUpdate(texture);
            }
            else {
                this.state.activeTexture(this._gl.TEXTURE0 + slot);
                this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);
            }
        }
    };
    WebGLTextures.prototype.setTextureCubeDynamic = function (texture, slot) {
        this.state.activeTexture(this._gl.TEXTURE0 + slot);
        this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, this.properties.get(texture).__webglTexture);
    };
    WebGLTextures.prototype.setTextureParameters = function (textureType, texture, isPowerOfTwoImage) {
        var extension;
        if (isPowerOfTwoImage) {
            this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_S, this.utils.convert(texture.wrapS));
            this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_T, this.utils.convert(texture.wrapT));
            this._gl.texParameteri(textureType, this._gl.TEXTURE_MAG_FILTER, this.utils.convert(texture.magFilter));
            this._gl.texParameteri(textureType, this._gl.TEXTURE_MIN_FILTER, this.utils.convert(texture.minFilter));
        }
        else {
            this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
            this._gl.texParameteri(textureType, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
            if (texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping) {
                console.warn('THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.', texture);
            }
            this._gl.texParameteri(textureType, this._gl.TEXTURE_MAG_FILTER, this.filterFallback(texture.magFilter));
            this._gl.texParameteri(textureType, this._gl.TEXTURE_MIN_FILTER, this.filterFallback(texture.minFilter));
            if (texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter) {
                console.warn('THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.', texture);
            }
        }
        extension = this.extensions.get('EXT_texture_filter_anisotropic');
        if (extension) {
            if (texture.type === FloatType && this.extensions.get('OES_texture_float_linear') === null)
                return;
            if (texture.type === HalfFloatType && this.extensions.get('OES_texture_half_float_linear') === null)
                return;
            if (texture.anisotropy > 1 || this.properties.get(texture).__currentAnisotropy) {
                this._gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, this.capabilities.getMaxAnisotropy()));
                this.properties.get(texture).__currentAnisotropy = texture.anisotropy;
            }
        }
    };
    WebGLTextures.prototype.uploadTexture = function (textureProperties, texture, slot) {
        if (textureProperties.__webglInit === undefined) {
            textureProperties.__webglInit = true;
            texture.addEventListener('dispose', this.onTextureDispose);
            textureProperties.__webglTexture = this._gl.createTexture();
            this.infoMemory.textures++;
        }
        this.state.activeTexture(this._gl.TEXTURE0 + slot);
        this.state.bindTexture(this._gl.TEXTURE_2D, textureProperties.__webglTexture);
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
        this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha);
        this._gl.pixelStorei(this._gl.UNPACK_ALIGNMENT, texture.unpackAlignment);
        var image = this.clampToMaxSize(texture.image, this.capabilities.maxTextureSize);
        if (this.textureNeedsPowerOfTwo(texture) && this.isPowerOfTwo(image) === false) {
            image = this.makePowerOfTwo(image);
        }
        var isPowerOfTwoImage = this.isPowerOfTwo(image), glFormat = this.utils.convert(texture.format), glType = this.utils.convert(texture.type);
        this.setTextureParameters(this._gl.TEXTURE_2D, texture, isPowerOfTwoImage);
        var mipmap, mipmaps = texture.mipmaps;
        if (texture.isDepthTexture) {
            // populate depth texture with dummy data
            var internalFormat = this._gl.DEPTH_COMPONENT;
            if (texture.type === FloatType) {
                if (!this._isWebGL2)
                    throw new Error('Float Depth Texture only supported in WebGL2.0');
                internalFormat = this._gl.DEPTH_COMPONENT32F;
            }
            else if (this._isWebGL2) {
                // WebGL 2.0 requires signed internalformat for glTexImage2D
                internalFormat = this._gl.DEPTH_COMPONENT16;
            }
            if (texture.format === DepthFormat && internalFormat === this._gl.DEPTH_COMPONENT) {
                // The error INVALID_OPERATION is generated by texImage2D if format and internalformat are
                // DEPTH_COMPONENT and type is not UNSIGNED_SHORT or UNSIGNED_INT
                // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
                if (texture.type !== UnsignedShortType && texture.type !== UnsignedIntType) {
                    console.warn('THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture.');
                    texture.type = UnsignedShortType;
                    glType = this.utils.convert(texture.type);
                }
            }
            // Depth stencil textures need the DEPTH_STENCIL internal format
            // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
            if (texture.format === DepthStencilFormat) {
                internalFormat = this._gl.DEPTH_STENCIL;
                // The error INVALID_OPERATION is generated by texImage2D if format and internalformat are
                // DEPTH_STENCIL and type is not UNSIGNED_INT_24_8_WEBGL.
                // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
                if (texture.type !== UnsignedInt248Type) {
                    console.warn('THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture.');
                    texture.type = UnsignedInt248Type;
                    glType = this.utils.convert(texture.type);
                }
            }
            this.state.texImage2D(this._gl.TEXTURE_2D, 0, internalFormat, image.width, image.height, 0, glFormat, glType, null);
        }
        else if (texture.isDataTexture) {
            // use manually created mipmaps if available
            // if there are no manual mipmaps
            // set 0 level mipmap and then use GL to generate other mipmap levels
            if (mipmaps.length > 0 && isPowerOfTwoImage) {
                for (var i = 0, il = mipmaps.length; i < il; i++) {
                    mipmap = mipmaps[i];
                    this.state.texImage2D(this._gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
                }
                texture.generateMipmaps = false;
            }
            else {
                this.state.texImage2D(this._gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data);
            }
        }
        else if (texture.isCompressedTexture) {
            for (var i = 0, il = mipmaps.length; i < il; i++) {
                mipmap = mipmaps[i];
                if (texture.format !== RGBAFormat && texture.format !== RGBFormat) {
                    if (this.state.getCompressedTextureFormats().indexOf(glFormat) > -1) {
                        this.state.compressedTexImage2D(this._gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);
                    }
                    else {
                        console.warn('THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()');
                    }
                }
                else {
                    this.state.texImage2D(this._gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
                }
            }
        }
        else {
            // regular Texture (image, video, canvas)
            // use manually created mipmaps if available
            // if there are no manual mipmaps
            // set 0 level mipmap and then use GL to generate other mipmap levels
            if (mipmaps.length > 0 && isPowerOfTwoImage) {
                for (var i = 0, il = mipmaps.length; i < il; i++) {
                    mipmap = mipmaps[i];
                    this.state.texImage2D(this._gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap);
                }
                texture.generateMipmaps = false;
            }
            else {
                this.state.texImage2D(this._gl.TEXTURE_2D, 0, glFormat, glFormat, glType, image);
            }
        }
        if (this.textureNeedsGenerateMipmaps(texture, isPowerOfTwoImage))
            this._gl.generateMipmap(this._gl.TEXTURE_2D);
        textureProperties.__version = texture.version;
        if (texture.onUpdate)
            texture.onUpdate(texture);
    };
    // Render targets
    // Setup storage for target texture and bind it to correct framebuffer
    WebGLTextures.prototype.setupFrameBufferTexture = function (framebuffer, renderTarget, attachment, textureTarget) {
        var glFormat = this.utils.convert(renderTarget.texture.format);
        var glType = this.utils.convert(renderTarget.texture.type);
        this.state.texImage2D(textureTarget, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null);
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);
        this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, attachment, textureTarget, this.properties.get(renderTarget.texture).__webglTexture, 0);
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    };
    // Setup storage for internal depth/stencil buffers and bind to correct framebuffer
    WebGLTextures.prototype.setupRenderBufferStorage = function (renderbuffer, renderTarget) {
        this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, renderbuffer);
        if (renderTarget.depthBuffer && !renderTarget.stencilBuffer) {
            this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
            this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, renderbuffer);
        }
        else if (renderTarget.depthBuffer && renderTarget.stencilBuffer) {
            this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
            this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_STENCIL_ATTACHMENT, this._gl.RENDERBUFFER, renderbuffer);
        }
        else {
            // FIXME: We don't support !depth !stencil
            this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.RGBA4, renderTarget.width, renderTarget.height);
        }
        this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);
    };
    // Setup resources for a Depth Texture for a FBO (needs an extension)
    WebGLTextures.prototype.setupDepthTexture = function (framebuffer, renderTarget) {
        var isCube = (renderTarget && renderTarget.isWebGLRenderTargetCube);
        if (isCube)
            throw new Error('Depth Texture with cube render targets is not supported');
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);
        if (!(renderTarget.depthTexture && renderTarget.depthTexture.isDepthTexture)) {
            throw new Error('renderTarget.depthTexture must be an instance of THREE.DepthTexture');
        }
        // upload an empty depth texture with framebuffer size
        if (!this.properties.get(renderTarget.depthTexture).__webglTexture ||
            renderTarget.depthTexture.image.width !== renderTarget.width ||
            renderTarget.depthTexture.image.height !== renderTarget.height) {
            renderTarget.depthTexture.image.width = renderTarget.width;
            renderTarget.depthTexture.image.height = renderTarget.height;
            renderTarget.depthTexture.needsUpdate = true;
        }
        this.setTexture2D(renderTarget.depthTexture, 0);
        var webglDepthTexture = this.properties.get(renderTarget.depthTexture).__webglTexture;
        if (renderTarget.depthTexture.format === DepthFormat) {
            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.TEXTURE_2D, webglDepthTexture, 0);
        }
        else if (renderTarget.depthTexture.format === DepthStencilFormat) {
            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.DEPTH_STENCIL_ATTACHMENT, this._gl.TEXTURE_2D, webglDepthTexture, 0);
        }
        else {
            throw new Error('Unknown depthTexture format');
        }
    };
    // Setup GL resources for a non-texture depth buffer
    WebGLTextures.prototype.setupDepthRenderbuffer = function (renderTarget) {
        var renderTargetProperties = this.properties.get(renderTarget);
        var isCube = (renderTarget.isWebGLRenderTargetCube === true);
        if (renderTarget.depthTexture) {
            if (isCube)
                throw new Error('target.depthTexture not supported in Cube render targets');
            this.setupDepthTexture(renderTargetProperties.__webglFramebuffer, renderTarget);
        }
        else {
            if (isCube) {
                renderTargetProperties.__webglDepthbuffer = [];
                for (var i = 0; i < 6; i++) {
                    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer[i]);
                    renderTargetProperties.__webglDepthbuffer[i] = this._gl.createRenderbuffer();
                    this.setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer[i], renderTarget);
                }
            }
            else {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
                renderTargetProperties.__webglDepthbuffer = this._gl.createRenderbuffer();
                this.setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer, renderTarget);
            }
        }
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    };
    // Set up GL resources for the render target
    WebGLTextures.prototype.setupRenderTarget = function (renderTarget) {
        var renderTargetProperties = this.properties.get(renderTarget);
        var textureProperties = this.properties.get(renderTarget.texture);
        renderTarget.addEventListener('dispose', this.onRenderTargetDispose);
        textureProperties.__webglTexture = this._gl.createTexture();
        this.infoMemory.textures++;
        var isCube = (renderTarget.isWebGLRenderTargetCube === true);
        var isTargetPowerOfTwo = this.isPowerOfTwo(renderTarget);
        // Setup framebuffer
        if (isCube) {
            renderTargetProperties.__webglFramebuffer = [];
            for (var i = 0; i < 6; i++) {
                renderTargetProperties.__webglFramebuffer[i] = this._gl.createFramebuffer();
            }
        }
        else {
            renderTargetProperties.__webglFramebuffer = this._gl.createFramebuffer();
        }
        // Setup color buffer
        if (isCube) {
            this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
            this.setTextureParameters(this._gl.TEXTURE_CUBE_MAP, renderTarget.texture, isTargetPowerOfTwo);
            for (var i = 0; i < 6; i++) {
                this.setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer[i], renderTarget, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_CUBE_MAP_POSITIVE_X + i);
            }
            if (this.textureNeedsGenerateMipmaps(renderTarget.texture, isTargetPowerOfTwo))
                this._gl.generateMipmap(this._gl.TEXTURE_CUBE_MAP);
            this.state.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
        }
        else {
            this.state.bindTexture(this._gl.TEXTURE_2D, textureProperties.__webglTexture);
            this.setTextureParameters(this._gl.TEXTURE_2D, renderTarget.texture, isTargetPowerOfTwo);
            this.setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer, renderTarget, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D);
            if (this.textureNeedsGenerateMipmaps(renderTarget.texture, isTargetPowerOfTwo))
                this._gl.generateMipmap(this._gl.TEXTURE_2D);
            this.state.bindTexture(this._gl.TEXTURE_2D, null);
        }
        // Setup depth and stencil buffers
        if (renderTarget.depthBuffer) {
            this.setupDepthRenderbuffer(renderTarget);
        }
    };
    WebGLTextures.prototype.updateRenderTargetMipmap = function (renderTarget) {
        var texture = renderTarget.texture;
        var isTargetPowerOfTwo = this.isPowerOfTwo(renderTarget);
        if (this.textureNeedsGenerateMipmaps(texture, isTargetPowerOfTwo)) {
            var target = renderTarget.isWebGLRenderTargetCube ? this._gl.TEXTURE_CUBE_MAP : this._gl.TEXTURE_2D;
            var webglTexture = this.properties.get(texture).__webglTexture;
            this.state.bindTexture(target, webglTexture);
            this._gl.generateMipmap(target);
            this.state.bindTexture(target, null);
        }
    };
    WebGLTextures.prototype.updateVideoTexture = function (texture) {
        var id = texture.id;
        var frame = this.infoRender.frame;
        // Check the last frame we updated the VideoTexture
        if (this._videoTextures[id] !== frame) {
            this._videoTextures[id] = frame;
            texture.update();
        }
    };
    return WebGLTextures;
}());
export { WebGLTextures };

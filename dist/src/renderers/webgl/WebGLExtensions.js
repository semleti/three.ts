/**
 * @author mrdoob / http://mrdoob.com/
 */
var WebGLExtensions = /** @class */ (function () {
    function WebGLExtensions(gl) {
        this.extensions = {};
        this.gl = gl;
    }
    WebGLExtensions.prototype.get = function (name) {
        if (this.extensions[name] !== undefined) {
            return this.extensions[name];
        }
        var extension;
        switch (name) {
            case 'WEBGL_depth_texture':
                extension = this.gl.getExtension('WEBGL_depth_texture') || this.gl.getExtension('MOZ_WEBGL_depth_texture') || this.gl.getExtension('WEBKIT_WEBGL_depth_texture');
                break;
            case 'EXT_texture_filter_anisotropic':
                extension = this.gl.getExtension('EXT_texture_filter_anisotropic') || this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
                break;
            case 'WEBGL_compressed_texture_s3tc':
                extension = this.gl.getExtension('WEBGL_compressed_texture_s3tc') || this.gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc') || this.gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
                break;
            case 'WEBGL_compressed_texture_pvrtc':
                extension = this.gl.getExtension('WEBGL_compressed_texture_pvrtc') || this.gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
                break;
            case 'WEBGL_compressed_texture_etc1':
                extension = this.gl.getExtension('WEBGL_compressed_texture_etc1');
                break;
            default:
                extension = this.gl.getExtension(name);
        }
        if (extension === null) {
            console.warn('THREE.WebGLRenderer: ' + name + ' extension not supported.');
        }
        this.extensions[name] = extension;
        return extension;
    };
    return WebGLExtensions;
}());
export { WebGLExtensions };

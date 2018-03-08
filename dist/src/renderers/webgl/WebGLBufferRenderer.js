/**
 * @author mrdoob / http://mrdoob.com/
 */
var WebGLBufferRenderer = /** @class */ (function () {
    function WebGLBufferRenderer(gl, extensions, infoRender) {
        this.gl = gl;
        this.extensions = extensions;
        this.infoRender = infoRender;
    }
    WebGLBufferRenderer.prototype.setMode = function (value) {
        this.mode = value;
    };
    WebGLBufferRenderer.prototype.render = function (start, count) {
        this.gl.drawArrays(this.mode, start, count);
        this.infoRender.calls++;
        this.infoRender.vertices += count;
        if (this.mode === this.gl.TRIANGLES)
            this.infoRender.faces += count / 3;
        else if (this.mode === this.gl.POINTS)
            this.infoRender.points += count;
    };
    WebGLBufferRenderer.prototype.renderInstances = function (geometry, start, count) {
        var extension = this.extensions.get('ANGLE_instanced_arrays');
        if (extension === null) {
            console.error('THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
            return;
        }
        var position = geometry.attributes.position;
        if (position.isInterleavedBufferAttribute) {
            count = position.data.count;
            extension.drawArraysInstancedANGLE(this.mode, 0, count, geometry.maxInstancedCount);
        }
        else {
            extension.drawArraysInstancedANGLE(this.mode, start, count, geometry.maxInstancedCount);
        }
        this.infoRender.calls++;
        this.infoRender.vertices += count * geometry.maxInstancedCount;
        if (this.mode === this.gl.TRIANGLES)
            this.infoRender.faces += geometry.maxInstancedCount * count / 3;
        else if (this.mode === this.gl.POINTS)
            this.infoRender.points += geometry.maxInstancedCount * count;
    };
    return WebGLBufferRenderer;
}());
export { WebGLBufferRenderer };

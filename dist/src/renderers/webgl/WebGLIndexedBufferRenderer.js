/**
 * @author mrdoob / http://mrdoob.com/
 */
var WebGLIndexedBufferRenderer = /** @class */ (function () {
    function WebGLIndexedBufferRenderer(gl, extensions, infoRender) {
        this.gl = gl;
        this.extensions = extensions;
        this.infoRender = infoRender;
    }
    WebGLIndexedBufferRenderer.prototype.setMode = function (value) {
        this.mode = value;
    };
    WebGLIndexedBufferRenderer.prototype.setIndex = function (value) {
        this.type = value.type;
        this.bytesPerElement = value.bytesPerElement;
    };
    WebGLIndexedBufferRenderer.prototype.render = function (start, count) {
        this.gl.drawElements(this.mode, count, this.type, start * this.bytesPerElement);
        this.infoRender.calls++;
        this.infoRender.vertices += count;
        if (this.mode === this.gl.TRIANGLES)
            this.infoRender.faces += count / 3;
        else if (this.mode === this.gl.POINTS)
            this.infoRender.points += count;
    };
    WebGLIndexedBufferRenderer.prototype.renderInstances = function (geometry, start, count) {
        var extension = this.extensions.get('ANGLE_instanced_arrays');
        if (extension === null) {
            console.error('THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
            return;
        }
        extension.drawElementsInstancedANGLE(this.mode, count, this.type, start * this.bytesPerElement, geometry.maxInstancedCount);
        this.infoRender.calls++;
        this.infoRender.vertices += count * geometry.maxInstancedCount;
        if (this.mode === this.gl.TRIANGLES)
            this.infoRender.faces += geometry.maxInstancedCount * count / 3;
        else if (this.mode === this.gl.POINTS)
            this.infoRender.points += geometry.maxInstancedCount * count;
    };
    return WebGLIndexedBufferRenderer;
}());
export { WebGLIndexedBufferRenderer };

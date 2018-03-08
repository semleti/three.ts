/**
 * @author mrdoob / http://mrdoob.com/
 */
import { BackSide } from '../../constants';
import { OrthographicCamera } from '../../cameras/OrthographicCamera';
import { BoxBufferGeometry } from '../../geometries/BoxGeometry';
import { PlaneBufferGeometry } from '../../geometries/PlaneGeometry';
import { MeshBasicMaterial } from '../../materials/MeshBasicMaterial';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { Color } from '../../math/Color';
import { Mesh } from '../../objects/Mesh';
import { ShaderLib } from '../shaders/ShaderLib';
var WebGLBackground = /** @class */ (function () {
    function WebGLBackground(renderer, state, geometries, premultipliedAlpha) {
        this.clearColor = new Color(0x000000);
        this.clearAlpha = 0;
        this.renderer = renderer;
        this.state = state;
        this.geometries = geometries;
        this.premultipliedAlpha = premultipliedAlpha;
    }
    WebGLBackground.prototype.render = function (renderList, scene, camera, forceClear) {
        var background = scene.background;
        if (background === null) {
            this.setClear(this.clearColor, this.clearAlpha);
        }
        else if (background && background.isColor) {
            this.setClear(background, 1);
            forceClear = true;
        }
        if (this.renderer.autoClear || forceClear) {
            this.renderer.clear(this.renderer.autoClearColor, this.renderer.autoClearDepth, this.renderer.autoClearStencil);
        }
        if (background && background.isCubeTexture) {
            if (this.boxMesh === undefined) {
                this.boxMesh = new Mesh(new BoxBufferGeometry(1, 1, 1), new ShaderMaterial({
                    uniforms: ShaderLib.cube.uniforms,
                    vertexShader: ShaderLib.cube.vertexShader,
                    fragmentShader: ShaderLib.cube.fragmentShader,
                    side: BackSide,
                    depthTest: true,
                    depthWrite: false,
                    fog: false
                }));
                this.boxMesh.geometry.removeAttribute('normal');
                this.boxMesh.geometry.removeAttribute('uv');
                this.boxMesh.onBeforeRender = function (renderer, scene, camera) {
                    this.matrixWorld.copyPosition(camera.matrixWorld);
                };
                this.geometries.update(this.boxMesh.geometry);
            }
            this.boxMesh.material.uniforms.tCube.value = background;
            renderList.push(this.boxMesh, this.boxMesh.geometry, this.boxMesh.material, 0, null);
        }
        else if (background && background.isTexture) {
            if (this.planeCamera === undefined) {
                this.planeCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
                this.planeMesh = new Mesh(new PlaneBufferGeometry(2, 2), new MeshBasicMaterial({ depthTest: false, depthWrite: false, fog: false }));
                this.geometries.update(this.planeMesh.geometry);
            }
            this.planeMesh.material.map = background;
            // TODO Push this to renderList
            this.renderer.renderBufferDirect(this.planeCamera, null, this.planeMesh.geometry, this.planeMesh.material, this.planeMesh, null);
        }
    };
    WebGLBackground.prototype.setClear = function (color, alpha) {
        this.state.buffers.color.setClear(color.r, color.g, color.b, alpha, this.premultipliedAlpha);
    };
    WebGLBackground.prototype.getClearColor = function () {
        return this.clearColor;
    };
    WebGLBackground.prototype.setClearColor = function (color, alpha) {
        this.clearColor.set(color);
        this.clearAlpha = alpha !== undefined ? alpha : 1;
        this.setClear(this.clearColor, this.clearAlpha);
    };
    WebGLBackground.prototype.getClearAlpha = function () {
        return this.clearAlpha;
    };
    WebGLBackground.prototype.setClearAlpha = function (alpha) {
        this.clearAlpha = alpha;
        this.setClear(this.clearColor, this.clearAlpha);
    };
    return WebGLBackground;
}());
export { WebGLBackground };

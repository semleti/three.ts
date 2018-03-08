/**
 * @author mrdoob / http://mrdoob.com/
 */
import { Color } from '../../math/Color';
import { Matrix4 } from '../../math/Matrix4';
import { Vector2 } from '../../math/Vector2';
import { Vector3 } from '../../math/Vector3';
var UniformsCache = /** @class */ (function () {
    function UniformsCache() {
        this.lights = {};
    }
    UniformsCache.prototype.get = function (light) {
        if (this.lights[light.id] !== undefined) {
            return this.lights[light.id];
        }
        var uniforms;
        switch (light.type) {
            case 'DirectionalLight':
                uniforms = {
                    direction: new Vector3(),
                    color: new Color(),
                    shadow: false,
                    shadowBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Vector2()
                };
                break;
            case 'SpotLight':
                uniforms = {
                    position: new Vector3(),
                    direction: new Vector3(),
                    color: new Color(),
                    distance: 0,
                    coneCos: 0,
                    penumbraCos: 0,
                    decay: 0,
                    shadow: false,
                    shadowBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Vector2()
                };
                break;
            case 'PointLight':
                uniforms = {
                    position: new Vector3(),
                    color: new Color(),
                    distance: 0,
                    decay: 0,
                    shadow: false,
                    shadowBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Vector2(),
                    shadowCameraNear: 1,
                    shadowCameraFar: 1000
                };
                break;
            case 'HemisphereLight':
                uniforms = {
                    direction: new Vector3(),
                    skyColor: new Color(),
                    groundColor: new Color()
                };
                break;
            case 'RectAreaLight':
                uniforms = {
                    color: new Color(),
                    position: new Vector3(),
                    halfWidth: new Vector3(),
                    halfHeight: new Vector3()
                    // TODO (abelnation): set RectAreaLight shadow uniforms
                };
                break;
        }
        this.lights[light.id] = uniforms;
        return uniforms;
    };
    return UniformsCache;
}());
export { UniformsCache };
var WebGLLights = /** @class */ (function () {
    function WebGLLights() {
        this.cache = new UniformsCache();
        this.state = {
            id: WebGLLights.count++,
            hash: '',
            ambient: [0, 0, 0],
            directional: [],
            directionalShadowMap: [],
            directionalShadowMatrix: [],
            spot: [],
            spotShadowMap: [],
            spotShadowMatrix: [],
            rectArea: [],
            point: [],
            pointShadowMap: [],
            pointShadowMatrix: [],
            hemi: []
        };
        this.vector3 = new Vector3();
        this.matrix4 = new Matrix4();
        this.matrix42 = new Matrix4();
    }
    WebGLLights.prototype.setup = function (lights, shadows, camera) {
        var r = 0, g = 0, b = 0;
        var directionalLength = 0;
        var pointLength = 0;
        var spotLength = 0;
        var rectAreaLength = 0;
        var hemiLength = 0;
        var viewMatrix = camera.matrixWorldInverse;
        for (var i = 0, l = lights.length; i < l; i++) {
            var light = lights[i];
            var color = light.color;
            var intensity = light.intensity;
            var distance = light.distance;
            var shadowMap = (light.shadow && light.shadow.map) ? light.shadow.map.texture : null;
            if (light.isAmbientLight) {
                r += color.r * intensity;
                g += color.g * intensity;
                b += color.b * intensity;
            }
            else if (light.isDirectionalLight) {
                var uniforms = this.cache.get(light);
                uniforms.color.copy(light.color).multiplyScalar(light.intensity);
                uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                this.vector3.setFromMatrixPosition(light.target.matrixWorld);
                uniforms.direction.sub(this.vector3);
                uniforms.direction.transformDirection(viewMatrix);
                uniforms.shadow = light.castShadow;
                if (light.castShadow) {
                    var shadow = light.shadow;
                    uniforms.shadowBias = shadow.bias;
                    uniforms.shadowRadius = shadow.radius;
                    uniforms.shadowMapSize = shadow.mapSize;
                }
                this.state.directionalShadowMap[directionalLength] = shadowMap;
                this.state.directionalShadowMatrix[directionalLength] = light.shadow.matrix;
                this.state.directional[directionalLength] = uniforms;
                directionalLength++;
            }
            else if (light.isSpotLight) {
                var uniforms = this.cache.get(light);
                uniforms.position.setFromMatrixPosition(light.matrixWorld);
                uniforms.position.applyMatrix4(viewMatrix);
                uniforms.color.copy(color).multiplyScalar(intensity);
                uniforms.distance = distance;
                uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                this.vector3.setFromMatrixPosition(light.target.matrixWorld);
                uniforms.direction.sub(this.vector3);
                uniforms.direction.transformDirection(viewMatrix);
                uniforms.coneCos = Math.cos(light.angle);
                uniforms.penumbraCos = Math.cos(light.angle * (1 - light.penumbra));
                uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;
                uniforms.shadow = light.castShadow;
                if (light.castShadow) {
                    var shadow = light.shadow;
                    uniforms.shadowBias = shadow.bias;
                    uniforms.shadowRadius = shadow.radius;
                    uniforms.shadowMapSize = shadow.mapSize;
                }
                this.state.spotShadowMap[spotLength] = shadowMap;
                this.state.spotShadowMatrix[spotLength] = light.shadow.matrix;
                this.state.spot[spotLength] = uniforms;
                spotLength++;
            }
            else if (light.isRectAreaLight) {
                var uniforms = this.cache.get(light);
                // (a) intensity is the total visible light emitted
                //uniforms.color.copy( color ).multiplyScalar( intensity / ( light.width * light.height * Math.PI ) );
                // (b) intensity is the brightness of the light
                uniforms.color.copy(color).multiplyScalar(intensity);
                uniforms.position.setFromMatrixPosition(light.matrixWorld);
                uniforms.position.applyMatrix4(viewMatrix);
                // extract local rotation of light to derive width/height half vectors
                this.matrix42.identity();
                this.matrix4.copy(light.matrixWorld);
                this.matrix4.premultiply(viewMatrix);
                this.matrix42.extractRotation(this.matrix4);
                uniforms.halfWidth.set(light.width * 0.5, 0.0, 0.0);
                uniforms.halfHeight.set(0.0, light.height * 0.5, 0.0);
                uniforms.halfWidth.applyMatrix4(this.matrix42);
                uniforms.halfHeight.applyMatrix4(this.matrix42);
                // TODO (abelnation): RectAreaLight distance?
                // uniforms.distance = distance;
                this.state.rectArea[rectAreaLength] = uniforms;
                rectAreaLength++;
            }
            else if (light.isPointLight) {
                var uniforms = this.cache.get(light);
                uniforms.position.setFromMatrixPosition(light.matrixWorld);
                uniforms.position.applyMatrix4(viewMatrix);
                uniforms.color.copy(light.color).multiplyScalar(light.intensity);
                uniforms.distance = light.distance;
                uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;
                uniforms.shadow = light.castShadow;
                if (light.castShadow) {
                    var shadow = light.shadow;
                    uniforms.shadowBias = shadow.bias;
                    uniforms.shadowRadius = shadow.radius;
                    uniforms.shadowMapSize = shadow.mapSize;
                    uniforms.shadowCameraNear = shadow.camera.near;
                    uniforms.shadowCameraFar = shadow.camera.far;
                }
                this.state.pointShadowMap[pointLength] = shadowMap;
                this.state.pointShadowMatrix[pointLength] = light.shadow.matrix;
                this.state.point[pointLength] = uniforms;
                pointLength++;
            }
            else if (light.isHemisphereLight) {
                var uniforms = this.cache.get(light);
                uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                uniforms.direction.transformDirection(viewMatrix);
                uniforms.direction.normalize();
                uniforms.skyColor.copy(light.color).multiplyScalar(intensity);
                uniforms.groundColor.copy(light.groundColor).multiplyScalar(intensity);
                this.state.hemi[hemiLength] = uniforms;
                hemiLength++;
            }
        }
        this.state.ambient[0] = r;
        this.state.ambient[1] = g;
        this.state.ambient[2] = b;
        this.state.directional.length = directionalLength;
        this.state.spot.length = spotLength;
        this.state.rectArea.length = rectAreaLength;
        this.state.point.length = pointLength;
        this.state.hemi.length = hemiLength;
        this.state.hash = this.state.id + ',' + directionalLength + ',' + pointLength + ',' + spotLength + ',' + rectAreaLength + ',' + hemiLength + ',' + shadows.length;
    };
    WebGLLights.count = 0;
    return WebGLLights;
}());
export { WebGLLights };

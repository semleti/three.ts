/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
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
import { Mesh } from '../objects/Mesh';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { SphereBufferGeometry } from '../geometries/SphereGeometry';
var PointLightHelper = /** @class */ (function (_super) {
    __extends(PointLightHelper, _super);
    function PointLightHelper(light, sphereSize, color) {
        var _this = _super.call(this, new SphereBufferGeometry(sphereSize, 4, 2), new MeshBasicMaterial({ wireframe: true, fog: false })) || this;
        _this.light = light;
        _this.light.updateMatrixWorld();
        _this.color = color;
        _this.matrix = _this.light.matrixWorld;
        _this.matrixAutoUpdate = false;
        _this.update();
        return _this;
        /*
        let distanceGeometry = new THREE.IcosahedronGeometry( 1, 2 );
        let distanceMaterial = new THREE.MeshBasicMaterial( { color: hexColor, fog: false, wireframe: true, opacity: 0.1, transparent: true } );

        this.lightSphere = new THREE.Mesh( bulbGeometry, bulbMaterial );
        this.lightDistance = new THREE.Mesh( distanceGeometry, distanceMaterial );

        let d = light.distance;

        if ( d === 0.0 ) {

            this.lightDistance.visible = false;

        } else {

            this.lightDistance.scale.set( d, d, d );

        }

        this.add( this.lightDistance );
        */
    }
    PointLightHelper.prototype.dispose = function () {
        this.geometry.dispose();
        this.material.dispose();
    };
    PointLightHelper.prototype.update = function () {
        if (this.color !== undefined) {
            this.material.color.set(this.color);
        }
        else {
            this.material.color.copy(this.light.color);
        }
        /*
        let d = this.light.distance;
    
        if ( d === 0.0 ) {
    
            this.lightDistance.visible = false;
    
        } else {
    
            this.lightDistance.visible = true;
            this.lightDistance.scale.set( d, d, d );
    
        }
        */
    };
    return PointLightHelper;
}(Mesh));
export { PointLightHelper };

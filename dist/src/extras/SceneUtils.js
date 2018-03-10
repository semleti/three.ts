import { Matrix4 } from '../math/Matrix4.js';
import { Mesh } from '../objects/Mesh.js';
import { Group } from '../objects/Group.js';
/**
 * @author alteredq / http://alteredqualia.com/
 */
export var SceneUtils;
(function (SceneUtils) {
    function createMultiMaterialObject(geometry, materials) {
        var group = new Group();
        for (var i = 0, l = materials.length; i < l; i++) {
            group.add(new Mesh(geometry, materials[i]));
        }
        return group;
    }
    SceneUtils.createMultiMaterialObject = createMultiMaterialObject;
    function detach(child, parent, scene) {
        child.applyMatrix(parent.matrixWorld);
        parent.remove(child);
        scene.add(child);
    }
    SceneUtils.detach = detach;
    function attach(child, scene, parent) {
        child.applyMatrix(new Matrix4().getInverse(parent.matrixWorld));
        scene.remove(child);
        parent.add(child);
    }
    SceneUtils.attach = attach;
})(SceneUtils || (SceneUtils = {}));

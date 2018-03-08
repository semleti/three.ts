/**
 * @author mrdoob / http://mrdoob.com/
 */
function painterSortStable(a, b) {
    if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
    }
    else if (a.program && b.program && a.program !== b.program) {
        return a.program.id - b.program.id;
    }
    else if (a.material.id !== b.material.id) {
        return a.material.id - b.material.id;
    }
    else if (a.z !== b.z) {
        return a.z - b.z;
    }
    else {
        return a.id - b.id;
    }
}
function reversePainterSortStable(a, b) {
    if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
    }
    if (a.z !== b.z) {
        return b.z - a.z;
    }
    else {
        return a.id - b.id;
    }
}
var WebGLRenderList = /** @class */ (function () {
    function WebGLRenderList() {
        this.renderItems = [];
        this.renderItemsIndex = 0;
        this.opaque = [];
        this.transparent = [];
    }
    WebGLRenderList.prototype.init = function () {
        this.renderItemsIndex = 0;
        this.opaque.length = 0;
        this.transparent.length = 0;
    };
    WebGLRenderList.prototype.push = function (object, geometry, material, z, group) {
        var renderItem = this.renderItems[this.renderItemsIndex];
        if (renderItem === undefined) {
            renderItem = {
                id: object.id,
                object: object,
                geometry: geometry,
                material: material,
                program: material.program,
                renderOrder: object.renderOrder,
                z: z,
                group: group
            };
            this.renderItems[this.renderItemsIndex] = renderItem;
        }
        else {
            renderItem.id = object.id;
            renderItem.object = object;
            renderItem.geometry = geometry;
            renderItem.material = material;
            renderItem.program = material.program;
            renderItem.renderOrder = object.renderOrder;
            renderItem.z = z;
            renderItem.group = group;
        }
        (material.transparent === true ? this.transparent : this.opaque).push(renderItem);
        this.renderItemsIndex++;
    };
    WebGLRenderList.prototype.sort = function () {
        if (this.opaque.length > 1)
            this.opaque.sort(painterSortStable);
        if (this.transparent.length > 1)
            this.transparent.sort(reversePainterSortStable);
    };
    return WebGLRenderList;
}());
export { WebGLRenderList };
var WebGLRenderLists = /** @class */ (function () {
    function WebGLRenderLists() {
        this.lists = {};
    }
    WebGLRenderLists.prototype.get = function (scene, camera) {
        var hash = scene.id + ',' + camera.id;
        var list = this.lists[hash];
        if (list === undefined) {
            // console.log( 'THREE.WebGLRenderLists:', hash );
            list = new WebGLRenderList();
            this.lists[hash] = list;
        }
        return list;
    };
    WebGLRenderLists.prototype.dispose = function () {
        this.lists = {};
    };
    return WebGLRenderLists;
}());
export { WebGLRenderLists };

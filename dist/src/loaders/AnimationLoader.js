import { AnimationClip } from '../animation/AnimationClip';
import { FileLoader } from './FileLoader';
import { DefaultLoadingManager } from './LoadingManager';
/**
 * @author bhouston / http://clara.io/
 */
var AnimationLoader = /** @class */ (function () {
    function AnimationLoader(manager) {
        this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
    }
    AnimationLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        var scope = this;
        var loader = new FileLoader(this.manager);
        loader.load(url, function (text) {
            scope.parse(JSON.parse(text), onLoad);
        }, onProgress, onError);
    };
    AnimationLoader.prototype.parse = function (json, onLoad) {
        var animations = [];
        for (var i = 0; i < json.length; i++) {
            var clip = AnimationClip.parse(json[i]);
            animations.push(clip);
        }
        onLoad(animations);
    };
    return AnimationLoader;
}());
export { AnimationLoader };

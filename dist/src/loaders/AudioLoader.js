import { AudioContext } from '../audio/AudioContext';
import { FileLoader } from './FileLoader';
import { DefaultLoadingManager } from './LoadingManager';
/**
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */
var AudioLoader = /** @class */ (function () {
    function AudioLoader(manager) {
        if (manager === void 0) { manager = DefaultLoadingManager; }
        this.manager = manager;
    }
    AudioLoader.prototype.load = function (url, onLoad, onProgress, onError) {
        var loader = new FileLoader(this.manager);
        loader.setResponseType('arraybuffer');
        loader.load(url, function (buffer) {
            var context = AudioContext.getContext();
            context.decodeAudioData(buffer, function (audioBuffer) {
                onLoad(audioBuffer);
            });
        }, onProgress, onError);
    };
    return AudioLoader;
}());
export { AudioLoader };

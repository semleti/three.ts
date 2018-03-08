/**
 * @author mrdoob / http://mrdoob.com/
 */
var context;
export var AudioContext;
(function (AudioContext) {
    function getContext() {
        if (context === undefined) {
            context = new (window.AudioContext || window.webkitAudioContext)();
        }
        return context;
    }
    AudioContext.getContext = getContext;
    function setContext(value) {
        context = value;
    }
    AudioContext.setContext = setContext;
})(AudioContext || (AudioContext = {}));

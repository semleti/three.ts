/**
 * @author mrdoob / http://mrdoob.com/
 */
var AudioAnalyser = /** @class */ (function () {
    function AudioAnalyser(audio, fftSize) {
        if (fftSize === void 0) { fftSize = 2048; }
        this.analyser = audio.context.createAnalyser();
        this.analyser.fftSize = fftSize;
        this.data = new Uint8Array(this.analyser.frequencyBinCount);
        audio.getOutput().connect(this.analyser);
    }
    AudioAnalyser.prototype.getFrequencyData = function () {
        this.analyser.getByteFrequencyData(this.data);
        return this.data;
    };
    AudioAnalyser.prototype.getAverageFrequency = function () {
        var value = 0, data = this.getFrequencyData();
        for (var i = 0; i < data.length; i++) {
            value += data[i];
        }
        return value / data.length;
    };
    return AudioAnalyser;
}());
export { AudioAnalyser };

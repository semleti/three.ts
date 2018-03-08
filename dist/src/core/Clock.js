/**
 * @author alteredq / http://alteredqualia.com/
 */
var Clock = /** @class */ (function () {
    function Clock(autoStart) {
        this.startTime = 0;
        this.oldTime = 0;
        this.elapsedTime = 0;
        this.running = false;
        this.autoStart = (autoStart !== undefined) ? autoStart : true;
    }
    Clock.prototype.start = function () {
        this.startTime = (typeof performance === 'undefined' ? Date : performance).now(); // see #10732
        this.oldTime = this.startTime;
        this.elapsedTime = 0;
        this.running = true;
    };
    Clock.prototype.stop = function () {
        this.getElapsedTime();
        this.running = false;
        this.autoStart = false;
    };
    Clock.prototype.getElapsedTime = function () {
        this.getDelta();
        return this.elapsedTime;
    };
    Clock.prototype.getDelta = function () {
        var diff = 0;
        if (this.autoStart && !this.running) {
            this.start();
            return 0;
        }
        if (this.running) {
            var newTime = (typeof performance === 'undefined' ? Date : performance).now();
            diff = (newTime - this.oldTime) / 1000;
            this.oldTime = newTime;
            this.elapsedTime += diff;
        }
        return diff;
    };
    return Clock;
}());
export { Clock };

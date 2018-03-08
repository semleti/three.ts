/**
 * @author mrdoob / http://mrdoob.com/
 */
var Layers = /** @class */ (function () {
    function Layers() {
        this.mask = 1 | 0;
    }
    Layers.prototype.set = function (channel) {
        this.mask = 1 << channel | 0;
    };
    Layers.prototype.enable = function (channel) {
        this.mask |= 1 << channel | 0;
    };
    Layers.prototype.toggle = function (channel) {
        this.mask ^= 1 << channel | 0;
    };
    Layers.prototype.disable = function (channel) {
        this.mask &= ~(1 << channel | 0);
    };
    Layers.prototype.test = function (layers) {
        return (this.mask & layers.mask) !== 0;
    };
    return Layers;
}());
export { Layers };

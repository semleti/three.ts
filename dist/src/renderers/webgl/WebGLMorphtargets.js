/**
 * @author mrdoob / http://mrdoob.com/
 */
function absNumericalSort(a, b) {
    return Math.abs(b[1]) - Math.abs(a[1]);
}
var WebGLMorphtargets = /** @class */ (function () {
    function WebGLMorphtargets(gl) {
        this.influencesList = {};
        this.morphInfluences = new Float32Array(8);
        this.gl = gl;
    }
    WebGLMorphtargets.prototype.update = function (object, geometry, material, program) {
        var objectInfluences = object.morphTargetInfluences;
        var length = objectInfluences.length;
        var influences = this.influencesList[geometry.id];
        if (influences === undefined) {
            // initialise list
            influences = [];
            for (var i = 0; i < length; i++) {
                influences[i] = [i, 0];
            }
            this.influencesList[geometry.id] = influences;
        }
        var morphTargets = material.morphTargets && geometry.morphAttributes.position;
        var morphNormals = material.morphNormals && geometry.morphAttributes.normal;
        // Remove current morphAttributes
        for (var i = 0; i < length; i++) {
            var influence = influences[i];
            if (influence[1] !== 0) {
                if (morphTargets)
                    geometry.removeAttribute('morphTarget' + i);
                if (morphNormals)
                    geometry.removeAttribute('morphNormal' + i);
            }
        }
        // Collect influences
        for (var i = 0; i < length; i++) {
            var influence = influences[i];
            influence[0] = i;
            influence[1] = objectInfluences[i];
        }
        influences.sort(absNumericalSort);
        // Add morphAttributes
        for (var i = 0; i < 8; i++) {
            var influence = influences[i];
            if (influence) {
                var index = influence[0];
                var value = influence[1];
                if (value) {
                    if (morphTargets)
                        geometry.addAttribute('morphTarget' + i, morphTargets[index]);
                    if (morphNormals)
                        geometry.addAttribute('morphNormal' + i, morphNormals[index]);
                    this.morphInfluences[i] = value;
                    continue;
                }
            }
            this.morphInfluences[i] = 0;
        }
        program.getUniforms().setValue(this.gl, 'morphTargetInfluences', this.morphInfluences);
    };
    return WebGLMorphtargets;
}());
export { WebGLMorphtargets };

console.log("building THREE...");
var d = new Date();
var timeStart = d.getTime();
var prevTime = timeStart;

var fs = require('fs');
var exec = require('child_process').exec;

compTS();

function compTS(){
    console.log('\ncompiling TypeScript...');
    var cmd = 'tsc';
    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
        if(error)console.error(error);
        if(stderr)console.error(stderr);
        if(stdout)console.log(stdout);
        console.log('compiled TypeScript into "dist/..*.js files: ' + timeDiff());
        copyGLSL();
    });
}

//copy over the glsl files
function copyGLSL(){
    console.log('\ncopying .glsl files from "src/renderers/shaders/ShaderChunk" to "dist/src/renderers/shaders/ShaderChunk"...');
    console.log('copying .glsl files from "src/renderers/shaders/ShaderLib" to "dist/src/renderers/shaders/ShaderLib"...');
    copyFolderRecursiveSync("src/renderers/shaders/ShaderChunk","dist/src/renderers/shaders/ShaderChunk");
    copyFolderRecursiveSync("src/renderers/shaders/ShaderLib","dist/src/renderers/shaders/ShaderLib");
    console.log("copied .glsl files: " + timeDiff());
    remCircular();
}

//remove circular dependency from dist/src/animation/KeyframeTrack.js to force it to be first
//ideally should be fixed in typescript code
function remCircular() {
    console.log('\nremoving circular dependencies...');
    var data = fs.readFileSync('dist/src/animation/KeyframeTrack.js', 'utf-8');
    
    data = data.replace(/import \{ [a-z]*Track \} from '[^;]*';/gi, '');
    data = data.replace("NumberKeyframeTrack","exports.NumberKeyframeTrack");
    data = data.replace("VectorKeyframeTrack","exports.VectorKeyframeTrack");
    data = data.replace("ColorKeyframeTrack","exports.ColorKeyframeTrack");
    data = data.replace("QuaternionKeyframeTrack","exports.QuaternionKeyframeTrack");
    data = data.replace("BooleanKeyframeTrack","exports.BooleanKeyframeTrack");
    data = data.replace("StringKeyframeTrack","exports.StringKeyframeTrack");
  
    fs.writeFileSync('dist/src/animation/KeyframeTrack.js', data, 'utf-8');
  
    console.log('removed circular dependencies from "dist/src/animation/KeyframeTrack.js": ' + timeDiff());
    rollup();
}

//roll everything into a single file using rollupjs
function rollup(){
    console.log('\nrolling everything up...');
    var cmd = 'rollup -c';
    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
        if(error)console.error(error);
        if(stderr)console.error(stderr);
        if(stdout)console.log(stdout);
        console.log('rolled everything into "dist/Three.js": ' + timeDiff());
        removeExtends();
    });
}

//reduce file size by removing multiple __extends$\d declarations
function removeExtends() {
    console.log('\nremoving extends...');
    var data = fs.readFileSync('dist/three.js', 'utf-8');
    //remove all subsequent __extends$\d declarations
    data = data.replace(/\s*var __extends\$\d+ = \(this && this\.__extends\) \|\| \(function \(\) \{\s*var extendStatics = Object\.setPrototypeOf \|\|\s*\(\{ __proto__: \[\] \} instanceof Array && function \(d, b\) \{ d\.__proto__ = b; \}\) \|\|\s*function \(d, b\) \{ for \(var p in b\) if \(b\.hasOwnProperty\(p\)\) d\[p\] = b\[p\]; \};\s*return function \(d, b\) \{\s*extendStatics\(d, b\);\s*function __\(\) \{ this\.constructor = d; \}\s*d\.prototype = b === null \? Object\.create\(b\) : \(__\.prototype = b\.prototype, new __\(\)\);\s*\};\s*\}\)\(\);/gim, '');
    //rename all calls from __extends$\d to __extends
    data = data.replace(/__extends\$\d+\(/gim, '__extends(');
  
    fs.writeFileSync('dist/three.js', data, 'utf-8');
  
    console.log('removed multiple __extends declarations in "dist/three.js": ' + timeDiff());
    closure();
}

//reduce filesize by using google-closure
function closure(){
    console.log('\ncompiling using google-closure...');
    var cmd = 'google-closure-compiler --js dist/three.js --js_output_file dist/three.min.js --warning_level=VERBOSE --jscomp_off=globalThis --jscomp_off=checkTypes --externs utils/build/externs.js --language_in=ECMASCRIPT5_STRICT';
    //var cmd = 'google-closure-compiler --js dist/three.js --js_output_file dist/three.min.js --jscomp_off=globalThis --jscomp_off=checkTypes --externs utils/build/externs.js --language_in=ECMASCRIPT5_STRICT --compilation_level=ADVANCED_OPTIMIZATIONS';
    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
        if(error)console.error(error);
        if(stderr)console.error(stderr);
        if(stdout)console.log(stdout);
        console.log('minified using google-closure-compiler into "dist/three.min.js: ' + timeDiff());
        end();
    });
}



function end(){
    console.log("\nfinished building THREE: " + Math.trunc(fs.statSync("dist/three.min.js").size / 1024.0) + "Ko " + (new Date().getTime() - timeStart) / 1000 + "s")
}

function timeDiff(){
    var n = new Date().getTime();
    var t = (n - prevTime) / 1000.0;
    prevTime = n;
    return t + 's';
}



/* code by Simon Seyock
https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
*/

var fs = require('fs');
var path = require('path');

function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    //check if folder needs to be created or integrated
    if ( !fs.existsSync( target ) ) {
        fs.mkdirSync( target );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, target );
            } else {
                copyFileSync( curSource, target );
            }
        } );
    }
}
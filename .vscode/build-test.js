var exec = require('child_process').exec;

var d = new Date();
var timeStart = d.getTime();
var prevTime = timeStart;

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
    rollupTest();
}

function rollupTest(){
    console.log('\nrolling everything up...');
    var cmd = 'rollup -c test/rollup.unit.config.js';
    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
        if(error)console.error(error);
        if(stderr)console.error(stderr);
        if(stdout)console.log(stdout);
        console.log('rolled everything into "test/unit/three.source.unit.js": ' + timeDiff());
    });
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
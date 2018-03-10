# three.ts
Ongoing port of [three.js](https://github.com/mrdoob/three.js) to [TypeScript](https://www.typescriptlang.org).  
Currently using revision 91dev.  


## Goals
Harness the strong typing of TypeScript to make life easier:
- easier bug detection
- quicker learning of the library
- 'cleaner codebase' (subject to taste)  

Stay compatible with pure js projects.  
  
Future proof by hoping the compiler will do all the work? (maybe, not sure how TypeScript will evolve).
  
Could possibly facilitate library maintenance?


## Dev Environmnent
This project is set up to work with [VisualStudio Code](https://code.visualstudio.com).  
In order to build the project, it requires [npm](https://www.npmjs.com), [rollup](https://www.npmjs.com/package/rollup), and [google-closure-compiler](https://www.npmjs.com/package/google-closure-compiler).  
Execute the task 'Build THREE' to build the project.  
You can find the task by 'ctrl+shit+P' and typing 'task'.  
'Build TEST' allows to build the unit tests.
The tests require [qunit](https://www.npmjs.com/package/qunit).

## Status
The entire project is using TypeScript.  
~90% of the typings are done.  
~2% of the typings are janky.  
~1% of the typings are wrong.  
I got it working for a personal project (although with having a little ordering issue when rendering).  
The project currently passes all unit tests except for 4 (which is better than the js version from my what I can tell :p ) (I just cheated a little bit ;( ).  
~80% of the examples are working, despite a few render artifacts.
#### Also:
This is my first real Github repo, so I have no clue what I'm doing ¯\\\_(ツ)_/¯


## BUGGY
Buggy.  
LOTS of BUGS!  
Do NOT use!  
A bit less buggy now that I've fixed a few using the unit tests.
  
I'm a novice at three.js, so I stumbled my way to this point.  
Most bugs will likely arise from these sources (I think):  
- wrong scope for 'this' while I was moving stuff around
- uninitialised properties
- temporary hacks to get it to compile I forgot about
- typos? (most should have been caught by TypeScript and google-closure-compiler, but you never know)


## Build
The build process is controlled by the '.vscode/build.js' script:  
- calls tsc to compile TypeScript to js (options specified in 'tsconfig.json')
- copies the .glsl files from 'src/renderers/ShaderChunk|ShaderLib' to 'dist/src/renderers/ShaderChunk|ShaderLib' to make sure rollup finds them
- removes the imports from 'animation/KeframeTrack.js' to prevent circular dependencies messing with the load order and adds 'exports.' for the symbols removed from the import (temporary hack)
- calls rollup (options specified in 'rollup.config.js')
- removes the multiple __extends declaration created by TypeScript which didn't get cleaned up by rollup
- calls google-closure-compiler (-js)  
/!\\ google-closure-compiler-js has stopped working for me, so I switched to google-closure-compiler, gonna investigate this later

The build takes ~15s on my machine (i7-4770) and the resulting file is 575Ko big, which is > 50Ko than the js version.  
Once gzipped, it's 133Ko big, which is > 4Ko than the js version.  
This makes me hopefull that it'll be possible to reach a similar build size.  
The size difference is most likely due to the way TypeScript creates classes and handles prototypes.  


## RoadMap
- ~~Port the tests and examples from [three.js](https://github.com/mrdoob/three.js/) to TypeScript to make sure everything works as intended.~~ **done** (probably going to keep them on the js side actually)
- Resolve the circular dependencies.
- Finish and correct the typings.
- Contact the three.js maintainers to maybe cooperate? (I'll need help to make three.ts production ready).
- Might want to take a look at [static default values](http://bet365techblog.com/default-values-typescript) to improve performance.  
- Look into google-closure-compiler advanced_optimizations as it is able to produce a 421Ko file, gziped 110Ko. [export](https://developers.google.com/closure/compiler/docs/api-tutorial3#export) all the things?
- Change the prototype handling to be a [var](https://github.com/Microsoft/TypeScript/issues/9638) ?
- Push to npm? (maybe?)
- Remove most warnings at some point since they aren't required when using TypeScript's typing system (maybe remove them at compilation time to get 2 different builds, one with and one without?)
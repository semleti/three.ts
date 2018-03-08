/**
 * @author tschw
 *
 * Uniforms of a program.
 * Those form a tree structure with a special top-level container for the root,
 * which you get by calling 'new WebGLUniforms( gl, program, renderer )'.
 *
 *
 * Properties of inner nodes including the top-level container:
 *
 * .seq - array of nested uniforms
 * .map - nested uniforms by name
 *
 *
 * Methods of all nodes except the top-level container:
 *
 * .setValue( gl, value, [renderer] )
 *
 * 		uploads a uniform value(s)
 *  	the 'renderer' parameter is needed for sampler uniforms
 *
 *
 * Static methods of the top-level container (renderer factorizations):
 *
 * .upload( gl, seq, values, renderer )
 *
 * 		sets uniforms in 'seq' to 'values[id].value'
 *
 * .seqWithValue( seq, values ) : filteredSeq
 *
 * 		filters 'seq' entries with corresponding entry in values
 *
 *
 * Methods of the top-level container (renderer factorizations):
 *
 * .setValue( gl, name, value )
 *
 * 		sets uniform with  name 'name' to 'value'
 *
 * .set( gl, obj, prop )
 *
 * 		sets uniform from object and property with same name than uniform
 *
 * .setOptional( gl, obj, prop )
 *
 * 		like .set for an optional property of the object
 *
 */

import { CubeTexture } from '../../textures/CubeTexture';
import { Texture } from '../../textures/Texture';
import { Vector2 } from '../../math/Vector2';
import { Vector3 } from '../../math/Vector3';
import { Color } from '../../math/Color';
import { Vector4 } from '../../math/Vector4';
import { Matrix4 } from '../../math/Matrix4';
import { Matrix3 } from '../../math/Matrix3';

let emptyTexture = new Texture();
let emptyCubeTexture = new CubeTexture();

// --- Base for inner nodes (including the root) ---

export class UniformContainer {

	seq = [];
	map = {};

}

// --- Utilities ---

// Array Caches (provide typed arrays for temporary by size)

let arrayCacheF32 = [];
let arrayCacheI32 = [];

// Float32Array caches used for uploading Matrix uniforms

let mat4array = new Float32Array( 16 );
let mat3array = new Float32Array( 9 );

// Flattening for arrays of vectors and matrices

function flatten( array : Array<any>, nBlocks : number, blockSize : number ) : Float32Array | Array<any> {

	let firstElem = array[ 0 ];

	if ( firstElem <= 0 || firstElem > 0 ) return array;
	// unoptimized: ! isNaN( firstElem )
	// see http://jacksondunstan.com/articles/983

	let n = nBlocks * blockSize,
		r = arrayCacheF32[ n ];

	if ( r === undefined ) {

		r = new Float32Array( n );
		arrayCacheF32[ n ] = r;

	}

	if ( nBlocks !== 0 ) {

		firstElem.toArray( r, 0 );

		for ( let i = 1, offset = 0; i !== nBlocks; ++ i ) {

			offset += blockSize;
			array[ i ].toArray( r, offset );

		}

	}

	return r;

}

// Texture unit allocation

function allocTexUnits( renderer : any, n : number ) : Array<any> {

	let r = arrayCacheI32[ n ];

	if ( r === undefined ) {

		r = new Int32Array( n );
		arrayCacheI32[ n ] = r;

	}

	for ( let i = 0; i !== n; ++ i )
		r[ i ] = renderer.allocTextureUnit();

	return r;

}

// --- Setters ---

// Note: Defining these methods externally, because they come in a bunch
// and this way their names minify.

// Single scalar

function setValue1f( gl : any, v : number ) : void {

	gl.uniform1f( this.addr, v );

}

function setValue1i( gl : any, v : number ) : void {

	gl.uniform1i( this.addr, v );

}

// Single float vector (from flat array or THREE.VectorN)

function setValue2fv( gl : any, v : Vector2 ) : void {

	if ( v.x === undefined ) {

		gl.uniform2fv( this.addr, v );

	} else {

		gl.uniform2f( this.addr, v.x, v.y );

	}

}

function setValue3fv( gl : any, v : Vector3 | Color ) : void {

	if ( (v as Vector3).x !== undefined ) {

		gl.uniform3f( this.addr, (v as Vector3).x, (v as Vector3).y, (v as Vector3).z );

	} else if ( (v as Color).r !== undefined ) {

		gl.uniform3f( this.addr, (v as Color).r, (v as Color).g, (v as Color).b );

	} else {

		gl.uniform3fv( this.addr, v );

	}

}

function setValue4fv( gl : any, v : Vector4 ) : void {

	if ( v.x === undefined ) {

		gl.uniform4fv( this.addr, v );

	} else {

		 gl.uniform4f( this.addr, v.x, v.y, v.z, v.w );

	}

}

// Single matrix (from flat array or MatrixN)

function setValue2fm( gl, v : Matrix4 | Matrix3 | Array<any> ) : void {

	gl.uniformMatrix2fv( this.addr, false, (v as Matrix3|Matrix4).elements || v );

}

function setValue3fm( gl : any, v : number | Matrix3 ) : void {

	if ( (v as Matrix3).elements === undefined ) {

		gl.uniformMatrix3fv( this.addr, false, v );

	} else {

		mat3array.set( (v as Matrix3).elements );
		gl.uniformMatrix3fv( this.addr, false, mat3array );

	}

}

function setValue4fm( gl : any, v : number | Matrix4 ) : void {

	if ( (v as Matrix4).elements === undefined ) {

		gl.uniformMatrix4fv( this.addr, false, v );

	} else {

		mat4array.set( (v as Matrix4).elements );
		gl.uniformMatrix4fv( this.addr, false, mat4array );

	}

}

// Single texture (2D / Cube)

function setValueT1( gl : any, v : any, renderer : any ) : any {

	let unit = renderer.allocTextureUnit();
	gl.uniform1i( this.addr, unit );
	renderer.setTexture2D( v || emptyTexture, unit );

}

function setValueT6( gl : any, v : any, renderer : any ) : void {

	let unit = renderer.allocTextureUnit();
	gl.uniform1i( this.addr, unit );
	renderer.setTextureCube( v || emptyCubeTexture, unit );

}

// Integer / Boolean vectors or arrays thereof (always flat arrays)

function setValue2iv( gl : any, v : Array<number> ) : void {

	gl.uniform2iv( this.addr, v );

}

function setValue3iv( gl : any, v : Array<number> ) : void {

	gl.uniform3iv( this.addr, v );

}

function setValue4iv( gl : any, v : Array<number> ) : void {

	gl.uniform4iv( this.addr, v );

}

// Helper to pick the right setter for the singular case

function getSingularSetter( type : number ) : Function {

	switch ( type ) {

		case 0x1406: return setValue1f; // FLOAT
		case 0x8b50: return setValue2fv; // _VEC2
		case 0x8b51: return setValue3fv; // _VEC3
		case 0x8b52: return setValue4fv; // _VEC4

		case 0x8b5a: return setValue2fm; // _MAT2
		case 0x8b5b: return setValue3fm; // _MAT3
		case 0x8b5c: return setValue4fm; // _MAT4

		case 0x8b5e: case 0x8d66: return setValueT1; // SAMPLER_2D, SAMPLER_EXTERNAL_OES
		case 0x8b60: return setValueT6; // SAMPLER_CUBE

		case 0x1404: case 0x8b56: return setValue1i; // INT, BOOL
		case 0x8b53: case 0x8b57: return setValue2iv; // _VEC2
		case 0x8b54: case 0x8b58: return setValue3iv; // _VEC3
		case 0x8b55: case 0x8b59: return setValue4iv; // _VEC4

	}

}

// Array of scalars

function setValue1fv( gl : any, v : number ) : void {

	gl.uniform1fv( this.addr, v );

}
function setValue1iv( gl : any, v : number ) : void {

	gl.uniform1iv( this.addr, v );

}

// Array of vectors (flat or from THREE classes)

function setValueV2a( gl : any, v : Array<Vector2> ) : void {

	gl.uniform2fv( this.addr, flatten( v, this.size, 2 ) );

}

function setValueV3a( gl : any, v : Array<Vector3> ) : void {

	gl.uniform3fv( this.addr, flatten( v, this.size, 3 ) );

}

function setValueV4a( gl : any, v : Array<Vector4> ) : void {

	gl.uniform4fv( this.addr, flatten( v, this.size, 4 ) );

}

// Array of matrices (flat or from THREE clases)

function setValueM2a( gl : any, v : Array<Matrix3> ) : void {

	gl.uniformMatrix2fv( this.addr, false, flatten( v, this.size, 4 ) );

}

function setValueM3a( gl : any, v : Array<Matrix3> ) : void {

	gl.uniformMatrix3fv( this.addr, false, flatten( v, this.size, 9 ) );

}

function setValueM4a( gl : any, v : Array<Matrix4> ) : void {

	gl.uniformMatrix4fv( this.addr, false, flatten( v, this.size, 16 ) );

}

// Array of textures (2D / Cube)

function setValueT1a( gl : any, v : Array<any>, renderer : any ) : void {

	let n = v.length,
		units = allocTexUnits( renderer, n );

	gl.uniform1iv( this.addr, units );

	for ( let i = 0; i !== n; ++ i ) {

		renderer.setTexture2D( v[ i ] || emptyTexture, units[ i ] );

	}

}

function setValueT6a( gl : any, v : Array<any>, renderer : any ) : void {

	let n = v.length,
		units = allocTexUnits( renderer, n );

	gl.uniform1iv( this.addr, units );

	for ( let i = 0; i !== n; ++ i ) {

		renderer.setTextureCube( v[ i ] || emptyCubeTexture, units[ i ] );

	}

}

// Helper to pick the right setter for a pure (bottom-level) array

function getPureArraySetter( type : number ) : Function {

	switch ( type ) {

		case 0x1406: return setValue1fv; // FLOAT
		case 0x8b50: return setValueV2a; // _VEC2
		case 0x8b51: return setValueV3a; // _VEC3
		case 0x8b52: return setValueV4a; // _VEC4

		case 0x8b5a: return setValueM2a; // _MAT2
		case 0x8b5b: return setValueM3a; // _MAT3
		case 0x8b5c: return setValueM4a; // _MAT4

		case 0x8b5e: return setValueT1a; // SAMPLER_2D
		case 0x8b60: return setValueT6a; // SAMPLER_CUBE

		case 0x1404: case 0x8b56: return setValue1iv; // INT, BOOL
		case 0x8b53: case 0x8b57: return setValue2iv; // _VEC2
		case 0x8b54: case 0x8b58: return setValue3iv; // _VEC3
		case 0x8b55: case 0x8b59: return setValue4iv; // _VEC4

	}

}

// --- Uniform Classes ---

function SingleUniform( id : string, activeInfo : any, addr : number ) {

	this.id = id;
	this.addr = addr;
	this.setValue = getSingularSetter( activeInfo.type );

	// this.path = activeInfo.name; // DEBUG

}

function PureArrayUniform( id : string, activeInfo : any, addr : number ) {

	this.id = id;
	this.addr = addr;
	this.size = activeInfo.size;
	this.setValue = getPureArraySetter( activeInfo.type );

	// this.path = activeInfo.name; // DEBUG

}

export class StructuredUniform extends UniformContainer {

	id : string;
	constructor( id : string ){
		super();
		this.id = id;

	}

	setValue ( gl : any, value : any ) : void {

		// Note: Don't need an extra 'renderer' parameter, since samplers
		// are not allowed in structured uniforms.
	
		let seq = this.seq;
	
		for ( let i = 0, n = seq.length; i !== n; ++ i ) {
	
			let u = seq[ i ];
			u.setValue( gl, value[ u.id ] );
	
		}
	
	}

}

// --- Top-level ---

// Parser - builds up the property tree from the path strings

let RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g;

// extracts
// 	- the identifier (member name or array index)
//  - followed by an optional right bracket (found when array index)
//  - followed by an optional left bracket or dot (type of subscript)
//
// Note: These portions can be read in a non-overlapping fashion and
// allow straightforward parsing of the hierarchy that WebGL encodes
// in the uniform names.

function addUniform( container : any, uniformObject : any ) : void {

	container.seq.push( uniformObject );
	container.map[ uniformObject.id ] = uniformObject;

}

function parseUniform( activeInfo : any, addr : number, container : any ) : void {

	let path = activeInfo.name,
		pathLength = path.length;

	// reset RegExp object, because of the early exit of a previous run
	RePathPart.lastIndex = 0;

	for ( ; ; ) {

		let match = RePathPart.exec( path ),
			matchEnd = RePathPart.lastIndex,

			id = match[ 1 ] as any,
			idIsIndex = match[ 2 ] === ']',
			subscript = match[ 3 ];

		if ( idIsIndex ) id = id | 0; // convert to integer

		if ( subscript === undefined || subscript === '[' && matchEnd + 2 === pathLength ) {

			// bare name or "pure" bottom-level array "[0]" suffix

			addUniform( container, subscript === undefined ?
				new SingleUniform( id, activeInfo, addr ) :
				new PureArrayUniform( id, activeInfo, addr ) );

			break;

		} else {

			// step into inner node / create it in case it doesn't exist

			let map = container.map, next = map[ id ];

			if ( next === undefined ) {

				next = new StructuredUniform( id );
				addUniform( container, next );

			}

			container = next;

		}

	}

}

// Root Container

export class WebGLUniforms extends UniformContainer {

	renderer;
	constructor( gl : any, program : any, renderer : any ){
		super();
		this.renderer = renderer;
	
		let n = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );
	
		for ( let i = 0; i < n; ++ i ) {
	
			let info = gl.getActiveUniform( program, i ),
				path = info.name,
				addr = gl.getUniformLocation( program, path );
	
			parseUniform( info, addr, this );
	
		}
	}

	setValue ( gl : any, name : string, value : any ) : void {

		let u = this.map[ name ];
	
		if ( u !== undefined ) u.setValue( gl, value, this.renderer );
	
	}

	setOptional ( gl : any, object : any, name : string ) : void {

		let v = object[ name ];
	
		if ( v !== undefined ) this.setValue( gl, name, v );
	
	}

	static upload ( gl : any, seq : any, values : Array<any>, renderer : any ) : void {

		for ( let i = 0, n = seq.length; i !== n; ++ i ) {
	
			let u = seq[ i ],
				v = values[ u.id ];
	
			if ( v.needsUpdate !== false ) {
	
				// note: always updating when .needsUpdate is undefined
				u.setValue( gl, v.value, renderer );
	
			}
	
		}
	
	}

	static seqWithValue ( seq : any, values : Array<any> ) : Array<any> {

		let r = [];
	
		for ( let i = 0, n = seq.length; i !== n; ++ i ) {
	
			let u = seq[ i ];
			if ( u.id in values ) r.push( u );
	
		}
	
		return r;
	
	}

}

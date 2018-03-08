/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

import { CanvasTexture } from '../../textures/CanvasTexture';
import { Vector3 } from '../../math/Vector3';
import { Quaternion } from '../../math/Quaternion';
import { Scene } from '../../scenes/Scene';
import { Camera } from '../../cameras/Camera';
import { WebGLRenderer, Sprite } from '../../Three';

export class WebGLSpriteRenderer {

	vertexBuffer; elementBuffer;
	program; attributes; uniforms;

	texture;

	// decompose matrixWorld

	spritePosition = new Vector3();
	spriteRotation = new Quaternion();
	spriteScale = new Vector3();

	renderer : WebGLRenderer;
	gl : any;
	state : any;
	textures : any;
	capabilities : any;
	constructor( renderer : WebGLRenderer, gl : any, state : any, textures : any, capabilities : any ){
		this.renderer = renderer;
		this.gl = gl;
		this.state = state;
		this.textures = textures;
		this.capabilities = capabilities;
	}

	init() : void {

		let vertices = new Float32Array( [
			- 0.5, - 0.5, 0, 0,
			  0.5, - 0.5, 1, 0,
			  0.5, 0.5, 1, 1,
			- 0.5, 0.5, 0, 1
		] );

		let faces = new Uint16Array( [
			0, 1, 2,
			0, 2, 3
		] );

		this.vertexBuffer = this.gl.createBuffer();
		this.elementBuffer = this.gl.createBuffer();

		this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
		this.gl.bufferData( this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW );

		this.gl.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer );
		this.gl.bufferData( this.gl.ELEMENT_ARRAY_BUFFER, faces, this.gl.STATIC_DRAW );

		this.program = this.createProgram();

		this.attributes = {
			position: this.gl.getAttribLocation( this.program, 'position' ),
			uv: this.gl.getAttribLocation( this.program, 'uv' )
		};

		this.uniforms = {
			uvOffset: this.gl.getUniformLocation( this.program, 'uvOffset' ),
			uvScale: this.gl.getUniformLocation( this.program, 'uvScale' ),

			rotation: this.gl.getUniformLocation( this.program, 'rotation' ),
			center: this.gl.getUniformLocation( this.program, 'center' ),
			scale: this.gl.getUniformLocation( this.program, 'scale' ),

			color: this.gl.getUniformLocation( this.program, 'color' ),
			map: this.gl.getUniformLocation( this.program, 'map' ),
			opacity: this.gl.getUniformLocation( this.program, 'opacity' ),

			modelViewMatrix: this.gl.getUniformLocation( this.program, 'modelViewMatrix' ),
			projectionMatrix: this.gl.getUniformLocation( this.program, 'projectionMatrix' ),

			fogType: this.gl.getUniformLocation( this.program, 'fogType' ),
			fogDensity: this.gl.getUniformLocation( this.program, 'fogDensity' ),
			fogNear: this.gl.getUniformLocation( this.program, 'fogNear' ),
			fogFar: this.gl.getUniformLocation( this.program, 'fogFar' ),
			fogColor: this.gl.getUniformLocation( this.program, 'fogColor' ),
			fogDepth: this.gl.getUniformLocation( this.program, 'fogDepth' ),

			alphaTest: this.gl.getUniformLocation( this.program, 'alphaTest' )
		};

		let canvas = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ) as HTMLCanvasElement;
		canvas.width = 8;
		canvas.height = 8;

		let context = canvas.getContext( '2d' );
		context.fillStyle = 'white';
		context.fillRect( 0, 0, 8, 8 );

		this.texture = new CanvasTexture( canvas );

	}

	render ( sprites : Array<Sprite>, scene : Scene, camera : Camera ) : void {

		if ( sprites.length === 0 ) return;

		// setup gl

		if ( this.program === undefined ) {

			this.init();

		}

		this.state.useProgram( this.program );

		this.state.initAttributes();
		this.state.enableAttribute( this.attributes.position );
		this.state.enableAttribute( this.attributes.uv );
		this.state.disableUnusedAttributes();

		this.state.disable( this.gl.CULL_FACE );
		this.state.enable( this.gl.BLEND );

		this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.vertexBuffer );
		this.gl.vertexAttribPointer( this.attributes.position, 2, this.gl.FLOAT, false, 2 * 8, 0 );
		this.gl.vertexAttribPointer( this.attributes.uv, 2, this.gl.FLOAT, false, 2 * 8, 8 );

		this.gl.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer );

		this.gl.uniformMatrix4fv( this.uniforms.projectionMatrix, false, camera.projectionMatrix.elements );

		this.state.activeTexture( this.gl.TEXTURE0 );
		this.gl.uniform1i( this.uniforms.map, 0 );

		let oldFogType = 0;
		let sceneFogType = 0;
		let fog = scene.fog;

		if ( fog ) {

			this.gl.uniform3f( this.uniforms.fogColor, fog.color.r, fog.color.g, fog.color.b );

			if ( fog.isFog ) {

				this.gl.uniform1f( this.uniforms.fogNear, fog.near );
				this.gl.uniform1f( this.uniforms.fogFar, fog.far );

				this.gl.uniform1i( this.uniforms.fogType, 1 );
				oldFogType = 1;
				sceneFogType = 1;

			} else if ( fog.isFogExp2 ) {

				this.gl.uniform1f( this.uniforms.fogDensity, fog.density );

				this.gl.uniform1i( this.uniforms.fogType, 2 );
				oldFogType = 2;
				sceneFogType = 2;

			}

		} else {

			this.gl.uniform1i( this.uniforms.fogType, 0 );
			oldFogType = 0;
			sceneFogType = 0;

		}


		// update positions and sort

		for ( let i = 0, l = sprites.length; i < l; i ++ ) {

			let sprite = sprites[ i ];

			sprite.modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, sprite.matrixWorld );
			sprite.z = - sprite.modelViewMatrix.elements[ 14 ];

		}

		sprites.sort( this.painterSortStable );

		// render all sprites

		let scale = [];
		let center = [];

		for ( let i = 0, l = sprites.length; i < l; i ++ ) {

			let sprite = sprites[ i ];
			let material = sprite.material;

			if ( material.visible === false ) continue;

			sprite.onBeforeRender( this.renderer, scene, camera, undefined, material, undefined );

			this.gl.uniform1f( this.uniforms.alphaTest, material.alphaTest );
			this.gl.uniformMatrix4fv( this.uniforms.modelViewMatrix, false, sprite.modelViewMatrix.elements );

			sprite.matrixWorld.decompose( this.spritePosition, this.spriteRotation, this.spriteScale );

			scale[ 0 ] = this.spriteScale.x;
			scale[ 1 ] = this.spriteScale.y;

			center[ 0 ] = sprite.center.x - 0.5;
			center[ 1 ] = sprite.center.y - 0.5;

			let fogType = 0;

			if ( scene.fog && material.fog ) {

				fogType = sceneFogType;

			}

			if ( oldFogType !== fogType ) {

				this.gl.uniform1i( this.uniforms.fogType, fogType );
				oldFogType = fogType;

			}

			if ( material.map !== null ) {

				this.gl.uniform2f( this.uniforms.uvOffset, material.map.offset.x, material.map.offset.y );
				this.gl.uniform2f( this.uniforms.uvScale, material.map.repeat.x, material.map.repeat.y );

			} else {

				this.gl.uniform2f( this.uniforms.uvOffset, 0, 0 );
				this.gl.uniform2f( this.uniforms.uvScale, 1, 1 );

			}

			this.gl.uniform1f( this.uniforms.opacity, material.opacity );
			this.gl.uniform3f( this.uniforms.color, material.color.r, material.color.g, material.color.b );

			this.gl.uniform1f( this.uniforms.rotation, material.rotation );
			this.gl.uniform2fv( this.uniforms.center, center );
			this.gl.uniform2fv( this.uniforms.scale, scale );

			this.state.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha );
			this.state.buffers.depth.setTest( material.depthTest );
			this.state.buffers.depth.setMask( material.depthWrite );
			this.state.buffers.color.setMask( material.colorWrite );

			this.textures.setTexture2D( material.map || this.texture, 0 );

			this.gl.drawElements( this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0 );

			sprite.onAfterRender( this.renderer, scene, camera, undefined, material, undefined );

		}

		// restore gl

		this.state.enable( this.gl.CULL_FACE );

		this.state.reset();

	}

	createProgram() : any {

		let program = this.gl.createProgram();

		let vertexShader = this.gl.createShader( this.gl.VERTEX_SHADER );
		let fragmentShader = this.gl.createShader( this.gl.FRAGMENT_SHADER );

		this.gl.shaderSource( vertexShader, [

			'precision ' + this.capabilities.precision + ' float;',

			'#define SHADER_NAME ' + 'SpriteMaterial',

			'uniform mat4 modelViewMatrix;',
			'uniform mat4 projectionMatrix;',
			'uniform float rotation;',
			'uniform vec2 center;',
			'uniform vec2 scale;',
			'uniform vec2 uvOffset;',
			'uniform vec2 uvScale;',

			'attribute vec2 position;',
			'attribute vec2 uv;',

			'varying vec2 vUV;',
			'varying float fogDepth;',

			'void main() {',

			'	vUV = uvOffset + uv * uvScale;',

			'	vec2 alignedPosition = ( position - center ) * scale;',

			'	vec2 rotatedPosition;',
			'	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;',
			'	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;',

			'	vec4 mvPosition;',

			'	mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
			'	mvPosition.xy += rotatedPosition;',

			'	gl_Position = projectionMatrix * mvPosition;',

			'	fogDepth = - mvPosition.z;',

			'}'

		].join( '\n' ) );

		this.gl.shaderSource( fragmentShader, [

			'precision ' + this.capabilities.precision + ' float;',

			'#define SHADER_NAME ' + 'SpriteMaterial',

			'uniform vec3 color;',
			'uniform sampler2D map;',
			'uniform float opacity;',

			'uniform int fogType;',
			'uniform vec3 fogColor;',
			'uniform float fogDensity;',
			'uniform float fogNear;',
			'uniform float fogFar;',
			'uniform float alphaTest;',

			'varying vec2 vUV;',
			'varying float fogDepth;',

			'void main() {',

			'	vec4 texture = texture2D( map, vUV );',

			'	gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );',

			'	if ( gl_FragColor.a < alphaTest ) discard;',

			'	if ( fogType > 0 ) {',

			'		float fogFactor = 0.0;',

			'		if ( fogType == 1 ) {',

			'			fogFactor = smoothstep( fogNear, fogFar, fogDepth );',

			'		} else {',

			'			const float LOG2 = 1.442695;',
			'			fogFactor = exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 );',
			'			fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );',

			'		}',

			'		gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );',

			'	}',

			'}'

		].join( '\n' ) );

		this.gl.compileShader( vertexShader );
		this.gl.compileShader( fragmentShader );

		this.gl.attachShader( this.program, vertexShader );
		this.gl.attachShader( this.program, fragmentShader );

		this.gl.linkProgram( program );

		return program;

	}

	painterSortStable( a : any, b : any ) {

		if ( a.renderOrder !== b.renderOrder ) {

			return a.renderOrder - b.renderOrder;

		} else if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return b.id - a.id;

		}

	}

}
import { Material } from './Material';
import { UniformsUtils } from '../renderers/shaders/UniformsUtils';
import { Object3D } from '../Three';

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  defines: { "label" : "value" },
 *  uniforms: { "parameter1": { value: 1.0 }, "parameter2": { value2: 2 } },
 *
 *  fragmentShader: <string>,
 *  vertexShader: <string>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  lights: <bool>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */

export class ShaderMaterial extends Material {

	type : string = 'ShaderMaterial';
	defines;uniforms;vertexShader;fragmentShader;clipping;morphNormals;
	extensions;defaultAttributeValues;index0AttributeName;uniformsNeedUpdate;
	isShaderMaterial : boolean = true;
	constructor( parameters : any ){
		super();
		this.defines = {};
		this.uniforms = {};
	
		this.vertexShader = 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';
		this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';
	
		this.linewidth = 1;
	
		this.wireframe = false;
		this.wireframeLinewidth = 1;
	
		this.fog = false; // set to use scene fog
		this.lights = false; // set to use scene lights
		this.clipping = false; // set to use user-defined clipping planes
	
		this.skinning = false; // set to use skinning attribute streams
		this.morphTargets = false; // set to use morph targets
		this.morphNormals = false; // set to use morph normals
	
		this.extensions = {
			derivatives: false, // set to use derivatives
			fragDepth: false, // set to use fragment depth values
			drawBuffers: false, // set to use draw buffers
			shaderTextureLOD: false // set to use shader texture LOD
		};
	
		// When rendered geometry doesn't include these attributes but the material does,
		// use these default values in WebGL. This avoids errors when buffer data is missing.
		this.defaultAttributeValues = {
			'color': [ 1, 1, 1 ],
			'uv': [ 0, 0 ],
			'uv2': [ 0, 0 ]
		};
	
		this.index0AttributeName = undefined;
		this.uniformsNeedUpdate = false;
	
		if ( parameters !== undefined ) {
	
			if ( parameters.attributes !== undefined ) {
	
				console.error( 'THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead.' );
	
			}
	
			this.setValues( parameters );
	
		}
	}

	copy ( source  : ShaderMaterial) : ShaderMaterial {

		super.copy(source );
	
		this.fragmentShader = source.fragmentShader;
		this.vertexShader = source.vertexShader;
	
		this.uniforms = UniformsUtils.clone( source.uniforms );
	
		this.defines = source.defines;
	
		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
	
		this.lights = source.lights;
		this.clipping = source.clipping;
	
		this.skinning = source.skinning;
	
		this.morphTargets = source.morphTargets;
		this.morphNormals = source.morphNormals;
	
		this.extensions = source.extensions;
	
		return this;
	
	}

	toJSON ( meta : Object3D.MetaData ) : ShaderMaterial.Data {

		let data = super.toJSON(meta ) as ShaderMaterial.Data;
	
		data.uniforms = this.uniforms;
		data.vertexShader = this.vertexShader;
		data.fragmentShader = this.fragmentShader;
	
		return data;
	
	}

}

export module ShaderMaterial{
	export class Data extends Material.Data{
		uniforms;
		vertexShader;
		fragmentShader;
	}
}
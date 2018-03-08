import { BufferAttribute, InterleavedBufferAttribute } from "../../Three";

/**
 * @author mrdoob / http://mrdoob.com/
 */

export class WebGLAttributes {

	gl : any;
	constructor( gl : any ){
		this.gl = gl;
	}
	buffers = {};

	createBuffer( attribute : BufferAttribute, bufferType : any ) {

		let array = attribute.array;
		let usage = attribute.dynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;

		let buffer = this.gl.createBuffer();

		this.gl.bindBuffer( bufferType, buffer );
		this.gl.bufferData( bufferType, array, usage );

		attribute.onUploadCallback();

		let type = this.gl.FLOAT;

		if ( array instanceof Float32Array ) {

			type = this.gl.FLOAT;

		} else if ( array instanceof Float64Array ) {

			console.warn( 'THREE.WebGLAttributes: Unsupported data buffer format: Float64Array.' );

		} else if ( array instanceof Uint16Array ) {

			type = this.gl.UNSIGNED_SHORT;

		} else if ( array instanceof Int16Array ) {

			type = this.gl.SHORT;

		} else if ( array instanceof Uint32Array ) {

			type = this.gl.UNSIGNED_INT;

		} else if ( array instanceof Int32Array ) {

			type = this.gl.INT;

		} else if ( array instanceof Int8Array ) {

			type = this.gl.BYTE;

		} else if ( array instanceof Uint8Array ) {

			type = this.gl.UNSIGNED_BYTE;

		}

		return {
			buffer: buffer,
			type: type,
			bytesPerElement: array.BYTES_PER_ELEMENT,
			version: attribute.version
		};

	}

	updateBuffer( buffer : any, attribute : BufferAttribute, bufferType : any ) : void {

		let array = attribute.array;
		let updateRange = attribute.updateRange;

		this.gl.bindBuffer( bufferType, buffer );

		if ( attribute.dynamic === false ) {

			this.gl.bufferData( bufferType, array, this.gl.STATIC_DRAW );

		} else if ( updateRange.count === - 1 ) {

			// Not using update ranges

			this.gl.bufferSubData( bufferType, 0, array );

		} else if ( updateRange.count === 0 ) {

			console.error( 'THREE.WebGLObjects.updateBuffer: dynamic THREE.BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.' );

		} else {

			this.gl.bufferSubData( bufferType, updateRange.offset * array.BYTES_PER_ELEMENT,
				array.subarray( updateRange.offset, updateRange.offset + updateRange.count ) );

			updateRange.count = - 1; // reset range

		}

	}

	//

	get( attribute : BufferAttribute | InterleavedBufferAttribute ) : any {

		if ( (attribute as InterleavedBufferAttribute).isInterleavedBufferAttribute ) (attribute as any) = (attribute as InterleavedBufferAttribute).data;

		return this.buffers[ attribute.uuid ];

	}

	remove( attribute : any ) : void {

		if ( attribute.isInterleavedBufferAttribute ) attribute = attribute.data;

		let data = this.buffers[ attribute.uuid ];

		if ( data ) {

			this.gl.deleteBuffer( data.buffer );

			delete this.buffers[ attribute.uuid ];

		}

	}

	update( attribute : BufferAttribute | InterleavedBufferAttribute, bufferType : any ) : void {

		if ( (attribute as InterleavedBufferAttribute).isInterleavedBufferAttribute ) (attribute as any) = (attribute as InterleavedBufferAttribute).data;

		let data = this.buffers[ attribute.uuid ];

		if ( data === undefined ) {

			this.buffers[ attribute.uuid ] = this.createBuffer( attribute as BufferAttribute, bufferType );

		} else if ( data.version < (attribute as BufferAttribute).version ) {

			this.updateBuffer( data.buffer, (attribute as BufferAttribute), bufferType );

			data.version = (attribute as BufferAttribute).version;

		}

	}


}
/**
 * @author tschw
 */

import { Matrix3 } from '../../math/Matrix3';
import { Plane } from '../../math/Plane';
import { Camera } from '../../cameras/Camera';

export class WebGLClipping {


	globalState = null;
	numGlobalPlanes : number = 0;
	localClippingEnabled : boolean = false;
	renderingShadows : boolean = false;

	plane : Plane = new Plane();
	viewNormalMatrix : Matrix3 = new Matrix3();

	uniform = { value: null, needsUpdate: false };

	numPlanes : number = 0;
	numIntersection : number = 0;

	init ( planes : Array<Plane>, enableLocalClipping : boolean, camera : Camera ) {

		let enabled =
			planes.length !== 0 ||
			enableLocalClipping ||
			// enable state of previous frame - the clipping code has to
			// run another frame in order to reset the state:
			this.numGlobalPlanes !== 0 ||
			this.localClippingEnabled;

			this.localClippingEnabled = enableLocalClipping;

			this.globalState = this.projectPlanes( planes, camera, 0 );
			this.numGlobalPlanes = planes.length;

		return enabled;

	}

	beginShadows () : void {

		this.renderingShadows = true;
		this.projectPlanes( null );

	}

	endShadows () : void {

		this.renderingShadows = false;
		this.resetGlobalState();

	}

	setState ( planes : Array<Plane>, clipIntersection : number, clipShadows : boolean, camera : Camera, cache : any, fromCache : boolean ) : void {

		if ( ! this.localClippingEnabled || planes === null || planes.length === 0 || this.renderingShadows && ! clipShadows ) {

			// there's no local clipping

			if ( this.renderingShadows ) {

				// there's no global clipping

				this.projectPlanes( null );

			} else {

				this.resetGlobalState();

			}

		} else {

			let nGlobal = this.renderingShadows ? 0 : this.numGlobalPlanes,
				lGlobal = nGlobal * 4,

				dstArray = cache.clippingState || null;

			this.uniform.value = dstArray; // ensure unique state

			dstArray = this.projectPlanes( planes, camera, lGlobal, fromCache );

			for ( let i = 0; i !== lGlobal; ++ i ) {

				dstArray[ i ] = this.globalState[ i ];

			}

			cache.clippingState = dstArray;
			this.numIntersection = clipIntersection ? this.numPlanes : 0;
			this.numPlanes += nGlobal;

		}


	}

	resetGlobalState() : void {

		if ( this.uniform.value !== this.globalState ) {

			this.uniform.value = this.globalState;
			this.uniform.needsUpdate = this.numGlobalPlanes > 0;

		}

		this.numPlanes = this.numGlobalPlanes;
		this.numIntersection = 0;

	}

	projectPlanes( planes : Array<Plane>, camera? : Camera, dstOffset? : number, skipTransform? : boolean ) {

		let nPlanes = planes !== null ? planes.length : 0,
			dstArray = null;

		if ( nPlanes !== 0 ) {

			dstArray = this.uniform.value;

			if ( skipTransform !== true || dstArray === null ) {

				let flatSize = dstOffset + nPlanes * 4,
					viewMatrix = camera.matrixWorldInverse;

				this.viewNormalMatrix.getNormalMatrix( viewMatrix );

				if ( dstArray === null || dstArray.length < flatSize ) {

					dstArray = new Float32Array( flatSize );

				}

				for ( let i = 0, i4 = dstOffset; i !== nPlanes; ++ i, i4 += 4 ) {

					this.plane.copy( planes[ i ] ).applyMatrix4( viewMatrix, this.viewNormalMatrix );

					this.plane.normal.toArray( dstArray, i4 );
					dstArray[ i4 + 3 ] = this.plane.constant;

				}

			}

			this.uniform.value = dstArray;
			this.uniform.needsUpdate = true;

		}

		this.numPlanes = nPlanes;

		return dstArray;

	}

}

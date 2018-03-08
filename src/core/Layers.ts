/**
 * @author mrdoob / http://mrdoob.com/
 */

export class Layers {

	mask : number = 1 | 0;

	set ( channel : number ) : void {

		this.mask = 1 << channel | 0;

	}

	enable ( channel : number ) : void {

		this.mask |= 1 << channel | 0;

	}

	toggle ( channel : number ) : void {

		this.mask ^= 1 << channel | 0;

	}

	disable ( channel : number ) : void {

		this.mask &= ~ ( 1 << channel | 0 );

	}

	test ( layers ) : boolean {

		return ( this.mask & layers.mask ) !== 0;

	}

}

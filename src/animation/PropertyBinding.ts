import { AnimationClip } from "./AnimationClip";
import { AnimationObjectGroup } from "./AnimationObjectGroup";
import { SkinnedMesh } from "../Three";

/**
 *
 * A reference to a real property in the scene graph.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

// Characters [].:/ are reserved for track binding syntax.
let RESERVED_CHARS_RE = '\\[\\]\\.:\\/"%';


export class PropertyBinding {
	path : string;
	parsedPath : PropertyBinding.ParsedPath;
	rootNode : AnimationClip;
	_cacheIndex : number;
	//TODO: create class parsedPath defined in PropertyBinding.parseTrackName
	constructor( rootNode : AnimationClip, path : string, parsedPath : PropertyBinding.ParsedPath ){
		this.path = path;
		this.parsedPath = parsedPath || PropertyBinding.parseTrackName(path);

		this.node = PropertyBinding.findNode( rootNode, this.parsedPath.nodeName ) || rootNode;

		this.rootNode = rootNode;
	}

	Composite : PropertyBinding.Composite;

	static create ( root : AnimationClip|AnimationObjectGroup, path, parsedPath ) : PropertyBinding {

		if ( ! ( root && (root as AnimationObjectGroup).isAnimationObjectGroup ) ) {

			return new PropertyBinding( root as AnimationClip, path, parsedPath );

		} else {

			return new PropertyBinding.Composite( root as AnimationObjectGroup, path, parsedPath );

		}

	}

	/**
	 * Replaces spaces with underscores and removes unsupported characters from
	 * node names, to ensure compatibility with parseTrackName().
	 *
	 * @param  {string} name Node name to be sanitized.
	 * @return {string}
	 */
	static sanitizeNodeName( name : string ) : string {
		let reservedRe = new RegExp( '[' + RESERVED_CHARS_RE + ']', 'g' );
		return name.replace( /\s/g, '_' ).replace( reservedRe, '' );

	}

	static parseTrackName = function () {

		// Attempts to allow node names from any language. ES5's `\w` regexp matches
		// only latin characters, and the unicode \p{L} is not yet supported. So
		// instead, we exclude reserved characters and match everything else.
		let wordChar = '[^' + RESERVED_CHARS_RE + ']';
		let wordCharOrDot = '[^' + RESERVED_CHARS_RE.replace( '\\.', '' ) + ']';

		// Parent directories, delimited by '/' or ':'. Currently unused, but must
		// be matched to parse the rest of the track name.
		let directoryRe = /((?:WC+[\/:])*)/.source.replace( 'WC', wordChar );

		// Target node. May contain word characters (a-zA-Z0-9_) and '.' or '-'.
		let nodeRe = /(WCOD+)?/.source.replace( 'WCOD', wordCharOrDot );

		// Object on target node, and accessor. May not contain reserved
		// characters. Accessor may contain any character except closing bracket.
		let objectRe = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace( 'WC', wordChar );

		// Property and accessor. May not contain reserved characters. Accessor may
		// contain any non-bracket characters.
		let propertyRe = /\.(WC+)(?:\[(.+)\])?/.source.replace( 'WC', wordChar );

		let trackRe = new RegExp( ''
			+ '^'
			+ directoryRe
			+ nodeRe
			+ objectRe
			+ propertyRe
			+ '$'
		);

		let supportedObjectNames = [ 'material', 'materials', 'bones' ];

		return function parseTrackName( trackName : string ) : PropertyBinding.ParsedPath {

			let matches = trackRe.exec( trackName );

			if ( ! matches ) {

				throw new Error( 'PropertyBinding: Cannot parse trackName: ' + trackName );

			}

			let results = new PropertyBinding.ParsedPath();
			// directoryName: matches[ 1 ], // (tschw) currently unused
			results.nodeName = matches[ 2 ];
			results.objectName = matches[ 3 ];
			results.objectIndex = matches[ 4 ];
			results.propertyName = matches[ 5 ]; // required
			results.propertyIndex = matches[ 6 ];

			let lastDot = results.nodeName && results.nodeName.lastIndexOf( '.' );

			if ( lastDot !== undefined && lastDot !== - 1 ) {

				let objectName = results.nodeName.substring( lastDot + 1 );

				// Object names must be checked against a whitelist. Otherwise, there
				// is no way to parse 'foo.bar.baz': 'baz' must be a property, but
				// 'bar' could be the objectName, or part of a nodeName (which can
				// include '.' characters).
				if ( supportedObjectNames.indexOf( objectName ) !== - 1 ) {

					results.nodeName = results.nodeName.substring( 0, lastDot );
					results.objectName = objectName;

				}

			}

			if ( results.propertyName === null || results.propertyName.length === 0 ) {

				throw new Error( 'PropertyBinding: can not parse propertyName from trackName: ' + trackName );

			}

			return results;

		};

	}();

	static searchNodeSubtree ( children : Array<any>, nodeName : string|number ) : any {

		for ( let i = 0; i < children.length; i ++ ) {

			let childNode = children[ i ];

			if ( childNode.name === nodeName || childNode.uuid === nodeName ) {

				return childNode;

			}

			let result = this.searchNodeSubtree( childNode.children, nodeName );

			if ( result ) return result;

		}

		return null;

	}

	static findNode ( root : any, nodeName : string|number ) : any {

		if ( ! nodeName || nodeName === "" || nodeName === "root" || nodeName === "." || nodeName === - 1 || nodeName === root.name || nodeName === root.uuid ) {

			return root;

		}

		// search into skeleton bones.
		if ( root.skeleton ) {

			let bone = root.skeleton.getBoneByName( nodeName );

			if ( bone !== undefined ) {

				return bone;

			}

		}

		// search into node subtree.
		if ( root.children ) {

			

			let subTreeNode = this.searchNodeSubtree( root.children, nodeName );

			if ( subTreeNode ) {

				return subTreeNode;

			}

		}

		return null;

	}
 // prototype, continued

	// these are used to "bind" a nonexistent property
	_getValue_unavailable () {};
	_setValue_unavailable () {};
	resolvedProperty;
	propertyIndex;
	targetObject;

	BindingType = {
		Direct: 0,
		EntireArray: 1,
		ArrayElement: 2,
		HasFromToArray: 3
	};

	Versioning = {
		None: 0,
		NeedsUpdate: 1,
		MatrixWorldNeedsUpdate: 2
	};

	//TODO: change to TypeScript style
	GetterByBindingType = [

		function getValue_direct( buffer, offset ) : void {

			buffer[ offset ] = this.node[ this.propertyName ];

		},

		function getValue_array( buffer, offset ) : void {

			var source = this.resolvedProperty;

			for ( var i = 0, n = source.length; i !== n; ++ i ) {

				buffer[ offset ++ ] = source[ i ];

			}

		},

		function getValue_arrayElement( buffer, offset ) : void {

			buffer[ offset ] = this.resolvedProperty[ this.propertyIndex ];

		},

		function getValue_toArray( buffer, offset ) : void {

			this.resolvedProperty.toArray( buffer, offset );

		}

	];

	SetterByBindingTypeAndVersioning = [
		[
			// Direct

			function setValue_direct( buffer, offset : number ) : void {

				this.targetObject[ this.propertyName ] = buffer[ offset ];

			},

			function setValue_direct_setNeedsUpdate( buffer, offset : number ) : void {

				this.targetObject[ this.propertyName ] = buffer[ offset ];
				this.targetObject.needsUpdate = true;

			},

			function setValue_direct_setMatrixWorldNeedsUpdate( buffer, offset : number ) : void {

				this.targetObject[ this.propertyName ] = buffer[ offset ];
				this.targetObject.matrixWorldNeedsUpdate = true;

			}

		], [

			// EntireArray

			function setValue_array( buffer, offset : number ) : void {

				var dest = this.resolvedProperty;

				for ( var i = 0, n = dest.length; i !== n; ++ i ) {

					dest[ i ] = buffer[ offset ++ ];

				}

			},

			function setValue_array_setNeedsUpdate( buffer, offset : number ) : void {

				var dest = this.resolvedProperty;

				for ( var i = 0, n = dest.length; i !== n; ++ i ) {

					dest[ i ] = buffer[ offset ++ ];

				}

				this.targetObject.needsUpdate = true;

			},

			function setValue_array_setMatrixWorldNeedsUpdate( buffer, offset : number ) : void {

				var dest = this.resolvedProperty;

				for ( var i = 0, n = dest.length; i !== n; ++ i ) {

					dest[ i ] = buffer[ offset ++ ];

				}

				this.targetObject.matrixWorldNeedsUpdate = true;

			}

		], [

			// ArrayElement

			function setValue_arrayElement( buffer, offset : number ) : void {

				this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];

			},

			function setValue_arrayElement_setNeedsUpdate( buffer, offset : number ) : void {

				this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];
				this.targetObject.needsUpdate = true;

			},

			function setValue_arrayElement_setMatrixWorldNeedsUpdate( buffer, offset : number ) : void {

				this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];
				this.targetObject.matrixWorldNeedsUpdate = true;

			}

		], [

			// HasToFromArray

			function setValue_fromArray( buffer, offset : number ) : void {

				this.resolvedProperty.fromArray( buffer, offset );

			},

			function setValue_fromArray_setNeedsUpdate( buffer, offset : number ) : void {

				this.resolvedProperty.fromArray( buffer, offset );
				this.targetObject.needsUpdate = true;

			},

			function setValue_fromArray_setMatrixWorldNeedsUpdate( buffer, offset : number ) : void {

				this.resolvedProperty.fromArray( buffer, offset );
				this.targetObject.matrixWorldNeedsUpdate = true;

			}

		]

	];

	getValue_direct( buffer, offset : number ) : void {

		buffer[ offset ] = this.node[ this.propertyName ];

	}

	getValue_array( buffer, offset : number ) : void {

		let source = this.resolvedProperty;

		for ( let i = 0, n = source.length; i !== n; ++ i ) {

			buffer[ offset ++ ] = source[ i ];

		}

	}

	getValue_arrayElement( buffer, offset : number ) : void {

		buffer[ offset ] = this.resolvedProperty[ this.propertyIndex ];

	}

	getValue_toArray( buffer, offset : number ) : void {

		this.resolvedProperty.toArray( buffer, offset );

	}

	setValue_direct( buffer, offset : number ) : void {

		this.targetObject[ this.propertyName ] = buffer[ offset ];

	}

	setValue_direct_setNeedsUpdate( buffer, offset : number ) : void {

		this.targetObject[ this.propertyName ] = buffer[ offset ];
		this.targetObject.needsUpdate = true;

	}

	setValue_direct_setMatrixWorldNeedsUpdate( buffer, offset : number ) : void {

		this.targetObject[ this.propertyName ] = buffer[ offset ];
		this.targetObject.matrixWorldNeedsUpdate = true;

	}

	// EntireArray

	setValue_array( buffer, offset : number ) : void {

		let dest = this.resolvedProperty;

		for ( let i = 0, n = dest.length; i !== n; ++ i ) {

			dest[ i ] = buffer[ offset ++ ];

		}

	}

	setValue_array_setNeedsUpdate( buffer, offset : number ) : void {

		let dest = this.resolvedProperty;

		for ( let i = 0, n = dest.length; i !== n; ++ i ) {

			dest[ i ] = buffer[ offset ++ ];

		}

		this.targetObject.needsUpdate = true;

	}

	setValue_array_setMatrixWorldNeedsUpdate( buffer, offset : number ) : void {

		let dest = this.resolvedProperty;

		for ( let i = 0, n = dest.length; i !== n; ++ i ) {

			dest[ i ] = buffer[ offset ++ ];

		}

		this.targetObject.matrixWorldNeedsUpdate = true;

	}

	// ArrayElement

	setValue_arrayElement( buffer, offset : number ) : void {

		this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];

	}

	setValue_arrayElement_setNeedsUpdate( buffer, offset : number ) : void {

		this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];
		this.targetObject.needsUpdate = true;

	}

	setValue_arrayElement_setMatrixWorldNeedsUpdate( buffer, offset : number ) : void {

		this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];
		this.targetObject.matrixWorldNeedsUpdate = true;

	}

	// HasToFromArray

	setValue_fromArray( buffer, offset : number ) : void {

		this.resolvedProperty.fromArray( buffer, offset );

	}

	setValue_fromArray_setNeedsUpdate( buffer, offset : number ) : void {

		this.resolvedProperty.fromArray( buffer, offset );
		this.targetObject.needsUpdate = true;

	}

	setValue_fromArray_setMatrixWorldNeedsUpdate( buffer, offset : number ) : void {

		this.resolvedProperty.fromArray( buffer, offset );
		this.targetObject.matrixWorldNeedsUpdate = true;

	}

	


	getValue = function getValue_unbound( targetArray, offset : number ) : void {

		this.bind();
		this.getValue( targetArray, offset );

		// Note: This class uses a State pattern on a per-method basis:
		// 'bind' sets 'this.getValue' / 'setValue' and shadows the
		// prototype version of these methods with one that represents
		// the bound state. When the property is not found, the methods
		// become no-ops.

	}

	setValue = function setValue_unbound( sourceArray, offset : number ) : void {

		this.bind();
		this.setValue( sourceArray, offset );

	}

	// create getter / setter pair for a property in the scene graph
	bind () : void {

		let targetObject = this.node,
			parsedPath = this.parsedPath,

			objectName = parsedPath.objectName,
			propertyName = parsedPath.propertyName,
			propertyIndex = parsedPath.propertyIndex;

		if ( ! targetObject ) {

			targetObject = PropertyBinding.findNode( this.rootNode, parsedPath.nodeName ) || this.rootNode;

			this.node = targetObject;

		}

		// set fail state so we can just 'return' on error
		this.getValue = this._getValue_unavailable;
		this.setValue = this._setValue_unavailable;

		// ensure there is a value node
		if ( ! targetObject ) {

			console.error( 'THREE.PropertyBinding: Trying to update node for track: ' + this.path + ' but it wasn\'t found.' );
			return;

		}

		if ( objectName ) {

			let objectIndex = parsedPath.objectIndex;

			// special cases were we need to reach deeper into the hierarchy to get the face materials....
			switch ( objectName ) {

				case 'materials':

					if ( ! targetObject.material ) {

						console.error( 'THREE.PropertyBinding: Can not bind to material as node does not have a material.', this );
						return;

					}

					if ( ! targetObject.material.materials ) {

						console.error( 'THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.', this );
						return;

					}

					targetObject = targetObject.material.materials;

					break;

				case 'bones':

					if ( ! targetObject.skeleton ) {

						console.error( 'THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.', this );
						return;

					}

					// potential future optimization: skip this if propertyIndex is already an integer
					// and convert the integer string to a true integer.

					targetObject = targetObject.skeleton.bones;

					// support resolving morphTarget names into indices.
					for ( let i = 0; i < targetObject.length; i ++ ) {

						if ( targetObject[ i ].name === objectIndex ) {

							objectIndex = i + '';
							break;

						}

					}

					break;

				default:

					if ( targetObject[ objectName ] === undefined ) {

						console.error( 'THREE.PropertyBinding: Can not bind to objectName of node undefined.', this );
						return;

					}

					targetObject = targetObject[ objectName ];

			}


			if ( objectIndex !== undefined ) {

				if ( targetObject[ objectIndex ] === undefined ) {

					console.error( 'THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.', this, targetObject );
					return;

				}

				targetObject = targetObject[ objectIndex ];

			}

		}

		// resolve property
		let nodeProperty = targetObject[ propertyName ];

		if ( nodeProperty === undefined ) {

			let nodeName = parsedPath.nodeName;

			console.error( 'THREE.PropertyBinding: Trying to update property for track: ' + nodeName +
				'.' + propertyName + ' but it wasn\'t found.', targetObject );
			return;

		}

		// determine versioning scheme
		let versioning:number= this.Versioning.None;

		if ( targetObject.needsUpdate !== undefined ) { // material

			versioning = this.Versioning.NeedsUpdate;
			this.targetObject = targetObject;

		} else if ( targetObject.matrixWorldNeedsUpdate !== undefined ) { // node transform

			versioning = this.Versioning.MatrixWorldNeedsUpdate;
			this.targetObject = targetObject;

		}

		// determine how the property gets bound
		let bindingType:number = this.BindingType.Direct;

		if ( propertyIndex !== undefined ) {

			// access a sub element of the property array (only primitives are supported right now)

			if ( propertyName === "morphTargetInfluences" ) {

				// potential optimization, skip this if propertyIndex is already an integer, and convert the integer string to a true integer.

				// support resolving morphTarget names into indices.
				if ( ! targetObject.geometry ) {

					console.error( 'THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.', this );
					return;

				}

				if ( targetObject.geometry.isBufferGeometry ) {

					if ( ! targetObject.geometry.morphAttributes ) {

						console.error( 'THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.', this );
						return;

					}

					for ( let i = 0; i < this.node.geometry.morphAttributes.position.length; i ++ ) {

						if ( targetObject.geometry.morphAttributes.position[ i ].name === propertyIndex ) {

							propertyIndex = i + '';
							break;

						}

					}


				} else {

					if ( ! targetObject.geometry.morphTargets ) {

						console.error( 'THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphTargets.', this );
						return;

					}

					for ( let i = 0; i < this.node.geometry.morphTargets.length; i ++ ) {

						if ( targetObject.geometry.morphTargets[ i ].name === propertyIndex ) {

							propertyIndex = i + '';
							break;

						}

					}

				}

			}

			bindingType = this.BindingType.ArrayElement;

			this.resolvedProperty = nodeProperty;
			this.propertyIndex = propertyIndex;

		} else if ( nodeProperty.fromArray !== undefined && nodeProperty.toArray !== undefined ) {

			// must use copy for Object3D.Euler/Quaternion

			bindingType = this.BindingType.HasFromToArray;

			this.resolvedProperty = nodeProperty;

		} else if ( Array.isArray( nodeProperty ) ) {

			bindingType = this.BindingType.EntireArray;

			this.resolvedProperty = nodeProperty;

		} else {

			this.propertyName = propertyName;

		}

		// select getter / setter
		//TODO
		this.getValue = this.GetterByBindingType[ bindingType ];
		this.setValue = this.SetterByBindingTypeAndVersioning[ bindingType ][ versioning ];

	}

	unbind () : void {

		this.node = null;

		// back to the prototype version of getValue / setValue
		// note: avoiding to mutate the shape of 'this' via 'delete'
		this.getValue = this._getValue_unbound;
		this.setValue = this._setValue_unbound;

	}
	_getValue_unbound = this.getValue;
	_setValue_unbound = this.setValue;
	node:any;
	propertyName : string;

}

export module PropertyBinding{
	export class ParsedPath {
			nodeName : string;
			objectName : string;
			objectIndex : string;
			propertyName : string;
			propertyIndex : string;
	}
	export class Composite extends PropertyBinding {
		_targetGroup : AnimationObjectGroup;
		_bindings : Array<PropertyBinding>;
		parsedPath : PropertyBinding.ParsedPath;
		constructor( targetGroup : AnimationObjectGroup, path : string, optionalParsedPath? : PropertyBinding.ParsedPath ){
			super(null,path,optionalParsedPath);
			this.parsedPath = optionalParsedPath || PropertyBinding.parseTrackName( path );

			this._targetGroup = targetGroup;
			this._bindings = targetGroup.subscribe_( path, this.parsedPath );
		}

		getValue = function ( array : any, offset : number ) : void {

			this.bind(); // bind all binding

			let firstValidIndex = this._targetGroup.nCachedObjects_,
				binding = this._bindings[ firstValidIndex ];

			// and only call .getValue on the first
			if ( binding !== undefined ) binding.getValue( array, offset );

		}

		setValue = function ( array : any, offset : number ) : void {

			let bindings = this._bindings;

			for ( let i = this._targetGroup.nCachedObjects_,
					n = bindings.length; i !== n; ++ i ) {

				bindings[ i ].setValue( array, offset );

			}

		}

		bind () : void {

			let bindings = this._bindings;

			for ( let i = this._targetGroup.nCachedObjects_,
					n = bindings.length; i !== n; ++ i ) {

				bindings[ i ].bind();

			}

		}

		unbind () : void {

			let bindings = this._bindings;

			for ( let i = this._targetGroup.nCachedObjects_,
					n = bindings.length; i !== n; ++ i ) {

				bindings[ i ].unbind();

			}

		}

	}
}
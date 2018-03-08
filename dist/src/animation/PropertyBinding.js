var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var RESERVED_CHARS_RE = '\\[\\]\\.:\\/';
var PropertyBinding = /** @class */ (function () {
    //TODO: create class parsedPath defined in PropertyBinding.parseTrackName
    function PropertyBinding(rootNode, path, parsedPath) {
        this._getValue_unbound = this.getValue;
        this._setValue_unbound = this.setValue;
        this.path = path;
        this.parsedPath = parsedPath || PropertyBinding.parseTrackName()(path);
        this.node = PropertyBinding.findNode(rootNode, this.parsedPath.nodeName) || rootNode;
        this.rootNode = rootNode;
    }
    PropertyBinding.create = function (root, path, parsedPath) {
        if (!(root && root.isAnimationObjectGroup)) {
            return new PropertyBinding(root, path, parsedPath);
        }
        else {
            return new PropertyBinding.Composite(root, path, parsedPath);
        }
    };
    /**
     * Replaces spaces with underscores and removes unsupported characters from
     * node names, to ensure compatibility with parseTrackName().
     *
     * @param  {string} name Node name to be sanitized.
     * @return {string}
     */
    PropertyBinding.sanitizeNodeName = function (name) {
        var reservedRe = new RegExp('[' + RESERVED_CHARS_RE + ']', 'g');
        return name.replace(/\s/g, '_').replace(reservedRe, '');
    };
    PropertyBinding.parseTrackName = function () {
        // Attempts to allow node names from any language. ES5's `\w` regexp matches
        // only latin characters, and the unicode \p{L} is not yet supported. So
        // instead, we exclude reserved characters and match everything else.
        var wordChar = '[^' + RESERVED_CHARS_RE + ']';
        var wordCharOrDot = '[^' + RESERVED_CHARS_RE.replace('\\.', '') + ']';
        // Parent directories, delimited by '/' or ':'. Currently unused, but must
        // be matched to parse the rest of the track name.
        var directoryRe = /((?:WC+[\/:])*)/.source.replace('WC', wordChar);
        // Target node. May contain word characters (a-zA-Z0-9_) and '.' or '-'.
        var nodeRe = /(WCOD+)?/.source.replace('WCOD', wordCharOrDot);
        // Object on target node, and accessor. May not contain reserved
        // characters. Accessor may contain any character except closing bracket.
        var objectRe = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace('WC', wordChar);
        // Property and accessor. May not contain reserved characters. Accessor may
        // contain any non-bracket characters.
        var propertyRe = /\.(WC+)(?:\[(.+)\])?/.source.replace('WC', wordChar);
        var trackRe = new RegExp(''
            + '^'
            + directoryRe
            + nodeRe
            + objectRe
            + propertyRe
            + '$');
        var supportedObjectNames = ['material', 'materials', 'bones'];
        return function parseTrackName(trackName) {
            var matches = trackRe.exec(trackName);
            if (!matches) {
                throw new Error('PropertyBinding: Cannot parse trackName: ' + trackName);
            }
            var results = new PropertyBinding.ParsedPath();
            // directoryName: matches[ 1 ], // (tschw) currently unused
            results.nodeName = matches[2];
            results.objectName = matches[3];
            results.objectIndex = parseInt(matches[4]);
            results.propertyName = matches[5]; // required
            results.propertyIndex = parseInt(matches[6]);
            var lastDot = results.nodeName && results.nodeName.lastIndexOf('.');
            if (lastDot !== undefined && lastDot !== -1) {
                var objectName = results.nodeName.substring(lastDot + 1);
                // Object names must be checked against a whitelist. Otherwise, there
                // is no way to parse 'foo.bar.baz': 'baz' must be a property, but
                // 'bar' could be the objectName, or part of a nodeName (which can
                // include '.' characters).
                if (supportedObjectNames.indexOf(objectName) !== -1) {
                    results.nodeName = results.nodeName.substring(0, lastDot);
                    results.objectName = objectName;
                }
            }
            if (results.propertyName === null || results.propertyName.length === 0) {
                throw new Error('PropertyBinding: can not parse propertyName from trackName: ' + trackName);
            }
            return results;
        };
    };
    PropertyBinding.searchNodeSubtree = function (children, nodeName) {
        for (var i = 0; i < children.length; i++) {
            var childNode = children[i];
            if (childNode.name === nodeName || childNode.uuid === nodeName) {
                return childNode;
            }
            var result = this.searchNodeSubtree(childNode.children, nodeName);
            if (result)
                return result;
        }
        return null;
    };
    PropertyBinding.findNode = function (root, nodeName) {
        if (!nodeName || nodeName === "" || nodeName === "root" || nodeName === "." || nodeName === -1 || nodeName === root.name || nodeName === root.uuid) {
            return root;
        }
        // search into skeleton bones.
        if (root.skeleton) {
            var bone = root.skeleton.getBoneByName(nodeName);
            if (bone !== undefined) {
                return bone;
            }
        }
        // search into node subtree.
        if (root.children) {
            var subTreeNode = this.searchNodeSubtree(root.children, nodeName);
            if (subTreeNode) {
                return subTreeNode;
            }
        }
        return null;
    };
    // prototype, continued
    // these are used to "bind" a nonexistent property
    PropertyBinding.prototype._getValue_unavailable = function () { };
    ;
    PropertyBinding.prototype._setValue_unavailable = function () { };
    ;
    PropertyBinding.prototype.getValue_direct = function (buffer, offset) {
        buffer[offset] = this.node[this.propertyName];
    };
    PropertyBinding.prototype.getValue_array = function (buffer, offset) {
        var source = this.resolvedProperty;
        for (var i = 0, n = source.length; i !== n; ++i) {
            buffer[offset++] = source[i];
        }
    };
    PropertyBinding.prototype.getValue_arrayElement = function (buffer, offset) {
        buffer[offset] = this.resolvedProperty[this.propertyIndex];
    };
    PropertyBinding.prototype.getValue_toArray = function (buffer, offset) {
        this.resolvedProperty.toArray(buffer, offset);
    };
    PropertyBinding.prototype.setValue_direct = function (buffer, offset) {
        this.targetObject[this.propertyName] = buffer[offset];
    };
    PropertyBinding.prototype.setValue_direct_setNeedsUpdate = function (buffer, offset) {
        this.targetObject[this.propertyName] = buffer[offset];
        this.targetObject.needsUpdate = true;
    };
    PropertyBinding.prototype.setValue_direct_setMatrixWorldNeedsUpdate = function (buffer, offset) {
        this.targetObject[this.propertyName] = buffer[offset];
        this.targetObject.matrixWorldNeedsUpdate = true;
    };
    // EntireArray
    PropertyBinding.prototype.setValue_array = function (buffer, offset) {
        var dest = this.resolvedProperty;
        for (var i = 0, n = dest.length; i !== n; ++i) {
            dest[i] = buffer[offset++];
        }
    };
    PropertyBinding.prototype.setValue_array_setNeedsUpdate = function (buffer, offset) {
        var dest = this.resolvedProperty;
        for (var i = 0, n = dest.length; i !== n; ++i) {
            dest[i] = buffer[offset++];
        }
        this.targetObject.needsUpdate = true;
    };
    PropertyBinding.prototype.setValue_array_setMatrixWorldNeedsUpdate = function (buffer, offset) {
        var dest = this.resolvedProperty;
        for (var i = 0, n = dest.length; i !== n; ++i) {
            dest[i] = buffer[offset++];
        }
        this.targetObject.matrixWorldNeedsUpdate = true;
    };
    // ArrayElement
    PropertyBinding.prototype.setValue_arrayElement = function (buffer, offset) {
        this.resolvedProperty[this.propertyIndex] = buffer[offset];
    };
    PropertyBinding.prototype.setValue_arrayElement_setNeedsUpdate = function (buffer, offset) {
        this.resolvedProperty[this.propertyIndex] = buffer[offset];
        this.targetObject.needsUpdate = true;
    };
    PropertyBinding.prototype.setValue_arrayElement_setMatrixWorldNeedsUpdate = function (buffer, offset) {
        this.resolvedProperty[this.propertyIndex] = buffer[offset];
        this.targetObject.matrixWorldNeedsUpdate = true;
    };
    // HasToFromArray
    PropertyBinding.prototype.setValue_fromArray = function (buffer, offset) {
        this.resolvedProperty.fromArray(buffer, offset);
    };
    PropertyBinding.prototype.setValue_fromArray_setNeedsUpdate = function (buffer, offset) {
        this.resolvedProperty.fromArray(buffer, offset);
        this.targetObject.needsUpdate = true;
    };
    PropertyBinding.prototype.setValue_fromArray_setMatrixWorldNeedsUpdate = function (buffer, offset) {
        this.resolvedProperty.fromArray(buffer, offset);
        this.targetObject.matrixWorldNeedsUpdate = true;
    };
    PropertyBinding.prototype.getValue_unbound = function (targetArray, offset) {
        this.bind();
        this.getValue(targetArray, offset);
        // Note: This class uses a State pattern on a per-method basis:
        // 'bind' sets 'this.getValue' / 'setValue' and shadows the
        // prototype version of these methods with one that represents
        // the bound state. When the property is not found, the methods
        // become no-ops.
    };
    PropertyBinding.prototype.setValue_unbound = function (sourceArray, offset) {
        this.bind();
        this.setValue(sourceArray, offset);
    };
    // create getter / setter pair for a property in the scene graph
    PropertyBinding.prototype.bind = function () {
        var targetObject = this.node, parsedPath = this.parsedPath, objectName = parsedPath.objectName, propertyName = parsedPath.propertyName, propertyIndex = parsedPath.propertyIndex;
        if (!targetObject) {
            targetObject = PropertyBinding.findNode(this.rootNode, parsedPath.nodeName) || this.rootNode;
            this.node = targetObject;
        }
        // set fail state so we can just 'return' on error
        this.getValue = this._getValue_unavailable;
        this.setValue = this._setValue_unavailable;
        // ensure there is a value node
        if (!targetObject) {
            console.error('THREE.PropertyBinding: Trying to update node for track: ' + this.path + ' but it wasn\'t found.');
            return;
        }
        if (objectName) {
            var objectIndex = parsedPath.objectIndex;
            // special cases were we need to reach deeper into the hierarchy to get the face materials....
            switch (objectName) {
                case 'materials':
                    if (!targetObject.material) {
                        console.error('THREE.PropertyBinding: Can not bind to material as node does not have a material.', this);
                        return;
                    }
                    if (!targetObject.material.materials) {
                        console.error('THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.', this);
                        return;
                    }
                    targetObject = targetObject.material.materials;
                    break;
                case 'bones':
                    if (!targetObject.skeleton) {
                        console.error('THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.', this);
                        return;
                    }
                    // potential future optimization: skip this if propertyIndex is already an integer
                    // and convert the integer string to a true integer.
                    targetObject = targetObject.skeleton.bones;
                    // support resolving morphTarget names into indices.
                    for (var i = 0; i < targetObject.length; i++) {
                        if (targetObject[i].name === objectIndex) {
                            objectIndex = i;
                            break;
                        }
                    }
                    break;
                default:
                    if (targetObject[objectName] === undefined) {
                        console.error('THREE.PropertyBinding: Can not bind to objectName of node undefined.', this);
                        return;
                    }
                    targetObject = targetObject[objectName];
            }
            if (objectIndex !== undefined) {
                if (targetObject[objectIndex] === undefined) {
                    console.error('THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.', this, targetObject);
                    return;
                }
                targetObject = targetObject[objectIndex];
            }
        }
        // resolve property
        var nodeProperty = targetObject[propertyName];
        if (nodeProperty === undefined) {
            var nodeName = parsedPath.nodeName;
            console.error('THREE.PropertyBinding: Trying to update property for track: ' + nodeName +
                '.' + propertyName + ' but it wasn\'t found.', targetObject);
            return;
        }
        // determine versioning scheme
        var versioning = this.Versioning.None;
        if (targetObject.needsUpdate !== undefined) {
            versioning = this.Versioning.NeedsUpdate;
            this.targetObject = targetObject;
        }
        else if (targetObject.matrixWorldNeedsUpdate !== undefined) {
            versioning = this.Versioning.MatrixWorldNeedsUpdate;
            this.targetObject = targetObject;
        }
        // determine how the property gets bound
        var bindingType = this.BindingType.Direct;
        if (propertyIndex !== undefined) {
            // access a sub element of the property array (only primitives are supported right now)
            if (propertyName === "morphTargetInfluences") {
                // potential optimization, skip this if propertyIndex is already an integer, and convert the integer string to a true integer.
                // support resolving morphTarget names into indices.
                if (!targetObject.geometry) {
                    console.error('THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.', this);
                    return;
                }
                if (targetObject.geometry.isBufferGeometry) {
                    if (!targetObject.geometry.morphAttributes) {
                        console.error('THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.', this);
                        return;
                    }
                    for (var i = 0; i < this.node.geometry.morphAttributes.position.length; i++) {
                        if (targetObject.geometry.morphAttributes.position[i].name === propertyIndex) {
                            propertyIndex = i;
                            break;
                        }
                    }
                }
                else {
                    if (!targetObject.geometry.morphTargets) {
                        console.error('THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphTargets.', this);
                        return;
                    }
                    for (var i = 0; i < this.node.geometry.morphTargets.length; i++) {
                        if (targetObject.geometry.morphTargets[i].name === propertyIndex) {
                            propertyIndex = i;
                            break;
                        }
                    }
                }
            }
            bindingType = this.BindingType.ArrayElement;
            this.resolvedProperty = nodeProperty;
            this.propertyIndex = propertyIndex;
        }
        else if (nodeProperty.fromArray !== undefined && nodeProperty.toArray !== undefined) {
            // must use copy for Object3D.Euler/Quaternion
            bindingType = this.BindingType.HasFromToArray;
            this.resolvedProperty = nodeProperty;
        }
        else if (Array.isArray(nodeProperty)) {
            bindingType = this.BindingType.EntireArray;
            this.resolvedProperty = nodeProperty;
        }
        else {
            this.propertyName = propertyName;
        }
        // select getter / setter
        //TODO
        //this.getValue = this.GetterByBindingType[ bindingType ];
        //this.setValue = this.SetterByBindingTypeAndVersioning[ bindingType ][ versioning ];
    };
    PropertyBinding.prototype.unbind = function () {
        this.node = null;
        // back to the prototype version of getValue / setValue
        // note: avoiding to mutate the shape of 'this' via 'delete'
        this.getValue = this._getValue_unbound;
        this.setValue = this._setValue_unbound;
    };
    return PropertyBinding;
}());
export { PropertyBinding };
(function (PropertyBinding) {
    var ParsedPath = /** @class */ (function () {
        function ParsedPath() {
        }
        return ParsedPath;
    }());
    PropertyBinding.ParsedPath = ParsedPath;
    var Composite = /** @class */ (function (_super) {
        __extends(Composite, _super);
        function Composite(targetGroup, path, optionalParsedPath) {
            var _this = _super.call(this, null, path, optionalParsedPath) || this;
            _this.getValue = function (array, offset) {
                this.bind(); // bind all binding
                var firstValidIndex = this._targetGroup.nCachedObjects_, binding = this._bindings[firstValidIndex];
                // and only call .getValue on the first
                if (binding !== undefined)
                    binding.getValue(array, offset);
            };
            _this.setValue = function (array, offset) {
                var bindings = this._bindings;
                for (var i = this._targetGroup.nCachedObjects_, n = bindings.length; i !== n; ++i) {
                    bindings[i].setValue(array, offset);
                }
            };
            _this.parsedPath = optionalParsedPath || PropertyBinding.parseTrackName()(path);
            _this._targetGroup = targetGroup;
            _this._bindings = targetGroup.subscribe_(path, _this.parsedPath);
            return _this;
        }
        Composite.prototype.bind = function () {
            var bindings = this._bindings;
            for (var i = this._targetGroup.nCachedObjects_, n = bindings.length; i !== n; ++i) {
                bindings[i].bind();
            }
        };
        Composite.prototype.unbind = function () {
            var bindings = this._bindings;
            for (var i = this._targetGroup.nCachedObjects_, n = bindings.length; i !== n; ++i) {
                bindings[i].unbind();
            }
        };
        return Composite;
    }(PropertyBinding));
    PropertyBinding.Composite = Composite;
})(PropertyBinding || (PropertyBinding = {}));

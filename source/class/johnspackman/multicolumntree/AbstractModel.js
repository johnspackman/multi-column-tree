/* ************************************************************************
 *
 *    multicolumntree - Multi Column Tree Contrib for Qooxdoo
 *
 *    https://github.com/qooxdoo/qooxdoo-compiler
 *
 *    Copyright:
 *      2012-2018 Zenesis Limited, http://www.zenesis.com
 *
 *    License:
 *      MIT: https://opensource.org/licenses/MIT
 *
 *      This software is provided under the same licensing terms as Qooxdoo,
 *      please see the LICENSE file in the Qooxdoo project's top-level directory
 *      for details.
 *
 *    Authors:
 *      * John Spackman (john.spackman@zenesis.com, @johnspackman)
 *
 * ************************************************************************/

/**
 * Abstract implementation of IModel that assumes that the entire tree is in memory
 * (ie does not fetch children on demand, it expects it to be OK to access the entire
 * tree at startup).  This requires the derived class to implement getChildrenObject()
 * which must return a qx.data.Array instance of children.
 */
qx.Class.define("johnspackman.multicolumntree.AbstractModel", {
	extend: qx.core.Object,
	implement: [ johnspackman.multicolumntree.IModel ],
	type: "abstract",

	/**
	 * Constructor
	 * @param root
	 */
	construct: function(root) {
		this.base(arguments);
		this._root = root;
		this.__nodeData = {};
		this._addNode(root, null);
	},

	events: {
		/** Fired when a node's children has changed */
		"changeNodeChildren": "qx.event.type.Data"
	},

	members: {
		_root: null,
		__nodeData: null,
		__changingChildren: false,

		/**
		 * Adds a node to the tree, recording parentNode data and adding listeners for changes
		 * to the children
		 * @param node
		 * @param parentNode
		 */
		_addNode: function(node, parentNode) {
			if (qx.core.Environment.get("qx.debug"))
				this.assert(!this.__nodeData[node.toHashCode()], "Node " + node + " is already part of the model");

			var children = this.getChildrenObject(node);
			children.setUserData("johnspackman.multicolumntree.node", node);
			this.__nodeData[node.toHashCode()] = {
					node: node,
					parentNode: parentNode,
					childrenListener: children.addListener("change", this._onNodeChildrenChange, this)
				};

			for (var i = 0; i < children.getLength(); i++)
				this._addNode(children.getItem(i), node);
		},

		/**
		 * Removes info recorded about a node, ie listeners and data
		 * @param node
		 */
		_removeNode: function(node) {
			var nodeData = this.__nodeData[node.toHashCode()];
			if (nodeData.parentNode)
				this.getChildrenObject(nodeData.parentNode).remove(node);
			this.__deleteNodeData(node);
		},

		/**
		 * Recursively removes the node data for the node and all it's children
		 * @param node
		 */
		__deleteNodeData: function(node) {
			var nodeData = this.__nodeData[node.toHashCode()],
				children = this.getChildrenObject(node);
			node.removeListenerById(nodeData.childrenListener);
			delete this.__nodeData[node.toHashCode()];
			for (var i = 0; i < children.getLength(); i++)
				this.__deleteNodeData(children.getItem(i));
			children.removeAll();
		},

		/**
		 * Called to set the parent node
		 * @param node
		 * @param parentNode
		 */
		_setNodeParent: function(node, parentNode) {
			var nodeData = this.__nodeData[node.toHashCode()];
			if (!nodeData && !parentNode)
				return;
			if (!nodeData && parentNode) {
				this._addNode(node, parentNode);
				var children = this.getChildrenObject(parentNode);
				if (!children.contains(node))
					children.push(node);
				return;
			} else if (nodeData.parentNode == parentNode)
				return;

			if (nodeData.parentNode) {
				var oldParentNode = nodeData.parentNode;
				nodeData.parentNode = null;
				this.getChildrenObject(oldParentNode).remove(node);
			}
			if (parentNode) {
				nodeData.parentNode = parentNode;
				var children = this.getChildrenObject(parentNode);
				if (!children.contains(node))
					children.push(node);
			} else {
				this._removeNode(node);
			}
		},

		/**
		 * Callback for changes in a node's children
		 * @param evt
		 */
		_onNodeChildrenChange: function(evt) {
			var changeData = evt.getData(),
				arr = evt.getTarget(),
				node = arr.getUserData("johnspackman.multicolumntree.node");

			if (changeData.type == "add") {
				for (var i = 0, lst = changeData.added; i < lst.length; i++)
					this._setNodeParent(lst[i], node);

			} else if (changeData.type == "remove") {
				for (var i = 0, lst = changeData.removed; i < lst.length; i++)
					this._setNodeParent(lst[i], null);
			}

			this.fireDataEvent("changeNodeChildren", node == this._root ? null : node);
		},

		/**
		 * Returns the root node
		 * @returns
		 */
		getRoot: function() {
			return this._root;
		},

		/*
		 * @Override
		 */
		getChildren: function(parent) {
			var arr = this.getChildrenObject(parent);
			return arr.toArray();
		},

    /*
     * @Override
     */
    promiseGetChildren: function(parent) {
      return qx.Promise.resolve(this.getChildren(parent));
    },

		/**
		 * Called to get the qx.data.Array of children
		 * @Abstract
		 * @param parent
		 */
		getChildrenObject: function(parent) {
			throw new Error(this.classname + ".getChildrenObject() is not implemented");
		},

		/*
		 * @Override
		 */
		hasChildren: function(parent) {
			return this.getChildrenObject(parent).getLength() != 0 ? "yes" : "no";
		},

		/*
		 * @Override
		 */
		getParent: function(node) {
			if (!node)
				return null;
			var data = this.__nodeData[node.toHashCode()];
			return data.parentNode;
		},

		/*
		 * @Override
		 */
		moveTo: function(child, parent, after) {
			if (!parent)
				parent = this._root;
			var children = this.getChildrenObject(parent);
			if (!children.contains(child)) {
				children.insertAfter(after, child);
				return;
			}
			var arr = children.toArray();
			var fromIndex = arr.indexOf(child);
			if (arr.indexOf(after) == fromIndex - 1)
				return;

			arr.splice(fromIndex, 1);
			if (!after)
				arr.unshift(child);
			else {
				var toIndex = arr.indexOf(after) + 1;
				if (toIndex == arr.length)
					arr.push(child);
				else
					arr.splice(toIndex, 0, child);
			}
			if (fromIndex != arr.indexOf(child))
				children.fireDataEvent("change", {
						start: 0,
						end: arr.length - 1,
						type: "order",
						items: null
					}, null);
		},

    /*
     * @Override
     */
    canMoveTo: function(node, parentNode, insertAfter) {
      return true;
    }
	}
});

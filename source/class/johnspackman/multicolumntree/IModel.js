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

qx.Interface.define("johnspackman.multicolumntree.IModel", {

	events: {
		/** Fired when a node's children changes */
		"changeNodeChildren": "qx.event.type.Data"
	},

	members: {
		/**
		 * Called to provide the children for a node
		 * @param parent null is the root node
		 * @return {Node[]}
		 */
		getChildren: function(parent) {

		},

		/**
		 * Detects whether the node has any children
		 * @param parent {Node}
		 * @param loadOnDemand {Boolean?} whether to load children on demand
		 * @return ["yes", "no", "maybe"]
		 */
		hasChildren: function(parent) {

		},

		/**
		 * Returns a promise which will complete when the node has loaded all children
		 * @return {qx.Promise}
		 */
		promiseGetChildren: function(parent) {

		},

		/**
		 * Gets the parent node of a node
		 * @param node {Node} the node to get the parent of
		 * @return {Node} the parent node, or null if node was the root
		 */
		getParent: function(node) {

		},

		/**
		 * Called to move/add a node
		 * @param node
		 * @param parentNode
		 * @param insertAfter
		 */
		moveTo: function(node, parentNode, insertAfter) {

		},

    /**
     * Called to find oput whether a node can be placed
     * @param node
     * @param parentNode
     * @param insertAfter
     * @return true/false
     */
		canMoveTo: function(node, parentNode, insertAfter) {

		}

	}
});

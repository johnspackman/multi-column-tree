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

qx.Interface.define("johnspackman.multicolumntree.IView", {
	properties: {
		"tree": {
			nullable: false,
			check: "johnspackman.multicolumntree.Tree"
		}
	},

	members: {
		createRow: function() {

		},

		createDropCaretRow: function(tree) {

		},

    applyContentNode: function(widget, node, oldNode, dropCaret) {

    },

		getDropIndentOffset: function() {

		}
	}
});

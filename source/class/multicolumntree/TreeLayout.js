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

qx.Class.define("multicolumntree.TreeLayout", {
	extend : qx.ui.layout.Abstract,

	construct : function() {
		this.base(arguments);
	},

	members : {
		/*
		 * @Override
		 */
		_computeSizeHint: function() {
			var tree = this._getWidget(),
				rows = tree.getRows(),
				hint = {
					width: tree.getWidth(),
					height: 0,
					minHeight: 0
				};
			
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i],
					rowHint = row.getSizeHint(),
					height = rowHint.height;
				hint.height += height;
				if (rowHint.minHeight)
					hint.minHeight += rowHint.minHeight;
				if (hint.width === null || hint.width < rowHint.width)
					hint.width = rowHint.width;
			}
			
			return hint;
		},
		
		/*
		 * @Override
		 */
		renderLayout: function(availWidth, availHeight) {
			var tree = this._getWidget(),
				rows = tree.getRows(),
				top = 0;
			
			for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
				var row = rows[rowIndex],
					rowHint = row.getSizeHint();
				row.renderLayout(0, top, availWidth, rowHint.height);
				top += rowHint.height;
			}
		}
	}
});
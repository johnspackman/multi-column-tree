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

qx.Class.define("johnspackman.multicolumntree.SimpleView", {
	extend: johnspackman.multicolumntree.column.View,

	construct: function(labelPath, iconPath) {
		this.base(arguments);
    this.__column = new johnspackman.multicolumntree.column.AtomColumn().set({ editable: false, width: "*" });
    this.getColumns().push(this.__column);
		this.setLabelPath(labelPath||"label");
		if (iconPath)
			this.setIconPath(iconPath);
	},

	properties: {
		labelPath: {
			init: null,
			nullable: true,
			check: "String",
			event: "changeLabelPath",
			apply: "_applyLabelPath"
		},

		iconPath: {
			init: null,
			nullable: true,
			check: "String",
			event: "changeIconPath",
			apply: "_applyIconPath"
		}
	},

	members: {
	  __column: null,

	  _applyOptions: function(value, oldValue) {
	    this.__column.setOptions(value);
	  },

    _applyLabelPath: function(value, oldValue) {
      this.__column.setValuePath(value);
    },

    _applyIconPath: function(value, oldValue) {
      this.__column.setIconPath(value);
    }
	}
});

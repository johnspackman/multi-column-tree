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

qx.Class.define("johnspackman.multicolumntree.column.AtomColumn", {
  extend: johnspackman.multicolumntree.column.Column,

  properties: {
    options: {
      init: null,
      nullable: true,
      event: "changeOptions"
    },

    iconPath: {
      init: null,
      nullable: true,
      check: "String",
      event: "changeIconPath"
    }

  },

  members: {
    /*
     * @Override
     */
    createDisplayWidget: function(row) {
      if (row.isHeader())
        return new qx.ui.basic.Label().set({ rich: true, appearance: "tree-column-cell" });
      return new qx.ui.basic.Atom();
    },

    /**
     * Returns the actual value for the cell icon
     */
    getIconValue: function(model) {
      var path = this.getIconPath();
      if (!path || !model)
        return null;
      return johnspackman.multicolumntree.Utils.getValue(model, path);
    },

    /*
     * @Override
     */
    updateDisplayWidgetValue: function(widget, model, row) {
      var opts = this.getOptions();
      var value = row.isHeader() ? this.getCaption() : this.getDisplayValue(model);
      var icon = this.getIconValue(model);
      if (opts && model) {
        if (typeof opts.getLabel == "function")
          value = opts.getLabel.call(this, model);
        if (typeof opts.getIcon == "function")
          icon = opts.getIcon.call(this, model);
      }
      if (row.isHeader())
        widget.setValue("" + (value||""));
      else
        widget.setLabel("" + (value||""));
      widget.setIcon(icon);
    }

  }
});

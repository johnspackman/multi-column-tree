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

qx.Class.define("johnspackman.multicolumntree.column.YesNoColumn", {
  extend: johnspackman.multicolumntree.column.Column,

  members: {
    updateDisplayWidgetValue: function(widget, model) {
      widget.setValue(this.getRawValue(model) ? "Yes" : "No");
    },

    compare: function(left, right) {
      left = this.getRawValue(left);
      right = this.getRawValue(right);
      return left === right ? 0 : left ? 1 : -1;
    }

  }
});

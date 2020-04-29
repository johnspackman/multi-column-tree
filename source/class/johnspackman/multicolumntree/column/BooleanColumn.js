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

qx.Class.define("johnspackman.multicolumntree.column.BooleanColumn", {
  extend: johnspackman.multicolumntree.column.Column,

  members: {
    getDisplayValue: function(model) {
      var value = this.base(arguments, model);
      return value ? "Yes" : "No";
    },

    _createEditWidget: function() {
      var widget = new qx.ui.form.CheckBox();
      widget.addListener("blur", function(evt) {
        this.fireEvent("editorFinished");
      }, this);
      widget.addListener("keypress", function(evt) {
        if (evt.getKeyIdentifier() == "Enter" || evt.getKeyIdentifier() == "Escape")
          this.fireEvent("editorFinished");
        if (evt.getKeyIdentifier() == "Tab")
          this.fireEvent("editorNext");
      }, this);
      return widget;
    },

    _setEditWidgetValue: function(model) {
      this.getEditWidget().setValue(this.getRawValue(model));
    },

    compare: function(left, right) {
      left = this.getRawValue(left);
      right = this.getRawValue(right);
      if (left instanceof Date)
        left = left.getTime();
      if (right instanceof Date)
        right = right.getTime();

      return left < right ? -1 : left > right ? 1 : 0;
    }

  }
});

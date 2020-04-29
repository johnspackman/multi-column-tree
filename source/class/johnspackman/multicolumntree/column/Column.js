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

qx.Class.define("johnspackman.multicolumntree.column.Column", {
  extend: qx.core.Object,

  construct: function(caption, valuePath, width) {
    this.base(arguments);
    if (caption)
      this.setCaption(caption);
    if (valuePath)
      this.setValuePath(valuePath);
    if (width)
      this.setWidth(width);
  },

  properties: {
    width: {
      init: 100,
      nullable: false
    },

    minWidth: {
    	init: null,
    	nullable: true,
    	check: "Integer"
    },

    maxWidth: {
    	init: null,
    	nullable: true,
    	check: "Integer"
    },

    controller: {
      init: null,
      nullable: true
    },

    caption: {
      init: null,
      nullable: true,
      check: "String",
      event: "changeCaption"
    },

    valuePath: {
      init: null,
      nullable: true,
      check: "String",
      event: "changeValuePath"
    },

    rich: {
      init: true,
      nullable: false,
      check: "Boolean"
    },

    caseInsensitive: {
      init: true,
      nullable: false,
      check: "Boolean"
    },

    editable: {
      init: true,
      nullable: false,
      check: "Boolean"
    }
  },

  events: {
    /** Fired when the editor has finished and can be removed */
    "editorFinished": "qx.event.type.Event",

    /** Fired when the editor thinks the user wants to move to the next editable field */
    "editorNext": "qx.event.type.Event"
  },

  members: {
    __editWidget: null,

    /**
     * Returns the actual value for the cell
     */
    getRawValue: function(model) {
      var path = this.getValuePath();
      if (!path || !model)
        return null;
      return johnspackman.multicolumntree.Utils.getValue(model, path);
    },

    /**
     * Sets the actual value on the model for the cell
     */
    setRawValue: function(model, value) {
      var path = this.getValuePath();
      if (!path || !model)
        return;
      return johnspackman.multicolumntree.Utils.setValue(model, path, value);
    },

    /**
     * Returns the value being edited in the editor, the return value is the equivalent to getRawValue
     */
    getEditedValue: function() {
      return this.getEditWidget().getValue();
    },

    /**
     * Sets the value being edited in the editor, value is the equivalent to setRawValue
     */
    _setEditWidgetValue: function(model) {
      this.getEditWidget().setValue(this.getDisplayValue(model));
    },

    /**
     * Returns the display value for the cell, which is typically passed to the cell widget's value property
     */
    getDisplayValue: function(model) {
      return this.getRawValue(model)||"";
    },

    /**
     * Updates the widget to show the display value for the cell
     */
    updateDisplayWidgetValue: function(widget, model, row) {
      var value = row.isHeader() ? this.getCaption() : this.getDisplayValue(model);
      widget.setValue("" + (value||""));
    },

    /**
     * Creates a widget to show the cell value
     */
    createDisplayWidget: function(row) {
      return new qx.ui.basic.Label().set({ rich: true, appearance: row.isHeader() ? "tree-column-header" : "tree-column-cell" });
    },

    /**
     * Creates a one-off widget that mimics the visual appearance, used for creating life-life drag
     * and drop carets.  Must include values all configured to match the model
     */
    createMimicWidget: function(model) {
      return new qx.ui.basic.Label().set({
        rich: true,
        value: this.getDisplayValue(model),
        appearance: "tree-column-cell"
      });
    },

    /**
     * Creates bindings
     */
    createBindings: function() {
      if (!this.getValuePath())
        return null;
      var binding = new johnspackman.multicolumntree.Binding(this.getValuePath(), null, true);
      return [ binding ];
    },

    /**
     * Updates the bindings with the new model value
     */
    updateBindings: function(bindings, model, row) {
      if (bindings) {
        bindings.forEach(function(binding) {
          binding.setModel(model);
        });
      }
    },

    /**
     * Disposes of the bindings
     */
    disposeBindings: function(model, bindings) {
      if (bindings) {
        bindings.forEach(function(binding) {
          binding.setModel(null);
          binding.dispose();
        });
      }
    },

    /**
     * Returns the editor for this column; reuses the same control for all rows
     */
    getEditWidget: function() {
      if (!this.isEditable())
        return null;
      if (!this.__editWidget) {
        this.__editWidget = this._createEditWidget();
      }
      return this.__editWidget;
    },

    /**
     * Creates the widget
     */
    _createEditWidget: function() {
      var widget = new qx.ui.form.TextField();
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

    /**
     * Starts editing - copies the value to the edit widget
     */
    startEditing: function(model) {
      this._setEditWidgetValue(model);
      var widget = this.getEditWidget();
      widget.focus();
    },

    /**
     * Finishes editing - copies the edit widget's value to the model
     */
    finishEditing: function(model) {
      var value = this.getEditedValue();
      try {
        this.setRawValue(model, value);
      } catch(ex) {
        this.error("Cannot set column value to " + value + ": " + ex);
      }
    },

    /**
     * Compares two rows for sorting
     */
    compare: function(left, right) {
      left = this.getDisplayValue(left);
      right = this.getDisplayValue(right);
      if (this.isCaseInsensitive()) {
        if (typeof left == "string")
          left = left.toLowerCase();
        if (typeof right == "string")
          right = right.toLowerCase();
      }
      return left < right ? -1 : left > right ? 1 : 0;
    }


  }
});

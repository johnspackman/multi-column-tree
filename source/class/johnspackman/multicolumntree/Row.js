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
 * Provides a row for a tree which has columns
 */
qx.Class.define("johnspackman.multicolumntree.Row", {
  extend: qx.ui.core.Widget,

  construct: function(tree) {
    this.base(arguments);
    this._setLayout(new qx.ui.layout.HBox());
    this.__tree = tree;

    this.setHeader(false);
    this._createChildren();

    this._resetArrow();
    this._resetIndent();

    this.addListener("mouseover", this.__onMouseOver, this);
    this.addListener("mouseout", this.__onMouseOut, this);
  },

  properties: {
    /** Whether this is a static header row */
    header: {
      nullable: false,
      check: "Boolean",
      apply: "_applyHeader"
    },

    /** The controller/view */
    controller: {
      init: null,
      nullable: true,
      check: "johnspackman.multicolumntree.column.View",
      apply: "_applyController",
      event: "changeController"
    },

    /** The node (model) for this row */
    "node": {
      init: null,
      nullable: true,
      apply: "_applyNode",
      event: "changeNode"
    },

    /** The parent row (for trees) */
    "parentRow": {
      check: "johnspackman.multicolumntree.Row",
      init: null,
      nullable: true,
      event: "changeParentNode"
    },

    /** How many indents */
    "indent": {
      init: 0,
      nullable: false,
      check: "Integer",
      apply: "_resetIndent",
      event: "changeIndent"
    },

    /** The width of the each indent */
    "indentWidth": {
      nullable: false,
      init: 19,
      check: "Integer",
      themeable: true
    },

    /** Whether it's an open branch */
    "opened": {
      init: false,
      nullable: false,
      check: "Boolean",
      apply: "_resetArrow",
      event: "changeOpened"
    },

    /** Whether it has children */
    "hasChildren": {
      init: false,
      nullable: false,
      check: "Boolean",
      apply: "_resetArrow",
      event: "changeHasChildren"
    },

    /** Whether selected */
    "selected": {
      init: false,
      nullable: false,
      check: "Boolean",
      apply: "_applySelected",
      event: "changeSelected"
    },

    /** Whether checked */
    "checked": {
      init: false,
      nullable: false,
      check: "Boolean",
      apply: "_applyChecked",
      event: "changeChecked"
    },

    /** Whether check box is shown */
    "showChecked": {
      init: false,
      nullable: false,
      check: "Boolean",
      apply: "_applyShowChecked",
      event: "changeShowChecked"
    },

    /** Whether focused */
    "focused": {
      init: false,
      nullable: false,
      check: "Boolean",
      apply: "_applyFocused",
      event: "changeFocused"
    },

    /** How much to indent the drop caret */
    "dropIndentOffset": {
      init: 20,
      nullable: false,
      check: "Integer",
      event: "changeDropIndentOffset",
      themeable: true
    },

    appearance: {
      refine: true,
      init: "gtree-row"
    },

    draggable: {
      refine: true,
      init: true
    }
  },

  members: {
    __cells: null,
    __tree: null,

    _forwardStates: {
      selected: true,
      hovered: true,
      focused: true,
      hasChildren: true,
      opened: true
    },

    _applyNode: function(value, oldValue) {
      this.setController(value ? this.getTree().getView() : null);
      this.update();
    },

    _resetArrow: function() {
      if (this.getHasChildren()) {
        this.addState("hasChildren");
        if (this.isOpened())
          this.addState("opened");
        else
          this.removeState("opened");
      } else {
        this.removeState("hasChildren");
        this.removeState("opened");
      }
    },

    _applySelected: function(value, oldValue) {
      if (value)
        this.addState("selected");
      else
        this.removeState("selected");
      this._resetArrow();
    },

    _applyChecked: function(value, oldValue) {
      if (value)
        this.addState("checked");
      else
        this.removeState("checked");
      this.getChildControl("check").setValue(value);
    },

    _applyShowChecked: function(value) {
      this.__updateCheckedVisibility();
    },

    __updateCheckedVisibility: function() {
      var cbx = this.getChildControl("check");
      if (this.isShowChecked()) {
        cbx.setVisibility(this.isHeader() ? "hidden" : "visible");
      } else {
        cbx.setVisibility("excluded");
      }
    },

    _applyHeader: function(value) {
      this.__updateCheckedVisibility();
    },

    _applyFocused: function(value, oldValue) {
      if (value)
        this.addState("focused");
      else
        this.removeState("focused");
    },

    __onMouseOver: function(evt) {
      this.addState("hovered");
    },

    __onMouseOut: function(evt) {
      this.removeState("hovered");
    },

    getTree: function() {
      return this.__tree;
    },

    resetView: function() {
      var ctlr = this.getController();
      this.setController(null);
      this.setController(ctlr);
    },

    _resetIndent: function() {
      this.invalidateLayoutCache();
      this.scheduleLayoutUpdate();
    },

    startEditing: function(columnIndex) {
      var cell = this.__cells[columnIndex];
      if (cell.isEditing()) {
        this.warn("Already editing the row!");
        return;
      }

      var editWidget = cell.startEditing();
      if (!editWidget)
        return false;
      qx.core.Assert.assertTrue(editWidget.getLayoutParent() == null);
      this._addAfter(editWidget, cell.getDisplayWidget());
      return true;
    },

    finishEditing: function(columnIndex) {
      if (!this.__cells)
        return;
      var cell = this.__cells[columnIndex];
      if (!cell.isEditing())
        return;

      var editWidget = cell.finishEditing();
      if (editWidget) {
        this._remove(editWidget);
      }
    },

    /**
     * Returns the widget for a given column, used by the layout
     */
    getColumnWidget: function(index) {
      var cell = this.__cells[index];
      return cell.getWidget();
    },

    /**
     * Apply method for controller
     */
    _applyController: function(value, oldValue) {
      var t = this;
      if (this.__cells) {
        this.__cells.forEach(function(cell, index) {
          cell.dispose();
        });
        this.__cells = null;
      }
      if (value) {
        var layout = this._getLayout();
        var clz = value.getLayoutClass();
        if (!(layout instanceof clz))
          this._setLayout(new clz());

        this.__cells = [];
        value.getColumns().forEach(function(column, index) {
          var cell = new johnspackman.multicolumntree.Cell(t, column, t.isHeader());
          t.__cells.push(cell);
          t._add(cell.getDisplayWidget());
          if (t.isHeader()) {
            cell.updateDisplayWidget();
          }
        });
      }
      this.update();
    },

    /**
     * Updates all cells with the new node/model
     */
    update: function() {
      var t = this;
      var model = this.getNode();
      if (this.__cells) {
        this.__cells.forEach(function(cell) {
          cell.setModel(model);
        });
      }
    },

    /**
     * Called to create children
     */
    _createChildren: function() {
      this._add(this.getChildControl("check"));
      this._add(this.getChildControl("arrow"));
    },

    /*
     * @Override
     */
    getContentBounds: function() {
      var bounds = null;
      if (this.__cells) {
        this.__cells.forEach(function(cell) {
          var ctl = cell.getWidget();
          var tmp = ctl.getBounds();
          if (tmp) {
            if (!bounds)
              bounds = tmp;
            else {
              var right = bounds.left + bounds.width;
              var tmpRight = tmp.left + tmp.width;
              right = Math.max(right, tmpRight);

              var bottom = bounds.top + bounds.height;
              var tmpBottom = tmp.top + tmp.height;
              bottom = Math.max(bottom, tmpBottom);

              bounds = {
                  left: Math.min(bounds.left, tmp.left),
                  top: Math.min(bounds.top, tmp.top)
              };
              bounds.width = right - bounds.left;
              bounds.height = bottom - bounds.top;
            }
          }
        });
      }

      return bounds;
    },

    /*
     * @Override
     */
    getWidgetColumn: function(widget) {
      if (!this.__cells)
        return -1;
      var content = [];
      this.__cells.forEach(function(cell) {
        var widget = cell.getDisplayWidget();
        if (widget)
          content.push(widget);
      });
      var arrow = this.getChildControl("arrow");
      while (widget && widget != this) {
        var pos = content.indexOf(widget);
        if (pos > -1)
          return pos;
        if (widget === arrow)
          return -1;
        widget = widget.getLayoutParent();
      }
      return null;
    },

    /*
     * @Override
     */
    createMimicWidgets: function() {
      var result = [];
      this.__cells.forEach(function(cell) {
        var widget = cell.getColumn().createMimicWidget(this.getNode());
        result.push(widget);
      });
      return result;
    },

    /*
     * @Override
     */
    _createChildControlImpl: function(id, hash) {
      switch(id) {
      case "content":
        throw new Error("Tree with columns does not have a 'content' child");

      case "indent":
        return new qx.ui.core.Widget().set({
          width: 0,
          height: 0
        });

      case "arrow":
        return new qx.ui.basic.Image();

      case "check":
        var cbx = new qx.ui.form.CheckBox();
        cbx.bind("value", this, "checked");
        return cbx;
      }
      return this.base(arguments, id, hash);
    },

    toString: function() {
      if (!this.__cells || !this.__cells[0])
        return "(no cells)";
      return this.__cells[0].getColumn().getDisplayValue(this.getNode());
    }
  }
});

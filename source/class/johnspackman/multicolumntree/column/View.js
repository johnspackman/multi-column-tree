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

qx.Class.define("johnspackman.multicolumntree.column.View", {
  extend: qx.core.Object,
  implement: [ johnspackman.multicolumntree.IView ],

  construct: function() {
    this.base(arguments);
    this.__columns = new qx.data.Array();
    this.__columns.addListener("change", this.__onColumnsChange, this);
  },

  properties: {
    /** Psuedo property
     * columns
     *
    columns: {
      nullable: false,
      check: "qx.data.Array",
      event: "changeColumns"
    }
    */

    "tree": {
      nullable: false,
      check: "johnspackman.multicolumntree.Tree",
      apply: "_applyTree"
    },

    options: {
      init: null,
      nullable: true,
      event: "changeOptions"
    },

    rowClass: {
      init: johnspackman.multicolumntree.Row,
      nullable: false
    },

    rowAppearance: {
      init: null,
      nullable: true
    },

    layoutClass: {
      init: johnspackman.multicolumntree.RowLayout
    }
  },

  events: {
    "changeColumns": "qx.event.type.Data",
    "beforeEditCell": "qx.event.type.Data",
    "afterEditCell": "qx.event.type.Data"
  },

  members: {
    __columns: null,

    /**
     * get for columns psuedo property
     */
    getColumns: function() {
      return this.__columns;
    },

    /**
     * set for columns psuedo property
     */
    setColumns: function(value) {
      qx.lang.Array.replace(this.__columns, value ? value : []);
    },

    /**
     * reset for columns psuedo property
     */
    resetColumns: function() {
      this.__columns.removeAll();
    },

    /**
     * Called to check if the cell can be edited
     */
    startEditing: function(node, column) {
      return this.fireDataEvent("beforeEditCell", { node: node, column: column }, null, true);
    },

    /**
     * Called when editing has finished
     */
    finishEditing: function(node, column) {
      this.fireDataEvent("afterEditCell", { node: node, column: column }, null);
    },

    /**
     * Event handler for changes to the columns
     */
    __onColumnsChange: function(evt) {
      var data = evt.getData();
      var t = this;

      data.added.forEach(function(col) {
        col.setController(t);
      });
      data.removed.forEach(function(col) {
        col.setController(null);
      });
    },

    /**
     * Apply for tree property
     */
    _applyTree: function(value, oldValue) {
      if (oldValue)
        throw new Error("Cannot change value of " + this.classname + ".tree once set");
    },

    /*
     * @Override
     */
    createRow: function() {
      var clz = this.getRowClass();
      var row = new clz(this.getTree());
      var app = this.getRowAppearance();
      if (app)
        row.setAppearance(app);
      return row;
    },

    /*
     * @Override
     */
    createDropCaretRow: function(tree) {
      return new johnspackman.multicolumntree.column.DropCaretRow(tree).set({ controller: this });
    },

    /*
     * @Override
     */
    applyContentNode: function(widget, node, oldNode, dropCaret) {
      if (!dropCaret)
        throw new Error("Unexpected call to " + this.classname + ".applyContentNode");
    },

    /*
     * @Override
     */
    getDropIndentOffset: function() {
      return null;
    }
  }

});

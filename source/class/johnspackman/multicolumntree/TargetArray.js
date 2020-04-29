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

qx.Class.define("johnspackman.multicolumntree.TargetArray", {
  extend: qx.core.Object,

  construct: function(callback, context) {
    this.base(arguments);
    if (context)
      callback = callback.bind(context);
    this.__callback = callback;
  },

  properties: {
    "value": {
      init: null,
      nullable: true,
      event: "changeValue",
      apply: "_applyValue"
    }
  },

  members: {
    __callback: null,

    /**
     * Apply for value
     */
    _applyValue: function(value, oldValue) {
      if (oldValue)
        oldValue.removeListener("change", this._onArrayChange, this);
      if (value)
        value.addListener("change", this._onArrayChange, this);

      this.__callback({
        start: 0,
        end: value ? value.getLength() - 1 : -1,
        type: "add/remove",
        added: value ? value.toArray() : [],
        removed: oldValue ? oldValue.toArray() : []
      }, value, oldValue);
    },

    /**
     * Called when the array changes
     * @param evt {Event} the event
     */
    _onArrayChange: function(evt) {
      this.__callback(evt.getData(), evt.getTarget(), null);
    }
  }
});

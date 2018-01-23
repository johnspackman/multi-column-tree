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

qx.Class.define("multicolumntree.column.DropCaretRow", {
  extend: multicolumntree.Row,
  
  properties: {
    appearance: {
      refine: true,
      init: "gtree-dropcaret"
    }
  },

  members: {
    _createChildren: function() {
      this._add(this.getChildControl("indent"));
      this._add(this.getChildControl("arrow"));
    },
    
    toString: function() {
      return "Column Drop Caret";
    }
  }
});
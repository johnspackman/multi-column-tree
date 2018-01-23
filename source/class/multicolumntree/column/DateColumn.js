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

qx.Class.define("multicolumntree.column.DateColumn", {
  extend: multicolumntree.column.Column,
  
  properties: {
    dateFormat: {
      init: null,
      nullable: true,
      check: "qx.util.format.DateFormat"
    }
  },
  
  members: {
    getDisplayValue: function(model) {
      var dt = this.base(arguments, model);
      if (!dt)
        return "";
      if (qx.lang.Type.isNumber(dt))
        dt = new Date(dt);
      var df = this.getDateFormat()||qx.util.format.DateFormat.getDateTimeInstance();
      return df.format(dt);
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
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

qx.Class.define("multicolumntree.column.SizeBytesColumn", {
  extend: multicolumntree.column.Column,
  
  members: {
    getDisplayValue: function(model) {
      var size = this.base(arguments, model);
      if (!size || isNaN(size) || !isFinite(size))
        return "0 bytes";
      if (size > 1024 * 1024)
      	return (size / (1024 * 1024)).toFixed(2) + "Mb";
      if (size > 1024)
      	return (size / 1024).toFixed(2) + "Kb";
      return size + " bytes";
    }
    
  }
});
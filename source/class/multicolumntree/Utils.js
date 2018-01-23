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
 * @ignore(com.zenesis.*)
 * 
 */
qx.Class.define("multicolumntree.Utils", {
  extend: qx.core.Object,
  
  statics: {
    /**
     * Returns information for the property referenced by path; path can contain
     * dotted-notation to decend into the object's properties.
     * 
     * @param obj
     * @param path
     * @returns {Map} A map, containing: 
     * original: the obj passed to this function 
     * object: the object that contains the property 
     * propName: the name of the property 
     * propDef: the definition of the property
     * get: getMethod 
     * set: setMethod
     */
    getPropertyInfo : function(obj, path) {
      if (obj  === null)
        return null;
      var result = {
        original : obj
      };
      var segs = path.split('.');
      for ( var i = 0; i < segs.length - 1; i++) {
        var seg = segs[i];
        var index = -1;
        var pos = seg.indexOf('[');
        if (pos > 0) {
          index = seg.substring(pos + 1, seg.length - 1);
          seg = seg.substring(0, pos);
        }
        var upname = qx.lang.String.firstUp(seg);
        obj = obj["get" + upname]();
        if (obj == null)
          return null;
        if (index > -1) {
          obj = this.get(obj, index);
          if (obj == null)
            return null;
        }
      }
      result.object = obj;
      result.propName = segs[segs.length - 1];
      result.propDef = qx.Class.getPropertyDefinition(obj.constructor, result.propName);

      var seg = segs[i];
      var pos = seg.indexOf('[');
      if (pos > 0) {
        index = seg.substring(pos + 1, seg.length - 1);
        seg = seg.substring(0, pos);
        var upname = qx.lang.String.firstUp(seg);
        result.get = function() {
          return obj = this.get(obj["get" + upname].call(obj), index);
        };
        result.set = function(value) {
          this.set(obj["get" + upname].call(obj), index, value);
        };
      } else {
        var upname = qx.lang.String.firstUp(seg);
        if (typeof obj["get" + upname] == "function")
          result.get = qx.lang.Function.bind(obj["get" + upname], obj);
        else if (typeof obj["is" + upname])
          result.get = qx.lang.Function.bind(obj["is" + upname], obj);
        else
          throw new Error("Cannot find a getter for " + upname);
        if (typeof obj["set" + upname] == "function")
          result.set = qx.lang.Function.bind(obj["set" + upname], obj);
      }
      return result;
    },

    /**
     * Inverse of setValue, although does no conversion etc
     * 
     * @param model
     * @param propName
     * @returns
     */
    getValue : function(model, propName) {
      if (!propName)
        return model;
      var len = propName.length;
      if (len > 1 && propName.charAt(0) == '\'' && propName.charAt(len - 1) == '\'')
        return propName.substring(1, len - 1);

      var propInfo = this.getPropertyInfo(model, propName);
      if (propInfo === null)
        return null;
      return propInfo.get();
    },

    /**
     * Sets the property named propName on the object model to value. Returns
     * true if the value was changed
     * 
     * @param model
     * @param propName
     * @param value
     * @returns
     */
    setValue : function(model, propName, value, options) {
      var len = propName.length;
      if (len > 1 && propName.charAt(0) == '\'' && propName.charAt(len - 1) == '\'')
        return;

      var propInfo = this.getPropertyInfo(model, propName);
      if (!propInfo)
        return;
      value = this.convertForModel(propInfo, value, options);
      propInfo.set(value);
      return true;
    },

    /**
     * Converts to a native array
     * 
     * @param value
     * @returns
     * @ignore(NodeList)
     */
    toNativeArray : function(value) {
      if (!value)
        return null;
      if (typeof value == "string")
        return [ value ];
      if (typeof NodeList !== "undefined" && value instanceof NodeList) {
        var result = [];
        for ( var i = 0; i < value.length; i++)
          result.push(value[i]);
        return result;
      }
      if (typeof Node !== "undefined" && value instanceof Node)
        return [ value ];
      if (qx.core.Environment.get("runtime.name") == "rhino" && Object.prototype.toString.call(value) == "[object JavaObject]"
          && value instanceof java.util.ArrayList) {
        var result = [];
        for ( var i = 0; i < value.length; i++)
          result.push(value[i]);
        return result;
      }
      if (value instanceof qx.data.Array) {
        var result = [];
        for ( var i = 0; i < value.getLength(); i++)
          result[i] = value.getItem(i);
        return result;
      }
      if (qx.lang.Type.isArray(value))
        return value;
      result = [ value ];
      return result;
    },
    
    /**
     * Returns the indexed value from an array, irrespective of whether it's a
     * data array or a native aray
     * 
     * @param obj
     * @param index
     * @returns
     */
    get: function(obj, index) {
      if (obj instanceof qx.data.Array)
        return obj.getItem(index);
      if (com && com.zenesis && com.zenesis.qx && com.zenesis.qx.remote && obj instanceof com.zenesis.qx.remote.Map)
        return obj.get(index);
      return obj[index];
    },

    /**
     * Sets the indexed value from an array, irrespective of whether it's a data
     * array or a native array
     * 
     * @param obj
     * @param index
     * @returns
     */
    set : function(obj, index, value) {
      if (obj instanceof qx.data.Array)
        obj.setItem(index, value);
      else if (com && com.zenesis && com.zenesis.qx && com.zenesis.qx.remote && obj instanceof com.zenesis.qx.remote.Map)
        obj.put(index, value);
      else
        obj[index] = value;
    }

  }
});

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

qx.Class.define("johnspackman.multicolumntree.controller.Controller", {
  extend: qx.core.Object,
  implement: [ johnspackman.multicolumntree.IModel ],

  construct: function(model, childrenPath) {
    this.base(arguments);
    this.__nodeInfo = {};
    this.__root = new qx.core.Object;
    if (childrenPath)
      this.setChildrenPath(childrenPath);
    if (model)
      this.setModel(model);
  },

  properties: {
    model: {
      init: null,
      nullable: true,
      event: "changeModel",
      apply: "_applyModel"
    },

    options: {
      init: null,
      nullable: true,
      event: "changeOptions"
    },

    childrenPath: {
      init: null,
      nullable: true,
      check: "String",
      event: "changeChildrenPath"
    },

    hasChildrenPath: {
      init: null,
      nullable: true,
      check: "String",
      event: "changeHasChildrenPath"
    }

  },

  events: {
    /**
     * Fired when a node's children changes, data is the node whose children
     * changed
     */
    "changeNodeChildren": "qx.event.type.Data"
  },

  members: {
    __nodeInfo: null,
    __root: null,
    __modelChangeListenerId: null,

    _applyModel: function(value, oldValue) {
      if (oldValue) {
        this._detach(oldValue);
      }
      if (value) {
        this._attach(null, value);
      }
      this.fireDataEvent("changeNodeChildren", null);
    },

    _isAttached: function(modelItem) {
      return !!this.__nodeInfo[modelItem.toHashCode()];
    },

    _attach: function(parent, modelItem) {
      var t = this;
      if (this._isAttached(modelItem))
        return;
      var info = this.__nodeInfo[modelItem.toHashCode()] = {
          parent: parent,
          hasChildren: null,
          children: null,
          childrenChangeListenerId: null,
          modelChangeChildrenListenerId: null
      };

      var opts = this.getOptions();

      var path = this.getHasChildrenPath();
      if (opts) {
        if (typeof opts.getHasChildrenPath == "function")
          path = opts.getHasChildrenPath.call(this, modelItem);
        else if (typeof opts.getHasChildren == "function")
          info.hasChildren = opts.getHasChildren.call(this, modelItem);
      }
      if (path) {
        var upname = qx.lang.String.firstUp(path);
        info.hasChildren = modelItem["get" + upname]();
      }

      if (info.hasChildren === true)
        info.hasChildren = "yes";
      else if (info.hasChildren === false)
        info.hasChildren = "no";
    },

    _detach: function(modelItem) {
      var t = this;
      var info = this.__nodeInfo[modelItem.toHashCode()];
      if (!info)
        return;
      delete this.__nodeInfo[modelItem.toHashCode()];

      if (info.childrenChangeListenerId)
        modelItem.removeListenerById(info.childrenChangeListenerId);
      if (info.modelChangeChildrenListenerId)
        modelItem.removeListenerById(info.modelChangeChildrenListenerId);

      if (info.children)
        info.children.forEach(function(child) {
          t._detach(child);
        });
    },

    __onModelItemChildrenChange: function(evt) {
      if (this.__inMove)
        return;
      var t = this;
      var oldValue = evt.getOldData();
      var value = evt.getData();
      var parent = evt.getTarget();

      if (oldValue) {
        oldValue.forEach(function(child) {
          t._detach(child);
        });
      }
      if (value) {
        value.forEach(function(child) {
          t._attach(parent, child);
        });
      }
      this.fireDataEvent("changeNodeChildren", parent == this.getModel() ? null : parent);
    },

    _onModelItemChangeChildren: function(parent, evt) {
      if (this.__inMove)
        return;
      var t = this;
      var data = evt.getData();

      if (data.removed)
        data.removed.forEach(function(child) {
          t._detach(child);
        });
      if (data.added)
        data.added.forEach(function(child) {
          t._attach(parent, child);
        });

      this.fireDataEvent("changeNodeChildren", parent == this.getModel() ? null : parent);
    },

    /*
     * @Override
     */
    getChildren: function(parent) {
      var t = this;
      if (!parent)
        parent = this.getModel();
      if (!parent)
        return null;
      var info = this.__nodeInfo[parent.toHashCode()];
      if (!info)
        return;
      if (info.children) {
        if (info.children instanceof qx.Promise)
          return [];
        return info.children.toArray();
      }
      if (info.hasChildren === "no")
        return null;

      var path = this.getChildrenPath();
      var opts = this.getOptions();
      if (opts) {
        if (typeof opts.getChildrenPath == "function")
          path = opts.getChildrenPath.call(this, parent);
        else if (typeof opts.getChildren == "function")
          info.children = opts.getChildren.call(this, parent);
      }

      if (path) {
        var upname = qx.lang.String.firstUp(path);
        if (typeof parent["get" + upname + "Async"] == "function")
          info.children = parent["get" + upname + "Async"]();
        else
          info.children = parent["get" + upname]();
      }

      function attach() {
        if (upname)
          info.childrenChangeListenerId = parent.addListener("change" + upname, t.__onModelItemChildrenChange, t);

        if (info.children) {
          info.children.forEach(function(child) {
            t._attach(parent, child);
          })
          info.modelChangeChildrenListenerId = info.children.addListener("change", t._onModelItemChangeChildren.bind(t, parent));
        }
      }

      if (info.children) {
        if (info.children instanceof qx.Promise) {
          info.children.then(function(children) {
            // Cancelled
            if (info.children == null)
              return;

            info.children = children;
            attach(children);
            t.fireDataEvent("changeNodeChildren", parent == t.getModel() ? null : parent);
          });

          return [];
        }
        attach(info.children);
        return info.children.toArray();
      }

      return null;
    },

    /*
     * @Override
     */
    promiseGetChildren: function(parent) {
      if (!parent)
        parent = this.getModel();
      this.getChildren(parent);
      var info = this.__nodeInfo[parent.toHashCode()];
      return qx.Promise.resolve(info.children);
    },

    /*
     * @Override
     */
    hasChildren: function(parent) {
      if (!parent)
        parent = this.getModel();
      if (!parent)
        return null;

      var info = this.__nodeInfo[parent.toHashCode()];
      if (!info)
        return null;

      return info.hasChildren;
    },

    /*
     * @Override
     */
    getParent: function(node) {
      if (!node)
        return null;
      var info = this.__nodeInfo[node.toHashCode()];
      if (!info)
        return null;
      return info.parent;
    },

    /*
     * @Override
     */
    __inMove: false,
    moveTo: function(node, parentNode, insertAfter) {
      if (this.__inMove)
        throw new Error("Recursive call to controller.move");
      this.__inMove = true;
      try {
        var opts = this.getOptions();
        if (opts) {
          if (typeof opts.moveTo == "function")
            return opts.moveTo.call(this, node, parentNode, insertAfter);
        }

        var currentParent = this.getParent(node);
        if (currentParent && currentParent != parentNode) {
          var children = this.__nodeInfo[currentParent.toHashCode()].children;
          if (children.remove(node))
            this.fireDataEvent("changeNodeChildren", currentParent);
        }

        if (!parentNode)
          parentNode = this.getModel();
        this.getChildren(parentNode);
        var info = this.__nodeInfo[parentNode.toHashCode()];
        if (!info) {
          this.error("Cannot move because we can't find the parent node")
          return;
        }
        var children = info.children;
        if (!(children instanceof qx.Promise)) {
          var index = children.indexOf(node);
          if (index > -1) {
            if (!insertAfter && index == children.length - 1)
              return;
            if (index == children.indexOf(insertAfter) + 1)
              return;
            children.remove(node);
          }
          //children.push(node);
          children.insertAfter(insertAfter, node);
        }
        this.fireDataEvent("changeNodeChildren", parentNode);
      }finally {
        this.__inMove = false;
      }
    },

    /*
     * @Override
     */
    canMoveTo: function(node, parentNode, insertAfter) {
      var opts = this.getOptions();
      if (opts) {
        if (typeof opts.canMoveTo == "function")
          return opts.canMoveTo.call(this, node, parentNode, insertAfter);
      }

      if (parentNode) {
        for (var tmp = parentNode; tmp; tmp = this.getParent(tmp))
          if (tmp == node)
            return false;
      }

      return true;
    }
  }
});

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

qx.Class.define("multicolumntree.simple.Model", {
	extend: qx.core.Object,
	implement: [ multicolumntree.IModel ],
	
	construct: function(root, onDemand) {
		this.base(arguments);
		this.__nodeInfo = {};
		if (onDemand)
			this.setOnDemand(onDemand);
		if (root)
			this.setRoot(root);
	},
	
	properties: {
		"root": {
			init: null,
			nullable: true,
			event: "changeRoot",
			apply: "_applyRoot"
		},
		
		"onDemand": {
			init: false,
			nullable: false,
			check: "Boolean",
			event: "changeOnDemand"
		}
	},
	
	events: {
		/** Fired when a node's children change, data is the node */
		"changeNodeChildren": "qx.event.type.Data"
	},
	
	members: {
		__nodeInfo: null,
		
		_applyRoot: function(value, oldValue) {
			if (oldValue) {
				this._detach(oldValue);
			}
			if (value) {
				this._attach(value);
			}
		},
		
		_isAttached: function(node) {
			return !!this.__nodeInfo[node.toHashCode()];
		},
		
		_attach: function(node) {
			if (this._isAttached(node))
				return;
			this.__nodeInfo[this.toHashCode()] = {
				listenerId: node.addListener("changeChildren", this._onNodeChangeChildren, this)
			};
			if (!this.getOnDemand() || node.getHasLoadedChildren()) {
				var children = this.getChildren(node);
				for (var i = 0; i < children.length; i++) {
					this._attach(children[i]);
				}
			}
		},
		
		_detach: function(node) {
			var info = this.__nodeInfo[node.toHashCode()];
			if (!info)
				return;
			delete this.__nodeInfo[node.toHashCode()];
			node.removeListenerById(info.listenerId);
			
			if (!this.getOnDemand() || node.getHasLoadedChildren()) {
				var children = this.getChildren(node);
				for (var i = 0; i < children.length; i++) {
					this._detach(children[i]);
				}
			}
		},
		
		_onNodeChangeChildren: function(evt) {
			var data = evt.getData();
			
			if (data.type == "add") {
				for (var i = 0; i < data.added.length; i++)
					this._attach(data.added[i]);
				
			} else if (data.type == "remove") {
				for (var i = 0; i < data.removed.length; i++)
					this._detach(data.removed[i]);
			}
			
			var node = evt.getTarget();
			this.fireDataEvent("changeNodeChildren", node == this.getRoot() ? null : evt.getTarget());
		},
		
		_onNodeHasLoadedChildren: function(evt) {
			var node = evt.getTarget();
			/*
			 * do we need this? should be handled by changeChildren event already caught
			 * 
			var children = this.getChildren(node);
			for (var i = 0; i < children.length; i++) {
				this._attach(children[i]);
			}
			*/
			
			if (evt.getData())
				this.fireDataEvent("changeNodeChildren", node);
		},
		
		/*
		 * @Override multicolumntree.IModel
		 */
		getChildren: function(parent) {
			if (!parent)
				parent = this.getRoot();
			return parent.getChildren().toArray();
		},

    /*
     * @Override
     */
    promiseGetChildren: function(parent) {
      return qx.Promise.resolve(this.getChildren(parent));
    },
		
		/*
		 * @Override multicolumntree.IModel
		 */
		hasChildren: function(parent, loadOnDemand) {
			if (!parent)
				parent = this.getRoot();
			if (loadOnDemand || !this.getOnDemand() || parent.getHasLoadedChildren()) {
				return parent.getChildren().getLength() != 0 ? "yes" : "no";
			}
			parent.addListenerOnce("changeHasLoadedChildren", this._onNodeHasLoadedChildren, this);
			return "maybe";
		},
		
		/*
		 * @Override multicolumntree.IModel
		 */
		getParent: function(node) {
			return node.getParent();
		},
		
		/*
		 * @Override multicolumntree.IModel
		 */
		moveTo: function(node, parent, insertAfter) {
			if (!parent)
				parent = this.getRoot();
			parent.moveTo(node, insertAfter);
		},
		
		/*
		 * @Override
		 */
    canMoveTo: function(node, parentNode, insertAfter) {
      return true;
    }
	}
});
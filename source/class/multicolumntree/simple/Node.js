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

qx.Class.define("multicolumntree.simple.Node", {
	extend: multicolumntree.simple.AbstractNode,
	
	construct: function(label, icon, model) {
		this.base(arguments, label, icon, model);
		this._children.addListener("change", this._onChildrenChange, this);
	},
	
	members: {
	  moveTo: function(child, after) {
			if (!this._children.contains(child)) {
				this._children.insertAfter(after, child);
				return;
			}
			var arr = this._children.toArray();
			var fromIndex = arr.indexOf(child);
			arr.splice(fromIndex, 1);
			if (!after)
				arr.unshift(child);
			else {
				var toIndex = arr.indexOf(after) + 1;
				if (toIndex == arr.length)
					arr.push(child);
				else
					arr.splice(toIndex, 0, child);
			}
			if (fromIndex != arr.indexOf(child))
				this._children.fireDataEvent("change", { 
						start: 0,
						end: arr.length - 1,
						type: "order",
						items: null
					}, null);
		},
		
		_onChildrenChange: function(evt) {
			var data = evt.getData();
			var t = this;
			
			function added(lst) {
        for (var i = 0; i < lst.length; i++)
          lst[i].set({ parent: t });
			}
			function removed(lst) {
        for (var i = 0; i < lst.length; i++)
          lst[i].set({ parent: null });
			}
			
			if (data.type == "add")
			  added(data.added);
			else if (data.type == "remove")
			  removed(data.removed);
			else if (data.type == "add/remove") {
        added(data.added);
        removed(data.removed);
			}
			
			this.fireDataEvent("changeChildren", data);
		}
	}
});
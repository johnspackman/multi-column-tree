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
 * @asset(qx/icon/Tango/*)
 */
qx.Class.define("johnspackman.multicolumntree.test.DemoTreeController", {
	extend : qx.application.Standalone,

	members : {
		main : function() {
			// Call super class
			this.base(arguments);

			// Enable logging in debug variant
			if (qx.core.Environment.get("qx.debug")) {
				// support native logging capabilities, e.g. Firebug for Firefox
				qx.log.appender.Native;
				// support additional cross-browser console. Press F7 to toggle
				// visibility
				qx.log.appender.Console;
			}

			/*
			 * -------------------------------------------------------------------------
			 * Below is your actual application code...
			 * -------------------------------------------------------------------------
			 */

			// Document is the application root
			var doc = this.getRoot();

			var data =
			  { name: "Root", canHaveChildren: true, children:
				  [
            { name: "One", icon: "qx/icon/Tango/16/actions/dialog-apply.png", canHaveChildren: true, children: [] },
            { name: "Two", icon: "qx/icon/Tango/16/actions/dialog-apply.png", canHaveChildren: true, children: [] },
            { name: "Three", icon: "qx/icon/Tango/16/actions/dialog-apply.png", canHaveChildren: true, children:
            	[
            	 { name: "Alpha", icon: "qx/icon/Tango/16/actions/dialog-apply.png", canHaveChildren: true, children: [] },
            	 { name: "Bravo", icon: "qx/icon/Tango/16/actions/dialog-apply.png", canHaveChildren: true, children: [] },
            	 { name: "Charlie", icon: "qx/icon/Tango/16/actions/dialog-apply.png", canHaveChildren: true, children: [] },
            	 { name: "Delta", icon: "qx/icon/Tango/16/actions/dialog-apply.png", canHaveChildren: true, children: [] }
            	]
            },
            { name: "Four", icon: "qx/icon/Tango/16/actions/dialog-apply.png", canHaveChildren: false, children: [] },
            { name: "Five", icon: "qx/icon/Tango/16/actions/dialog-apply.png", canHaveChildren: false, children:
            	[
            	 { name: "George", icon: "qx/icon/Tango/16/actions/contact-new.png", canHaveChildren: false, children: [] },
            	 { name: "Bungle", icon: "qx/icon/Tango/16/actions/contact-new.png", canHaveChildren: false, children:
            		 [
		            	 { name: "Rod", icon: "qx/icon/Tango/16/actions/dialog-ok.png", canHaveChildren: false, children: [] },
		            	 { name: "jane", icon: "qx/icon/Tango/16/actions/dialog-ok.png", canHaveChildren: false, children: [] },
		            	 { name: "Freddy", icon: "qx/icon/Tango/16/actions/dialog-ok.png", canHaveChildren: false, children: [] }
            		 ]
            	 },
            	 { name: "Zippy", icon: "qx/icon/Tango/16/actions/contact-new.png", canHaveChildren: false, children: [] }
            	]
            },
	        ]
			  };
			var model = qx.data.marshal.Json.createModel(data);


			var ctlr = new johnspackman.multicolumntree.controller.Controller(null);
			ctlr.setOptions({
			  getChildrenPath: function() {
			    return "children";
			  },
			  getHasChildren: function(node) {
			    return !!node.getCanHaveChildren() || node.getChildren().getLength() != 0;
			  }
			});
			var tree = new johnspackman.multicolumntree.Tree().set({
				view: new johnspackman.multicolumntree.SimpleView("name", "icon"),
				showChecked: true,
				model: ctlr,
				decorator: "main",
				width: 200
			});
			tree.getChecked().addListener("change", function(evt) {
				var names = [];
				var lst = tree.getChecked();
				for (var i = 0; i < lst.getLength(); i++)
					names.push(lst.getItem(i).getName());
				dumpTree();
				console.log("checked=" + names.join(","));
			}, this);

			doc.add(tree, { left: 100, top: 100 });

			var comp = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
			doc.add(comp, { left: 325, top: 100 });

			var rg = new qx.ui.form.RadioGroup();
			var grp = new qx.ui.groupbox.GroupBox("Selection Mode");
			grp.setLayout(new qx.ui.layout.VBox());
			function add(title, value) {
				var rb = new qx.ui.form.RadioButton(title);
				rb.setModel(value||title);
				rg.add(rb);
				grp.add(rb);
				return rb;
			}
			add("single").setValue(true);
			add("one");
			add("multi");
			add("additive");
			rg.addListener("changeSelection", function(evt) {
				var rb = evt.getData()[0],
					mode = rb.getLabel();
				tree.setSelectionMode(mode);
			}, this);
			comp.add(grp);

			var cbxCancel = new qx.ui.form.CheckBox("Cancel beforeChangeSelection");
			comp.add(cbxCancel);
			tree.addListener("beforeChangeSelection", function(evt) {
				if (cbxCancel.getValue())
					evt.preventDefault();
      }, this);

			var cbxDnD = new qx.ui.form.CheckBox("Enable Drag & Drop");
			comp.add(cbxDnD);
			cbxDnD.addListener("changeValue", function(evt) {
        tree.setDraggable(evt.getData());
        tree.setDroppable(evt.getData());
			}, this);

			var btn = new qx.ui.form.Button("Add Some Items");
			comp.add(btn);
			var added = 0;
			var NAMES = [ "Aardvark", "Bull", "Cat", "Dog", "Elephant", "Fox" ];
			btn.addListener("execute", function(evt) {
				var g3c = model.getChildren().getItem(2).getChildren().getItem(1).getChildren();
				var clz = model.getChildren().getItem(0).constructor;
				var node = new clz();
				node.set({ name: NAMES[added], icon: "qx/icon/Tango/16/document-print.png", children: new qx.data.Array() });
				added++;
				g3c.push(node);
			}, this);

			var btn = new qx.ui.form.Button("Remove an Item");
			comp.add(btn);
			btn.addListener("execute", function(evt) {
				var g3c = model.getChildren().getItem(4).getChildren().getItem(1).getChildren();
				if (!g3c.getLength())
					return;
				if (g3c.getLength() > 1)
					g3c.splice(1, 1);
				else
					g3c.splice(0, 1);
			}, this);

			var btn = new qx.ui.form.Button("Check Some Items");
			comp.add(btn);
			var startChecked = 0;
			btn.addListener("execute", function(evt) {
				var index = startChecked;
				var checked = tree.getChecked();
				checked.removeAll();
				function scan(lst) {
					for (var i = 0; i < lst.getLength(); i++) {
						var node = lst.getItem(i);
						if ((index % 2) == 0)
							checked.push(node);
						index++;
						scan(node.getChildren());
					}
				}
				scan(model.getChildren());
				startChecked++;
			}, this);

      var btn = new qx.ui.form.Button("Replace Checked");
      comp.add(btn);
      btn.addListener("execute", function(evt) {
        var index = startChecked;
        var checked = new qx.data.Array();
        checked.removeAll();
        function scan(lst) {
          for (var i = 0; i < lst.getLength(); i++) {
            var node = lst.getItem(i);
            if ((index % 2) == 0)
              checked.push(node);
            index++;
            scan(node.getChildren());
          }
        }
        scan(model.getChildren());
        startChecked++;
        tree.setChecked(checked);
      }, this);

      var btn = new qx.ui.form.Button("Rename stuff");
      comp.add(btn);
      var nextRename = 0;
      btn.addListener("execute", function(evt) {
        if (nextRename == model.getLength())
          nextRename = 0;
        var item = model.getChildren().getItem(nextRename++);
        item.setName(item.getName() + "A");
        dumpTree();
      }, this);

			var txt = new qx.ui.form.TextArea().set({ width: 300, height: 500, font: "monospace" });
			doc.add(txt, { left: 550, top: 100 });
			tree.getModel().addListener("changeNodeChildren", dumpTree, this);
			function dumpTree() {
				var str = "";
				var checked = tree.getChecked();
				function collect(node, prefix) {
					str += prefix + node.getName();
					if (checked.contains(node))
						str += " (checked)";
					str += "\n";
					for (var i = 0, lst = node.getChildren(); i < lst.getLength(); i++)
						collect(lst.getItem(i), prefix + "-");
				}
				for (var i = 0; i < model.getChildren().getLength(); i++)
					collect(model.getChildren().getItem(i), "");
				txt.setValue(str);
			}
			dumpTree();

			tree.getModel().setModel(model);
			tree.expandAll();
		}
	},

	statics: {
		__DATA: [
		]
	}
});

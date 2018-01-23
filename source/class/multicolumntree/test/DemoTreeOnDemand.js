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

/*
 * @asset(qx/icon/Tango/*)
 */
qx.Class.define("multicolumntree.test.DemoTreeOnDemand", {
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
			
			var root = new multicolumntree.simple.Node(),
				children = root.getChildren(),
				node, node2, node3 = null;
			children.push(new multicolumntree.simple.Node("One", "qx/icon/Tango/16/actions/dialog-apply.png"));
			
			children.push(new multicolumntree.simple.Node("Two", "qx/icon/Tango/16/actions/dialog-apply.png"));
			children.push(node = new multicolumntree.simple.Node("Three", "qx/icon/Tango/16/actions/dialog-apply.png"));
			
			node.setHasLoadedChildren(false);
			node.addListener("loadChildren", function(evt) {
				var node = evt.getTarget();
				var nc = node.getChildren();
				nc.push(new multicolumntree.simple.Node("Alpha", "qx/icon/Tango/16/actions/dialog-apply.png"));
				nc.push(new multicolumntree.simple.Node("Bravo", "qx/icon/Tango/16/actions/dialog-apply.png"));
				nc.push(new multicolumntree.simple.Node("Charlie", "qx/icon/Tango/16/actions/dialog-apply.png"));
				nc.push(new multicolumntree.simple.Node("Delta", "qx/icon/Tango/16/actions/dialog-apply.png"));
			}, this);
			
			children.push(new multicolumntree.simple.Node("Four", "qx/icon/Tango/16/actions/dialog-apply.png"));
			children.push(node = new multicolumntree.simple.Node("Five", "qx/icon/Tango/16/actions/dialog-apply.png"));
			
			node.setHasLoadedChildren(false);
			node.addListener("loadChildren", function(evt) {
				var node = evt.getTarget();
				var nc = node.getChildren();
				nc.push(new multicolumntree.simple.Node("George", "qx/icon/Tango/16/actions/dialog-ok.png"));
				nc.push(new multicolumntree.simple.Node("Bungle", "qx/icon/Tango/16/actions/dialog-ok.png"));
				nc.push(node2 = new multicolumntree.simple.Node("Geoffrey", "qx/icon/Tango/16/actions/dialog-ok.png"));
				nc.push(new multicolumntree.simple.Node("Zippy", "qx/icon/Tango/16/actions/dialog-ok.png"));
				
				node2.addListener("loadChildren", function(evt) {
					var node2 = evt.getTarget();
					var ggc = node2.getChildren();
					ggc = node2.getChildren();
					ggc.push(new multicolumntree.simple.Node("Rod", "qx/icon/Tango/16/actions/contact-new.png"));
					ggc.push(node3 = new multicolumntree.simple.Node("Jane", "qx/icon/Tango/16/actions/contact-new.png"));
					ggc.push(new multicolumntree.simple.Node("Freddy", "qx/icon/Tango/16/actions/contact-new.png"));
				}, this);
				node2.setHasLoadedChildren(false);
			}, this);
			
			
			children.push(new multicolumntree.simple.Node("Six", "qx/icon/Tango/16/actions/dialog-apply.png"));
			children.push(new multicolumntree.simple.Node("Seven", "qx/icon/Tango/16/actions/dialog-apply.png"));
			children.push(new multicolumntree.simple.Node("Eight", "qx/icon/Tango/16/actions/dialog-apply.png"));
			children.push(new multicolumntree.simple.Node("Nine", "qx/icon/Tango/16/actions/dialog-apply.png"));
			children.push(new multicolumntree.simple.Node("Ten", "qx/icon/Tango/16/actions/dialog-apply.png"));
			children.push(new multicolumntree.simple.Node("Eleven", "qx/icon/Tango/16/actions/dialog-apply.png"));
			children.push(new multicolumntree.simple.Node("Twelve", "qx/icon/Tango/16/actions/dialog-apply.png"));
			var model = new multicolumntree.simple.Model(root, true);

			var tree = new multicolumntree.Tree().set({ 
				model: model, 
				view: new multicolumntree.SimpleView("label", "icon"),
				decorator: "main",
				width: 200
			});
			
			//tree.expandAll();
			
			/*var scroll = new qx.ui.container.Scroll().set({ width: 200, maxHeight: 100 });
			scroll.add(tree);
			doc.add(scroll, { left: 100, top: 100 });
			*/
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
			
			var btn = new qx.ui.form.Button("Add Some Items");
			comp.add(btn);
			btn.addListener("execute", function(evt) {
				if (!node3) {
					alert("Open 'Five' > 'Geoffrey' first");
					return;
				}
				var g3c = node3.getChildren();
				g3c.push(new multicolumntree.simple.Node("Cat", "qx/icon/Tango/16/document-print.png"));
				g3c.push(new multicolumntree.simple.Node("Dog", "qx/icon/Tango/16/document-print.png"));
				g3c.push(new multicolumntree.simple.Node("Elephant", "qx/icon/Tango/16/document-print.png"));
				g3c.push(new multicolumntree.simple.Node("Tiger", "qx/icon/Tango/16/document-print.png"));
			}, this);
			
			var btn = new qx.ui.form.Button("Remove an Item");
			comp.add(btn);
			btn.addListener("execute", function(evt) {
				if (!node3) {
					alert("Open 'Five' > 'George' first");
					return;
				}
				var g3c = node3.getChildren();
				if (!g3c.getLength())
					return;
				if (g3c.getLength() > 1)
					g3c.splice(1, 1);
				else
					g3c.splice(0, 1);
			}, this);
			
			var txt = new qx.ui.form.TextArea().set({ width: 300, height: 500, font: "monospace" });
			doc.add(txt, { left: 550, top: 100 });
			model.addListener("changeNodeChildren", function() {
				var str = "";
				function collect(node, prefix) {
					str += prefix + node.getLabel() + "\n";
					if (node.getHasLoadedChildren()) {
						for (var i = 0, lst = node.getChildren(); i < lst.getLength(); i++)
							collect(lst.getItem(i), prefix + "-");
					} else {
						str += prefix + "-(not loaded)\n";
					}
				}
				collect(root, "");
				txt.setValue(str);
			}, this);
		}
	},
	
	statics: {
		__DATA: [
		]
	}
});
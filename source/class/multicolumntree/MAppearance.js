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

qx.Theme.define("multicolumntree.MAppearance", {

	appearances: {

		"gtree": {
			style: function(states) {
				return {
					
				};
			}
		},
		
		"gtree-row": {
			style: function(states) {
				return {
					textColor : states.selected ? "text-selected" : undefined,
					decorator : states.selected ? "selected" : undefined
				};
			}
		},
		
		"gtree-row/column-widget": "atom",
		
		"gtree-row/arrow": {
		  alias: "image",
		  style: function(states) {
		    var icon;
		    if (!states.hasChildren)
		      icon = "no-arrow";
		    else {
		      icon = states.opened ? "arrow-opened" : "arrow-closed";
		      if (states.selected)
	          icon += "-selected";
		    }
		    return {
		      source: "multicolumntree/" + icon + ".png"
		    };
		  }
		},
		
		"gtree-row/content/label": {
			style: function(states) {
				return {
					textColor : states.selected ? "text-selected" : undefined,
					padding: [ 2, 0, 0, 2 ]
				};
			}
		},
		
    "gtree-row/content/icon": "image",
		
		"gtree-dropcaret": {
		  alias: "gtree-row",
			style: function(states) {
				return {
					opacity: 0.5
				};
			}
		},
		
		"tree-column-rowwidget": {
      alias: "atom",

      style: function(states) {
        return {
          
        };
      }
		}, 
		
		"tree-column-cell": {
		  alias: "atom",

      style: function(states) {
        var decorator;
        return {
          padding: [ 3, 0, 2, 0 ],
          textColor: states.disabled ? "text-disabled" : states.selected ? "text-selected" : "text-label"
        };
      }
		}
		
	}
});

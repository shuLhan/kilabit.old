var WUI =
{
	homepage : "contents"

,	set_content : function (link)
	{
		var wc = $("#wui_content");

		wc.empty ();

		wc.load (link);
	}

,	on_menu_click : function (e)
	{
		var id		= e.data.id;
		var pid		= e.data.pid;
		var link	= e.data.link;
		var load	= e.data.load;

		// remove active state in the same menu
		$(this).parent ().siblings().removeClass ("active");

		// set current menu to active
		$(this).parent ().addClass ("active");

		// if top menu hide all submenu
		if ("" === pid) {
			$("#wui_menu ol").addClass ("hidden");

			// then remove active state in all submenu
			$("#wui_menu ol li").removeClass ("active");
		} else {
			// remove active state in all submenu
			$("#wui_menu #"+ pid +" ~ ol li").removeClass ("active");

			// hide all submenu under this submenu
			$("#wui_menu #"+ pid +" ~ ol").addClass ("hidden");
		}

		// show submenu if exist
		$("#wui_menu #"+ id).removeClass ("hidden");

		if (load) {
			WUI.set_content (link);
		}
	}

,	create_submenu : function (id, menu)
	{
		var wui_menu = $("#wui_menu");

		wui_menu.append ("<ol id='"+ id +"' class='breadcrumb hidden'>");

		var sm = wui_menu.find ("#"+ id);

		for (var i = 0; i < menu.length; i++) {
			var m	= menu[i];
			var mi	= $("<li/>");
			var a	= $("<a/>", {
							href	: "#"+ m.id
						,	html	: m.title
						});

			a.on ("click", {
				id		: m.id
			,	pid		: m.pid
			,	link	: m.link
			,	load	: m.load
			}, WUI.on_menu_click);

			mi.append (a);

			sm.append (mi);

			if (m.submenu.length > 0) {
				WUI.create_submenu (m.id, m.submenu);
			}
		}
	}

,	run : function ()
	{
		$( document ).ready (function() {
			// create top menu
			$("#wui_menu").append ("<ul class='nav nav-tabs' role='tablist'>");

			var tab = $("#wui_menu ul");
			for (var i = 0; i < wui_menu.length; i++) {
				var m	= wui_menu[i];
				var mi	= $("<li/>");
				var a	= $("<a/>", {
							href	: "#"+ m.id
						,	html	: m.title
						});

				a.on ("click", {
					id		: m.id
				,	pid		: m.pid
				,	link	: m.link
				,	load	: m.load
				}, WUI.on_menu_click);

				mi.append (a);

				tab.append (mi);

				if (m.submenu.length > 0) {
					WUI.create_submenu (m.id, m.submenu);
				}
			}
		});
	}
};

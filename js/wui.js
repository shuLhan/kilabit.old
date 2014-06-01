var WUI =
{
	homepage : "contents"
,	social_icon : {}
,	footer :
	{
		text		:new Date().getFullYear() +" - kilabit.info"
	,	thanks_to	:
		[{
			image		:"/images/bootstrap.png"
		,	url			:"http://getbootstrap.com"
		},{
			image		:"/images/jquery.png"
		,	url			:"http://jquery.com"
		},{
			image		:"/images/php.png"
		,	url			:"http://php.net"
		},{
			image		:""
		,	text		:"FLATICON"
		,	url			:"http://flaticon.com"
		}]
	}

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

		if (true === load) {
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

,	create_top_menu : function ()
	{
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
	}

,	set_frontpage : function ()
	{
		var id		= WUI.homepage.replace (/[^a-zA-Z0-9]/g, "-");
		var hp_el	= $("#wui_menu a[href='#"+ id +"']");
		hp_el.trigger ("click");
	}

,	generate_social_icon : function ()
	{
		var el = $("#wui_social_icon");

		for (var k in WUI.social_icon) {
			if (! WUI.social_icon.hasOwnProperty (k)) {
				continue;
			}
			if ("" === WUI.social_icon[k]) {
				continue;
			}

			var a = $("<a/>", {
					href 	: WUI.social_icon[k]
				,	target	:"_blank"
				});

			var img = $("<img/>", {
					"class" : "wui_social_icon"
				,	src		: "/images/"+ k +".svg"
				});

			var span = $("<span/>");

			a.append (img);
			span.append (a);
			el.append (span);
		}
	}

,	generate_footer : function ()
	{
		var fl = $("#wui_footer_left");
		var fr = $("#wui_footer_right");

		fl.append ("<span>"+ WUI.footer.text +"</span>");
		fr.append ("Powered by ");

		for (var k in WUI.footer.thanks_to) {
			var tx = WUI.footer.thanks_to[k];

			var a	= $("<a/>", {
						href	:tx.url
					,	target	:"_blank"
					});

			var img = $("<img/>", {
						"class"	:"wui_footer_thanks"
					,	src		:tx.image
					,	alt		:tx.text
					});

			var span = $("<span/>");

			a.append (img);
			span.append (a);
			fr.append (span);
		}
	}

,	run : function ()
	{
		$( document ).ready (function() {
			// create top menu
			WUI.create_top_menu ();

			// set front page defined in the config.php
			WUI.set_frontpage ();

			// set social icon
			WUI.generate_social_icon ();

			WUI.generate_footer ();

			// jquery: disable auto scrolling to top
			// credit: http://www.techiecorner.com/2768/jquery-disable-autoscrolling-to-top-when-click-on-anchor/
			$('body').on('click', '[href^=#]', function (e) { e.preventDefault() });
		});
	}
};

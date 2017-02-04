/*
	Copyright 2014-2016 Mhd Sulhan (ms@kilabit.info)
*/
'use strict';

var WUI =
{
	homepage : "/home"
,	location: "/"
,	config : {
		"title"				: "kilabit.info"
	,	"subtitle"			: "Simple | Small | Stable | Secure"

	,	"journal_dir"		: "/journal"
	,	"journal_name"		: "Journal"

	,	"contents_dir"		: "./"

	,	"social_icon"		:
		{
			"facebook"			: ""
		,	"glider"			: "/"
		,	"github"			: "https://github.com/shuLhan"
		,	"google_plus"		: "https://plus.google.com/+MhdSulhan"
		,	"linked"			: "https://id.linkedin.com/in/muhamadsulhan/"
		,	"twitter"			: "https://twitter.com/MhdSulhan"
		,	"feed"				: "http://feeds.feedburner.com/Kilabit"
		}
	}
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

	// DOM element for wui content
,	el: {
		content: null
	,	meta: null
	,	comment: null
	}

,	set_title : function ()
	{
		$("#wui_title").append (WUI.config ["title"]);
		document.title = WUI.config ["title"];
	}

,	set_subtitle : function ()
	{
		$("#wui_subtitle").append (WUI.config["subtitle"]);
	}

,	wui_comment_on_submit : function (event)
	{
		var $form	= $(this);
		var data	= {};

		data.c_link			= $form.find ("#c_link").val ();
		data.c_content		= $form.find ("#c_content").val ();

		$.ajax ({
				type	: $form.attr ("method")
			,	url		: $form.attr ("action")
			,	data	: data
			,	dataType: "json"
			,	success	: function (resp, status)
				{
					var l = data.c_link.replace ("comment.json", "");
					window.open (l, "_self");
				}
			,	error	: function (xhr, status, errorThrown)
				{
					alert (xhr);
				}
			});

		event.preventDefault();
	}

,	path2id : function (str)
	{
		return str.replace (/\//g, "-");
	}

,	set_content_meta : function (res, link)
	{
		var doc = document.implementation.createHTMLDocument("content_edit");

		doc.documentElement.innerHTML = res;

		WUI.el.meta.empty ();

		// set field based on meta data
		$(doc).find ("html > head > meta").each (function () {
			var m_name = $(this).attr ("name");
			var m_content = $(this).attr ("content");

			if (undefined !== m_name) {
				WUI.el.meta.append ("<tr>"
						+"<th>"+ m_name +":</th>"
						+"<td>"+ m_content +"</td>"
						+"</tr>");
			}
		});

		WUI.el.meta.append (
			"<tr>"
				+"<th>permalink:</th>"
				+"<td>"
					+"<a href='"+ link +"'>"+ link +"</a>"
				+"</td>"
			+"</tr>"
		);
	}

,	content_on_load : function (link)
	{
		return function (res, stat, xhr)
		{
			link = link.replace (/^\.\//, "/");
			link = link.replace (/^\/\//, "/");
			link = link.replace ("/content.html", "");

			// fix script source
			WUI.el.content.find ("script").each (function (i)
			{
				var src = $(this).attr ("src");

				if (undefined != src) {
					src = src.replace (/^\.\//, "");
					$(this).attr ("src", link +"/"+ src);
				}
			});

			// add meta to content
			WUI.set_content_meta (res, link);
		}
	}

,	content_reset: function()
	{
		WUI.el.content.empty();
		WUI.el.meta.empty();
	}

,	set_content : function (node)
	{
		var link	= node.link;
		var ts		= "?_ts="+ new Date ().getTime ();

		WUI.content_reset();

		WUI.el.content.load (link + ts, null, WUI.content_on_load (link));
	}

,	set_content_comment : function (node)
	{
		var wc		= $("#comments");
		var ts		= "?_ts="+ new Date ().getTime ();
		var link	= node.link.replace ("index.html", "comment.json");

		$("#c_link").val (link);

		wc.empty ();

		$.getJSON (link + ts, function (data) {
				$.each (data, function (idx, d) {
					wc.append (
					"<div class='panel'>"
						+"<div class='panel-body'>"
							+"<span id='comment_time'>"
							+ WUIFeed.date2string (new Date(d.time * 1000))
							+" -- </span>"
							+"<strong>"
								+ (d.author === "" ? "Anonymous" : d.author)
							+"</strong>"
							+"<br/>"
							+ d.v
						+"</div>"
					+"</div>"
					);
				});
			});
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
			WUI.set_content (e.data);

//			if (true === e.data.comment) {
//				$("#wui_comment_panel").removeClass ("hidden");
//				WUI.set_content_comment (e.data);
//			} else {
//				$("#wui_comment_panel").addClass ("hidden");
//			}
		} else {
			WUI.content_reset();
		}

		window.history.pushState("", "", e.data.base);

		return false;
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
							href	: "#"+ m.base
						,	html	: m.title
						});

			a.on ("click", {
				id		: m.id
			,	pid		: m.pid
			,	base	: m.base
			,	link	: m.link
			,	load	: m.load
			,	title	: m.title
			,	comment	: m.comment
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
						href	: "#"+ m.base
					,	html	: m.title
					});

			a.on ("click", {
				id		: m.id
			,	pid		: m.pid
			,	base	: m.base
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

,	set_location: function ()
	{
		var ids		= WUI.path2id (WUI.location);
		var ida		= ids.split ("-");
		var id		= "";

		for (var i = 0; i < ida.length; i++) {
			if ("" !== ida[i]) {
				id += "/" + ida[i];
				var hp_el = $("#wui_menu a[href='#"+ id +"']");

				hp_el.trigger ("click");
			}
		}
	}

,	set_social_icon : function ()
	{
		var el = $("#wui_social_icon");

		for (var k in WUI.config.social_icon) {
			if (! WUI.config.social_icon.hasOwnProperty (k)) {
				continue;
			}
			if ("" === WUI.config.social_icon[k]) {
				continue;
			}

			var a = $("<a/>", {
					href 	: WUI.config.social_icon[k]
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

,	generate_subindex : function (parent_comp, menu)
	{
		var list = $("<ul/>");

		parent_comp.append (list);

		for (var i = 0; i < menu.length; i++) {
			var m	= menu[i];
			var mi	= $("<li/>");
			var a	= $("<a/>", {
							href	: m.base
						,	target	: "_blank"
						,	html	: m.title
						});

			mi.append (a);

			list.append (mi);

			if (m.submenu.length > 0) {
				WUI.generate_subindex (mi, m.submenu);
			}
		}
	}

,	generate_index : function (id)
	{
		var c = $("#"+ id);

		if (null === c) {
			return;
		}

		// traverse through wui menu.
		var list = $("<ul/>");

		c.append (list);

		for (var i = 0; i < wui_menu.length; i++) {
			var m	= wui_menu[i];
			var mi	= $("<li/>");
			var a	= $("<a/>", {
						href	: m.base
					,	target	: "_blank"
					,	html	: m.title
					});

			mi.append (a);

			list.append (mi);

			if (m.submenu.length > 0) {
				WUI.generate_subindex (mi, m.submenu);
			}
		}
	}

,	run : function ()
	{
		// Listen to back button.
		window.onpopstate = function(ev)
		{
			WUI.location = document.location.pathname;
			WUI.set_location();
		};

		$( document ).ready (function()
		{
			// Get DOM element for fast modification.
			WUI.el.content = $("#wui_content");
			WUI.el.meta = $("#wui_content_meta");

			WUI.location = location.pathname;

			if (WUI.location === '/') {
				WUI.location = WUI.homepage;
			}

			// apply configuration
			WUI.set_title ();
			WUI.set_subtitle ();

			// set social icon
			WUI.set_social_icon ();

			// create top menu
			WUI.create_top_menu ();

			// set front page
			WUI.set_location();

			WUI.generate_footer ();

			$("#wui_comment_form").on("submit", WUI.wui_comment_on_submit);
		});
	}
};

//
// MAIN
//
$( document ).ready (function()
{
	WUI.run ();
});

//# sourceURL=/js/wui.js

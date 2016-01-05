/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
var WUI =
{
	homepage : "contents"
	// loaded later
,	config : {}
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
		var meta = $("#wui_content_meta");

		doc.documentElement.innerHTML = res;

		meta.empty ();

		// set field based on meta data
		$(doc).find ("html > head > meta").each (function () {
			var m_name = $(this).attr ("name");
			var m_content = $(this).attr ("content");

			if (undefined !== m_name) {
				meta.append ("<tr>"
						+"<th>"+ m_name +":</th>"
						+"<td>"+ m_content +"</td>"
						+"</tr>");
			}
		});

		meta.append (
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
			var wc = $("#wui_content");

			link = link.replace (/^\.\//, "/");
			link = link.replace (/^\/\//, "/");
			link = link.replace ("/index.html", "");

			// do not fix it on homepage
//			if (WUI.homepage === link) {
//				return;
//			}

			// fix script source
			wc.find ("script").each (function (i)
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

,	set_content : function (node)
	{
		var link	= node.link;
		var wc		= $("#wui_content");
		var ts		= "?_ts="+ new Date ().getTime ();

		wc.empty ();

		wc.load (link + ts, null, WUI.content_on_load (link));
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

			if (true === e.data.comment) {
				$("#wui_comment_panel").removeClass ("hidden");
				WUI.set_content_comment (e.data);
			} else {
				$("#wui_comment_panel").addClass ("hidden");
			}
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
							href	: "#!"+ m.id
						,	html	: m.title
						});

			a.on ("click", {
				id		: m.id
			,	pid		: m.pid
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
						href	: "#!"+ m.id
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
		var ids		= WUI.path2id (WUI.homepage);
		var ida		= ids.split ("-");
		var id		= "";

		for (var i = 0; i < ida.length; i++) {
			if ("" !== ida[i]) {
				id += "-" + ida[i];
				var hp_el = $("#wui_menu a[href='#!"+ id +"']");

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
							href	: m.link.replace ("/index.html", "")
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

		if (null == c) {
			return;
		}

		// traverse through wui menu.
		var list = $("<ul/>");

		c.append (list);

		for (var i = 0; i < wui_menu.length; i++) {
			var m	= wui_menu[i];
			var mi	= $("<li/>");
			var a	= $("<a/>", {
						href	: m.link.replace ("/index.html", "")
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
		$( document ).ready (function() {
			// load configuration.
			$.getJSON ("/js/wui_config.json", function (data) {
				WUI.config = data;

				// apply configuration
				WUI.set_title ();
				WUI.set_subtitle ();

				// set social icon
				WUI.set_social_icon ();

				// create top menu
				WUI.create_top_menu ();

				// set front page defined in the config.php
				WUI.set_frontpage ();

				WUI.generate_footer ();
			});

			// jquery: disable auto scrolling to top
			// credit: http://www.techiecorner.com/2768/jquery-disable-autoscrolling-to-top-when-click-on-anchor/
			$('body').on ('click', '[href^=#]', function (e) {
				e.preventDefault()
			});
		});
	}
};

var WUIFeed =
{
	_v : new Array ()
,	_o : ""
,	_n : 0
,	_state : null
,	_pgbar : null
,	_inprogress : 0
,	_holder : null

,	init : function (feed_list)
	{
		WUIFeed._n			= feed_list.length * 2;
		WUIFeed._inprogress	= 0;
		WUIFeed._state		= $("#feed_status");
		WUIFeed._pgbar		= $("#pgbar");
		WUIFeed._holder		= $("#my_activity");

		if (feed_list == undefined) {
			return;
		}

		$("#feed_progress").removeClass ("hidden");

		for (var i = 0; i < feed_list.length; i++) {
			WUIFeed.get (feed_list[i]);
		}
	}

,	load : function ()
	{
		WUIFeed._holder = $("#my_activity");

		WUIFeed._v.sort (WUIFeed.sort);
		WUIFeed._o = "";
		WUIFeed.generate_output ();

		WUIFeed._holder.empty ();
		WUIFeed._holder.append ($.parseHTML (WUIFeed._o));
	}

,	get : function (feed)
	{
		WUIFeed.update_progress ("<p>Loading "+ feed.name +"</p>");

		$.get ("/get_feed.php"
		, { url : feed.url }
		, function (req)
		{
			var xml		= $.parseXML (req);
			var type	= xml.firstChild;

			WUIFeed.update_progress ("<p>Parsing "+ feed.name +"</p>");

			switch (type.nodeName) {
			case "feed":
				WUIFeed.atom_parsing (xml);
				break;
			case "rss":
				var v = type.getAttribute ("version");

				switch (v) {
				case "2.0":
					WUIFeed.rss20_parsing (xml);
					break;
				default:
					console.warn ("Unknown RSS version:"+ v);
					return;
				}
				break;
			default:
				console.warn ("Unknown feed type:"+ type.nodeName);
				return;
			}

			WUIFeed.load ();
		})
		.fail(function()
		{
			WUIFeed.update_progress("<p class='error'>Fail "+ feed.name +"</p>");
		});
	}

,	atom_parsing : function(xml)
	{
		var entries = xml.getElementsByTagName("entry");

		for (var i = 0; i < entries.length; i++) {
			var entry = {};

			entry.type = "atom";

			for (var c = 0; c < entries[i].childNodes.length; c++) {
				var child = entries[i].childNodes[c];

				if (child.nodeType != 1) {
					continue;
				}

				switch (child.nodeName) {
				case "link":
					entry[child.nodeName] = child.getAttribute("href");
					break;
				case "published":
					entry["my_date"] = new Date(child.textContent);
					break;
				case "updated":
					var date_str = child.textContent;

					entry["my_date"] = new Date(date_str);

					if (isNaN (entry["my_date"])) {
						date_str = date_str.replace ("UTC", "");
						entry["my_date"] = new Date(date_str);
					}
					break;
				default:
					var type = child.getAttribute("type");

					if (type == "xhtml") {
						entry[child.nodeName] = child.innerHTML;
					} else {
						entry[child.nodeName] = child.textContent;
					}
				}
			}

			WUIFeed._v[WUIFeed._v.length] = entry;
		}
	}

,	rss20_str2date : function (str)
	{
		var mm_to_m	= {
				  Jan:"01", Feb:"02", Mar:"03", Apr:"04", May:"05"
				, Jun:"06", Jul:"07", Aug:"08", Sep:"09", Oct:"10"
				, Nov:"11", Dec:"12"
				};
		var arr_date	= str.split(/\s+/);

		if (arr_date.length <= 5) {
			return null;
		}

		var d		= arr_date[1];
		var mm		= arr_date[2];
		var y		= arr_date[3];
		var time	= arr_date[4];
		var gmt_l	= "+00";
		var gmt_r	= "00";

		if (arr_date[5].length === 5) {
			gmt_l	= arr_date[5].substring(0,3);
			gmt_r	= arr_date[5].substring(3,5);
		}

		var sdate	= "";

		sdate = y +"-"+ mm_to_m[mm] +"-"+ d +"T"+ time
			+ gmt_l +":"+ gmt_r;

		return new Date(sdate);
	}

,	rss20_parsing : function(xml)
	{
		var entries = xml.getElementsByTagName("item");

		for (var i = 0; i < entries.length; i++) {
			var entry = {};

			entry.type = "rss20";

			for (var c = 0; c < entries[i].childNodes.length; c++) {
				var child = entries[i].childNodes[c];

				if (child.nodeType != 1) {
					continue;
				}

				switch (child.nodeName) {
				case "pubDate":
					var pubdate = WUIFeed.rss20_str2date(child.textContent);

					if (pubdate !== null) {
						entry["my_date"] = pubdate;
					}
					break;
				case "a10:updated":
					entry["my_date"] = new Date(child.textContent);
					break;
				default:
					entry[child.nodeName] = child.textContent;
				}
			}

			WUIFeed._v[WUIFeed._v.length] = entry;
		}
	}

,	sort : function (a, b)
	{
		return b.my_date > a.my_date;
	}

,	generate_output : function()
	{
		for (var i = 0, v; i < WUIFeed._v.length; i++) {
			v = WUIFeed._v[i];

			switch(v.type) {
			case "atom":
				WUIFeed._o	+= "<div class='activity'>"
					+ "<div class='activity_header'>"
					+ "<a href='"+ v.link +"'>"
					+ v.title
					+ "</a>"
					+ "<span class='activity_date'>"
					+ WUIFeed.date2string(v.my_date)
					+ "</span>"
					+ "</div>"
					+ (v.content != undefined
						? v.content
						: v.summary != undefined
							? v.summary : "")
					+ "</div>";
				break;
			case "rss20":
				WUIFeed._o	+= "<div class='activity'>"
					+ "<div class='activity_header'>"
					+ "<a href='"+ v.link +"'>"
					+ v.title
					+ "</a>"
					+ "<span class='activity_date'>"
					+ WUIFeed.date2string(v.my_date)
					+ "</span>"
					+ "</div>"
					+ v.description
					+ "</div>";
				break;
			}
		}
	}

,	date2string : function(date)
	{
		var month	= date.getUTCMonth() + 1;
		var day		= date.getUTCDate();
		var hour	= date.getUTCHours();
		var minute	= date.getUTCMinutes();
		var second	= date.getUTCSeconds();

		month	= (month < 10 ? "0" + month : month);
		day	= (day < 10 ? "0" + day : day);
		hour	= (hour < 10 ? "0" + hour : hour);
		minute	= (minute < 10 ? "0" + minute : minute);
		second	= (second < 10 ? "0" + second : second);

		return (date.getUTCFullYear() +"."+ month +"."+ day +" "
			+ hour +":"+ minute +":"+ second);
	}

,	update_progress : function (string)
	{
		WUIFeed._inprogress++;

		var v = (WUIFeed._inprogress / 2) * 10;

		WUIFeed._pgbar
			.css('width', v+'%')
			.attr ("aria-valuenow", v);

		WUIFeed._state.prepend (string);

		if (WUIFeed._inprogress == WUIFeed._n) {
			$("#feed_progress").addClass ("hidden");
		}
	}
};

//# sourceURL=wui.js

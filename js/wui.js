var WUI =
{
	homepage : "contents"
,	contents_exclude : []
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

,	path2id : function (str)
	{
		return str.replace (/[^a-zA-Z0-9]/g, "-");
	}

,	set_content : function (link)
	{
		var wc = $("#wui_content");

		wc.empty ();

		wc.load (link, function (res, stat, xhr)
			{
				// fix image source
				link = link.replace (/^\.\//, "/");
				link = link.replace (/^\/\//, "/");
				link = link.replace ("/index.html", "");

				// do not fix it on homepage
				if (WUI.homepage === link) {
					return;
				}

				wc.find ("img").each (function (i)
				{
					var src = $(this).attr ("src");
					src = src.replace (/^\.\//, "");
					$(this).attr ("src", link +"/"+ src);
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

,	process_exclude : function ()
	{
		for (var ex in WUI.contents_exclude) {
			var id = WUI.path2id (WUI.contents_exclude[ex])

			$("#wui_menu a[href='#"+ id +"']").addClass ("hidden");
		}
	}

,	set_frontpage : function ()
	{
		var id		= WUI.path2id (WUI.homepage);
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

			// hide exclude menu based on contents_exclude in config.php.
			WUI.process_exclude ();

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

var WUIFeed =
{
	_v : new Array ()
,	_o : ""

,	init : function (feed_list)
	{
		if (feed_list == undefined) {
			return;
		}

		for (var i = 0; i < feed_list.length; i++) {
			WUIFeed.get (feed_list[i]);
		}
	}

,	get : function (uri)
	{
		$.get ("/get_feed.php"
		, { url : uri }
		, function (req)
		{
			var xml		= $.parseXML (req);
			var type	= xml.firstChild;

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

			WUIFeed._v.sort (WUIFeed.sort);
			WUIFeed._o = "";
			WUIFeed.generate_output ();

			$("#my_activity").empty ();
			$("#my_activity").append ($.parseHTML (WUIFeed._o));
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
					/* no break */
				default:
					entry[child.nodeName] = child.textContent;
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
				if (child.nodeName === "pubDate") {
					var pubdate = WUIFeed.rss20_str2date(child.textContent);

					if (pubdate !== null) {
						entry["my_date"] = pubdate;
					}
				} else {
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
					+ v.content
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
};

//# sourceURL=wui.js

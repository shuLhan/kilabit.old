/*
	Copyright 2016 Mhd Sulhan (ms@kilabit.info)
*/
'use strict';

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

		if (feed_list === undefined) {
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
		WUIFeed._holder.empty ();
		WUIFeed._holder.append (WUIFeed._o);
	}

,	parseUrl: function(url)
	{
		var el = document.createElement("a");
		el.href = url;
		return el;
	}

,	get : function (feed)
	{
		WUIFeed.update_progress ("<p>Loading "+ feed.name +"</p>");

		feed.a = WUIFeed.parseUrl(feed.url);

		$.get ("/get_feed.php"
		, { url : feed.url }
		, function (req)
		{
			var xml = $.parseXML (req);

			if (xml === null) {
				WUIFeed.update_progress ("<p>Error "+ feed.name +"</p>");
				return
			}

			var type	= xml.firstChild;

			switch (type.nodeName) {
			case "feed":
				WUIFeed.atom_parsing(feed, xml);
				break;
			case "rss":
				var v = type.getAttribute ("version");

				switch (v) {
				case "2.0":
					WUIFeed.rss20_parsing(feed, xml);
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

			WUIFeed.update_progress ("<p>Parsed "+ feed.name +"</p>");
		})
		.fail(function()
		{
			WUIFeed.update_progress("<p class='error'>Fail "+ feed.name +"</p>");
		});
	}

	// Cleaning up.
	//
	// (1) If href is mismatch, replace with original host.
	//
,	cleanup: function(feed, htmlstr)
	{
		var dom = $.parseHTML('<div>'+ htmlstr +'</div>', null)[0];

		// (1)
		var anchors = dom.getElementsByTagName('a')
		for (var x = 0; x < anchors.length; x++) {
			if (anchors[x].hostname !== feed.a.hostname) {
				anchors[x].hostname = feed.a.hostname;
			}
		}

		return dom.innerHTML;
	}

,	atom_parsing : function(feed, xml)
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

				case "summary":
				case "content":
					var type = child.getAttribute("type");
					var htmlstr;

					if (type === "xhtml") {
						htmlstr = child.innerHTML;
					} else {
						htmlstr = child.textContent;
					}

					entry[child.nodeName] = WUIFeed.cleanup(feed, htmlstr);
					break;

				default:
					entry[child.nodeName] = child.textContent;
					break;
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

,	rss20_parsing : function(feed, xml)
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
					entry[child.nodeName] = WUIFeed.cleanup(feed
						, child.textContent);
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
		if (date == undefined) {
			date = new Date()
		}
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

		if (WUIFeed._inprogress >= WUIFeed._n) {
			$("#feed_progress").addClass ("hidden");

			WUIFeed._v.sort (WUIFeed.sort);
			WUIFeed.generate_output();
			WUIFeed._holder.empty ();
			WUIFeed._holder.append(WUIFeed._o);
		}
	}
};

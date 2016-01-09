var scale = 2000;
var osm;
var map;
var slider;
var timeout;
var eqd = [];
var cnt = 0;
var info = {};
var playing = 0;
var mag_0 = L.layerGroup ();
var mag_1 = L.layerGroup ();
var mag_2 = L.layerGroup ();
var mag_3 = L.layerGroup ();
var mag_4 = L.layerGroup ();
var mag_5 = L.layerGroup ();
var mag_6 = L.layerGroup ();
var mag_7 = L.layerGroup ();

function open_popup (e)
{
	var data = eqd[e.target.options.data_idx];
	var m = data.mag;
	var popup = L.popup ().setLatLng ([data.lat, data.lg])
			.setContent (
					"Tanggal: "+ data.date +"<br/>"
				+	"Waktu: "+ data.time +"<br/>"
				+	"Latitude: "+ data.lat +"<br/>"
				+	"Longitude: "+ data.lg +"<br/>"
				+	"Magnitudo: "+ data.mag +" "+ data.type_mag +"<br/>"
				+	"Kedalaman: "+ data.depth +"<br/>"
				+	"Wilayah: " + data.region +"<br/>"
		).addTo (map);
}

function do_mark (i)
{
	var m = eqd[i].mag;

	var circle = L.circle ([eqd[i].lat, eqd[i].lg, eqd[i].depth], m * scale, {
		color		: get_color (m)
	,	fillColor	: get_color (m)
	,	fillOpacity	: 0.5
	,	data_idx	: i
	});

	circle.on ("click", open_popup);

	m > 7 ? mag_7.addLayer (circle) :
	m > 6 ? mag_6.addLayer (circle) :
	m > 5 ? mag_5.addLayer (circle) :
	m > 4 ? mag_4.addLayer (circle) :
	m > 3 ? mag_3.addLayer (circle) :
	m > 2 ? mag_2.addLayer (circle) :
	m > 1 ? mag_1.addLayer (circle) :
			mag_0.addLayer (circle);


	info.update (eqd[i].date, eqd[i].time);
}

function do_unmark (i)
{
	var m = eqd[i].mag;

	if (m > 7) {
		mag_7.eachLayer (function (layer)
		{
			if (layer.options.data_idx == i) {
				mag_7.removeLayer (layer);
				return;
			}
		});
	} else if (m > 6) {
		mag_6.eachLayer (function (layer)
		{
			if (layer.options.data_idx == i) {
				mag_6.removeLayer (layer);
				return;
			}
		});
	} else if (m > 5) {
		mag_5.eachLayer (function (layer)
		{
			if (layer.options.data_idx == i) {
				mag_5.removeLayer (layer);
				return;
			}
		});
	} else if (m > 4) {
		mag_4.eachLayer (function (layer)
		{
			if (layer.options.data_idx == i) {
				mag_4.removeLayer (layer);
				return;
			}
		});
	} else if (m > 3) {
		mag_3.eachLayer (function (layer)
		{
			if (layer.options.data_idx == i) {
				mag_3.removeLayer (layer);
				return;
			}
		});
	} else if (m > 2) {
		mag_2.eachLayer (function (layer)
		{
			if (layer.options.data_idx == i) {
				mag_2.removeLayer (layer);
				return;
			}
		});
	} else if (m > 1) {
		mag_1.eachLayer (function (layer)
		{
			if (layer.options.data_idx == i) {
				mag_1.removeLayer (layer);
				return;
			}
		});
	} else {
		mag_0.eachLayer (function (layer)
		{
			if (layer.options.data_idx == i) {
				mag_0.removeLayer (layer);
				return;
			}
		});
	}
}

function do_play_mark ()
{
	if (playing) {
		if (cnt >= eqd.length) {
			cnt = 0;
			playing = 0;
			clearTimeout (timeout);
		} else {
			timeout = setTimeout ('do_play_mark ()', 200);
			cnt++;
		}

		do_mark (cnt);
	}

	slider.slider ("value", cnt);
}

function do_play ()
{
	var play = $("#play");

	if (play.hasClass ("glyphicon-play")) {
		playing = 1;
		play.removeClass ("glyphicon-play");
		play.addClass ("glyphicon-stop");

		do_play_mark ();
	} else {
		play.removeClass ("glyphicon-stop");
		play.addClass ("glyphicon-play");
		playing = 0;
		clearTimeout (timeout);
	}
}

function get_color (d)
{
	return	d > 7 ? '#800026' :
			d > 6 ? '#BD0026' :
			d > 5 ? '#E31A1C' :
			d > 4 ? '#FC4E2A' :
			d > 3 ? '#FD8D3C' :
			d > 2 ? '#FEB24C' :
			d > 1 ? '#FED976' :
					'#FFEDA0';
}

function map_create_info ()
{
	info = L.control({ position: 'bottomright' });

	info.onAdd = function (map) {
		// create a div with a class "info"
		this._div = L.DomUtil.create ('div', 'info');
		this.update ("0000-00-00", "00:00:00");
		return this._div;
	};

	info.update  = function (date, time)
	{
		this._div.innerHTML = '<h4>'+ date +' '+ time +'</h4>';
	}

	info.addTo (map);
}

function map_create_legend ()
{
	var legend = L.control({position: 'bottomleft'});

	legend.onAdd = function (map)
	{
		var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 1, 2, 3, 4, 5, 6, 7],
		labels = [];

		// loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = "Magnitudo<br/>"
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML +=
				'<i style="background:' + get_color(grades[i] + 1) + '"></i> '
				+ grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}

		div.innerHTML += "<br/>"
			+'<i style="background:#996633"></i> Gunung Berapi <br/>'
			+'<i style="background:#3366FF"></i> Lempeng Tektonik <br/>';

		return div;
	};

	legend.addTo(map);
}

function map_create_slider ()
{
	slider = $("#slider");

	slider.slider (
	{
		min		: 1
	,	max		: eqd.length
	,	start	: function (event, ui)
		{
			slider.start_v = ui.value;
		}
	,	stop	:function (event, ui)
		{
			if (slider.start_v > ui.value) {
				for (var i = slider.start_v; i >= ui.value; i--) {
					do_unmark (i);
				}
			} else {
				for (var i = slider.start_v; i <= ui.value; i++) {
					do_mark (i);
				}
			}
			info.update (eqd[i].date, eqd[i].time);
			cnt = ui.value;
		}
	});
}

var volcano_marker = {
	radius		: 2
,	fillColor	: "#996633"
,	color		: "#996633"
,	weight		: 1
,	opacity		: 1
,	fillOpacity	: 0.8
};

var volcano_layer = L.geoJson (null, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker (latlng, volcano_marker);
		}
	});

function map_load_volcanoes ()
{
	$.get("/journal/2016/01/Visualisasi_Gempa_Bumi_Indonesia/volcanoes.kml", function (data) {
		omnivore.kml.parse (data, null, volcano_layer).addTo (map);
	});
}

var plate_marker = {
	fillColor	: "#3366FF"
,	color		: "#3366FF"
,	weight		: 1
,	opacity		: 1
,	fillOpacity	: 0.8
};

function map_load_plate ()
{
	L.geoJson (plates, {
		style	: plate_marker
	}).addTo (map);
}

function map_load_data ()
{
	$.getJSON ("/journal/2016/01/Visualisasi_Gempa_Bumi_Indonesia/earthquake.json", function (data) {
		eqd = data;
		map_create_slider ();
	});
}

$( document ).ready (function() {
	console.log("ready ...")
	var mag_layers =
	{
		"Gunung Berapi": volcano_layer
	,	"Magnitude 0-1": mag_0
	,	"Magnitude 1-2": mag_1
	,	"Magnitude 2-3": mag_2
	,	"Magnitude 3-4": mag_3
	,	"Magnitude 4-5": mag_4
	,	"Magnitude 5-6": mag_5
	,	"Magnitude 6-7": mag_6
	,	"Magnitude 7+": mag_7
	};

	osm = L.tileLayer ('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	, {
			attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
		,	maxZoom: 18
	});

	map = L.map ('map', {
			dragging	: false
		,	layers		: [osm, mag_0, mag_1, mag_2, mag_3, mag_4, mag_5, mag_6, mag_7]
		}).setView ([-2.7993356,115.5632032], 4);

	L.control.layers (null, mag_layers).addTo (map);

	map_create_info ();
	map_create_legend ();

	map_load_volcanoes ();
	map_load_plate ();
	map_load_data ();

	// set play button
	$("#bplay").click (do_play);
});

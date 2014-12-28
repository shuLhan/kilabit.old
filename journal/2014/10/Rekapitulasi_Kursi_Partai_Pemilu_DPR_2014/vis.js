var nodes;

function init ()
{
	var graph = d3.select ("#graph");
	var svg = graph.append ("svg");
	var diagonal = d3.svg.diagonal ()
				.source (function (d)
					{
						var n = nodes[d.source - 1];
						return n;
					})
				.target (function (d)
					{
						return nodes[d.target - 1];
					});

	d3.json ("/journal/2014/10/Rekapitulasi_Kursi_Partai_Pemilu_DPR_2014/data-sigma.json", function (e, data) {
		nodes = data.nodes;
		var edges = data.edges;
		var sumr = 0;

		svg.append ("g").attr ("id", "paths");
		svg.append ("g").attr ("id", "nodes");
		svg.append ("g").attr ("id", "text");

		svg.select ("#nodes").selectAll ("circle")
			.data (nodes)
			.enter ()
			.append ("circle")
				.attr ("id", function (d)
					{
						return "node-"+ d.id;
					})
				.attr ("cx", function (d)
					{
						if (d.id >= 78) {
							sumr = sumr + (2 * d.size);
							d.x = sumr - d.size;
							return d.x;
						}

						return d.x;
					})
				.attr ("cy", function (d)
					{
						return d.y;
					})
				.attr ("r", function (d)
					{
						return d.size;
					})
				.attr ("style", function (d)
					{
						if (d.id >= 78) {
							return "fill:"+ d.color;
						}
						return "fill: #aaa;";
					})
				.attr ("class", "node")
				.on ("mouseover", mouseover)
				.on ("mouseout", mouseout);

		sumr = 0;

		svg.select ("#text").selectAll ("text")
			.data (nodes)
			.enter ()
			.append ("text")
				.attr ("x", function (d)
				{
					return d.x;
				})
				.attr ("y", function (d)
				{
					return d.y;
				})
				.attr ("class", "label")
				.text (function (d)
				{
					return d.label;
				});

		svg.select ("#paths").selectAll ("path")
			.data (edges)
			.enter ().append ("path")
				.attr ("stroke", function (d)
					{
						return nodes[d.target - 1].color;
					})
				.attr ("stroke-width", function (d)
					{
						return d.size * 2;
					})
				.attr ("class", function (d)
					{
						return "path source-"+ d.source +" target-"+ d.target;
					})
				.attr ("source", function (d)
					{
						return d.source;
					})
				.attr ("target", function (d)
					{
						return d.target;
					})
				.attr ("d", diagonal);

	//				var d = {
	//						"id":81
	//					};
	//				mouseover (d);
	});
}

function mouseover (d)
{
	d3.selectAll (".path").classed ("hide-path", true);

	if (d.id < 78) {
		d3.selectAll ("#paths .path.source-"+ d.id).classed ("hide-path", false)
		d3.selectAll ("#paths .path.source-"+ d.id).classed ("selected", true)
			.each (update_nodes (true));
	} else {
		d3.selectAll ("#paths .path.target-"+ d.id).classed ("hide-path", false)
		d3.selectAll ("#paths .path.target-"+ d.id).classed ("selected", true)
			.each (update_nodes (true));
	}
}

function mouseout (d)
{
	d3.selectAll (".path").classed ("hide-path", false);

	if (d.id < 78) {
		d3.selectAll ("#paths .path.source-"+ d.id).classed ("selected", false)
			.each (update_nodes (false));
	} else {
		d3.selectAll ("#paths .path.target-"+ d.id).classed ("selected", false)
			.each (update_nodes (false));
	}
}

function update_nodes (highlight)
{
	return function (d)
	{
		d3.select ("#node-"+ d.source).classed ("node-selected", highlight);
		d3.select ("#node-"+ d.target).classed ("node-selected", highlight);
	}
}

init ();

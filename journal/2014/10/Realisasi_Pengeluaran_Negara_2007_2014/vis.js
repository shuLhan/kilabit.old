var tm = new $jit.TM.Squarified ({
		injectInto: 'treemap'
	,	levelsToShow:3
	,	titleHeight: 20
	,	animate: true
	,	offset: 1
	,	Events: {
			enable: true
		,	onClick: function(node)
			{
				if(node) tm.enter(node);
			}
		,	onRightClick: function()
			{
				tm.out();
			}
		}
	,	duration: 1000
	,	Tips: {
			enable: true
			//add positioning offsets
		,	offsetX: 20
		,	offsetY: 20
			//implement the onShow method to
			//add content to the tooltip when a node
			//is hovered
		,	onShow: function(tip, node, isLeaf, domElement)
			{
				var html = "<div class='tip'>" + node.name;
				var data = node.data;

				if(data["$area"]) {
					html += "<br/> Pengeluaran : " + data["$area"];
				}
				html += "</div>";
				tip.innerHTML =	html; 
			}	
		}
		//Add the name of the node in the correponding label
		//This method is called once, on label creation.
	,	onCreateLabel: function(domElement, node)
		{
			domElement.innerHTML = node.name;
			var style = domElement.style;
			style.border = '1px solid transparent';
			domElement.onmouseover = function() {
				style.border = '1px solid #9FD4FF';
			};
			domElement.onmouseout = function() {
				style.border = '1px solid transparent';
			};
		}
	});

	tm.loadJSON(data);
	tm.refresh();


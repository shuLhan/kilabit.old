<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
	session_start ();

	// if you session is not exist redirect back to login.
	if (null === $_SESSION["you"]) {
		$host = $_SERVER['HTTP_HOST'];
		$uri = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
		$extra	= "index.php";

		header ("Location: http://$host$uri/$extra");
		exit;
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="/css/bootstrap.min.css"/>
	<!-- summernote -->
	<link rel="stylesheet" href="/css/font-awesome.min.css"/>
	<link rel="stylesheet" href="/css/summernote.css"/>
	<link rel="shortcut icon" href="favicon.ico"/>
	<title>Manage Wui!</title>
</head>
<body>
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-3">
				<div class="btn-group">
					<button
						type="button"
						class="btn btn-warning"
					>
						<span class="glyphicon glyphicon-minus"></span>
					</button>
					<button
						type="button"
						class="btn btn-default"
					>
						<span class="glyphicon glyphicon-plus"></span>
						New Journal
					</button>
				</div>
				<div id="tree">
				</div>
			</div>
			<div class="col-md-9">
				<!-- journal editor begin -->
				<form
					id="editor_form"
					class="form-horizontal"
					role="form"
					action="journal.php"
					method="post"
				>
				<div class="form-group">
						<label for="e_node_name" class="col-sm-2 control-label">Node name</label>
						<div class="col-sm-10">
							<input
								name="e_node_name"
								type="text"
								class="form-control"
								id="e_node_name"
								placeholder="Node name"
								required
							>
						</div>
					</div>
					<div class="form-group">
						<label for="e_title" class="col-sm-2 control-label">Title</label>
						<div class="col-sm-10">
							<input
								name="e_title"
								type="text"
								class="form-control"
								id="e_title"
								placeholder="Title"
								required
							>
						</div>
					</div>
					<div class="form-group">
						<label for="e_publish-date" class="col-sm-2 control-label">Publish date</label>
						<div class="col-sm-10">
							<input
								name="e_publish-date"
								type="date"
								class="form-control"
								id="e_publish-date"
								placeholder="Publish date"
								required
							>
						</div>
					</div>
					<div class="form-group">
						<label for="e_author" class="col-sm-2 control-label">Author</label>
						<div class="col-sm-10">
							<input
								name="e_author"
								type="text"
								class="form-control"
								id="e_author"
								placeholder="Author"
							>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12">
							<textarea
								name="e_content"
								id="e_content"
								class="input-block-level"
							>
							</textarea>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12">
							<div class="btn-group">
								<button type="submit" class="btn btn-primary">
								Save
								</button>
							</div>
						</div>
					</div>
				</form>
				<!-- journal editor end -->
				<!-- node editor begin -->
				<form
					id="node_form"
					class="form-horizontal hidden"
					role="form"
					action="node.php"
					method="post"
				>
					<div class="form-group">
						<label
							for="node_parent"
							class="col-sm-2 control-label"
						>Parent Node
						</label>
						<div class="col-sm-10">
							<select
								name="node_parent"
								class="form-control"
								id="node_parent"
								placeholder="Parent node"
								required
								disabled
							>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label
							for="node_name"
							class="col-sm-2 control-label"
						>Node name
						</label>
						<div class="col-sm-10">
							<input
								name="node_name"
								type="text"
								class="form-control"
								id="node_name"
								placeholder="Node name"
								required
							>
						</div>
					</div>
					<div class="form-group">
						<label
							for="node_title"
							class="col-sm-2 control-label"
						>Title
						</label>
						<div class="col-sm-10">
							<input
								name="node_title"
								type="text"
								class="form-control"
								id="node_title"
								placeholder="Node title"
								required
							>
						</div>
					</div>
					<div class="form-group center-block">
						<div class="col-sm-12">
							<div class="btn-group">
								<button
									type="submit"
									class="btn btn-primary"
									id="node_form_submit"
								>Save
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
			<!-- node editor end -->
		</div>
	</div>
	<script src="/js/wui_menu.js"></script>
	<script src="/js/jquery.min.js"></script>
	<script src="/js/bootstrap.min.js"></script>
	<script src="/js/bootstrap-treeview.min.js"></script>
	<script src="/js/summernote.min.js"></script>
	<script>
		function replace_properties (nodes, old_key, new_key, child_key)
		{
			for (var i = 0; i < nodes.length; i++) {
				var n = nodes[i];

				if (undefined !== n[child_key]
				&&  n[child_key].length > 0) {
					replace_properties (nodes[i][child_key], old_key, new_key, child_key);
				} else {
					delete nodes[i][child_key];
				}

				if (undefined !== n[old_key]) {
					nodes[i][new_key] = nodes[i][old_key];
					delete nodes[i][old_key];
				}
			}
		}

		function init_node_parent_selection (c, nodes, child_key, tabs)
		{
			for (var i = 0; i < nodes.length; i++) {
				var n = nodes[i];

				if (n.load === false) {
					c.append ("<option>"+ n.id +"</option>");
				}
				if (undefined !== n[child_key]
				&&  n[child_key].length > 0) {
					init_node_parent_selection (c, nodes[i][child_key], child_key, tabs + 1);
				}
			}
		}

		function form_edit_node (node)
		{
			$("#editor_form").addClass ("hidden");
			$("#node_form").removeClass ("hidden");

			var ids = node.id.split ("-");

			$("input#node_name").val (ids[ids.length - 1]);
			$("input#node_title").val (node.text);
			$("#node_parent").val (node.pid);
		}

		function form_edit_content (node)
		{
			$("#editor_form").removeClass ("hidden");
			$("#node_form").addClass ("hidden");

			var link = node.link;
			var editor = $("#e_content");

			editor.empty ();

			editor.load (link, function (res, stat, xhr)
				{
					// fix image source
					link = link.replace (/^\.\//, "/");
					link = link.replace (/^\/\//, "/");
					link = link.replace ("/index.html", "");

					editor.find ("img").each (function (i)
					{
						var src = $(this).attr ("src");
						src = src.replace (/^\.\//, "");
						$(this).attr ("src", link +"/../"+ src);
					});

					var $xml = $( $.parseXML (res) );

					// set field node name
					var ids = node.id.split ("-");
					$("input#e_node_name").val (ids[ids.length - 1]);

					// set field based on meta data					
					$xml.find ("html > head > meta").each (function () {
							var m_name = $(this).attr ("name");
							var m_content = $(this).attr ("content");

							$("#e_"+ m_name).val (m_content);
						});

					var body = $xml.find ("body").html ().trim ();

					console.log (body);

					editor.code (body);
					editor.empty ();
				});
		}

		$( document ).ready (function() {
			// replace title with text
			replace_properties (wui_menu, "submenu", "nodes", "submenu");
			replace_properties (wui_menu, "title", "text", "nodes");

			var node_parent = $("#node_parent");
			node_parent.append ("<option></option>");

			init_node_parent_selection (node_parent, wui_menu, "nodes", 0)

			$("#tree").treeview ({
				data			: wui_menu
			,	onNodeSelected	: function (event, node)
				{
					if (! node.load) {
						form_edit_node (node);
					} else {
						form_edit_content (node);
					}
				}
			});

			$("#e_content").summernote ({
					height		:300
				,	minHeight	:300
				,	maxHeight	:null
				});

			$("#node_form").on("submit", function (event) {
				var $form = $(this);

				$("#node_parent").removeAttr ("disabled");

				$.ajax({
					type	: $form.attr('method')
				,	url		: $form.attr('action')
				,	data	: $form.serialize()
				,	success	: function (data, status) {
						$("#node_parent").prop ("disabled", true);
						alert ("Data has been saved");
					}
				});

				event.preventDefault();
			});
		});
	</script>
</body>
</html>
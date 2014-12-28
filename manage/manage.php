<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
	session_start ();

	// if you session is not exist redirect back to login.
	if (! isset ($_SESSION["you"])) {
		$host = $_SERVER["HTTP_HOST"];
		$uri = rtrim(dirname($_SERVER["PHP_SELF"]), "/\\");
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
	<link rel="stylesheet" href="/manage/manage.css"/>
	<link rel="shortcut icon" href="favicon.ico"/>
	<title>Manage Wui!</title>
</head>
<body>
	<div class="container-fluid">
		<div class="row" id="content">
			<!--{{{ tree -->
			<div class="col-sm-3">
				<div class="btn-group-sm">
					<button
						type="button"
						class="btn btn-warning"
					>
						<span class="glyphicon glyphicon-minus"></span>
					</button>
					<button
						id="btn_new_node"
						type="button"
						class="btn btn-default"
					>
						<span class="glyphicon glyphicon-plus"></span>
						New Node
					</button>
					<button
						id="btn_new_journal"
						type="button"
						class="btn btn-default"
					>
						<span class="glyphicon glyphicon-plus"></span>
						New Journal
					</button>
				</div>

				<!-- tree view -->
				<div class="tree panel panel-default">
					<div class="panel-heading">
					Node Tree
					</div>
					<div id="tree" class="panel-body">
					</div>
				</div>
			</div>
			<!--}}}-->
			<!--{{{ form content editor -->
			<div class="col-sm-9">
				<form
					id="editor_form"
					class=""
					role="form"
					action="content.php"
					method="post"
				>
					<div class="form-group">
						<label for="node_parent" class="col-sm-2 control-label">Parent node</label>
						<div class="col-sm-4">
							<select
								name="e_node_parent"
								type="text"
								class="form-control input-sm"
								id="e_node_parent"
								placeholder="Node name"
							></select>
						</div>

						<label for="e_publish_date" class="col-sm-2 control-label">Publish date</label>
						<div class="col-sm-4">
							<input
								name="e_publish_date"
								type="date"
								class="form-control input-sm"
								id="e_publish_date"
								placeholder="Year.Month.Day *"
								required
							>
						</div>
					</div>
					<div class="form-group">
						<label for="e_node_name" class="col-sm-2 control-label">Node name</label>
						<div class="col-sm-4">
							<input
								name="e_node_name"
								type="text"
								class="form-control input-sm"
								id="e_node_name"
								placeholder="Directory name in file system"
							>
						</div>

						<label for="e_publish_time" class="col-sm-2 control-label">Publish Time</label>
						<div class="col-sm-4">
							<input
								name="e_publish_time"
								type="text"
								class="form-control input-sm"
								id="e_publish_time"
								placeholder="Hour:Minute:Second"
							>
						</div>
					</div>
					<div class="form-group">
						<label for="e_title" class="col-sm-2 control-label">Title</label>
						<div class="col-sm-4">
							<input
								name="e_title"
								type="text"
								class="form-control input-sm"
								id="e_title"
								placeholder="* Awesome Title *"
								required
							>
						</div>

						<label for="e_author" class="control-label hidden">Author</label>
						<div class="">
							<input
								name="e_author"
								type="text"
								class="form-control input-sm hidden"
								id="e_author"
								placeholder="you@domain.com"
								value="<?=$_SESSION['email'] ?>"
							>
						</div>

						<div class="col-sm-offset-2 col-sm-4">
							<label class="checkbox-inline input-sm">
								<input
									name="e_comment"
									type="checkbox"
									id="e_comment"
								/>Allow comment
							</label>
						</div>
					</div>

					<div class="form-group">
						<div class="col-sm-12 padding-top">
							<textarea
								name="e_content"
								id="e_content"
								class="input-block-level"
							>
							</textarea>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-12 padding-top">
							<button type="submit" class="btn btn-primary"> Save </button>
							<button type="button" class="btn btn-primary" id="node_form_preview"> Preview </button>
						</div>
					</div>
				</form>
				<!--}}} journal editor end -->
				<!--{{{ form node editor -->
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
						<div class="col-sm-4">
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
						<div class="col-sm-4">
							<input
								name="node_name"
								type="text"
								class="form-control"
								id="node_name"
								placeholder="Directory name in file system"
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
						<div class="col-sm-4">
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
								<button type="submit" class="btn btn-primary" id="node_form_submit"> Save </button>
							</div>
						</div>
					</div>
				</form>
			</div>
			<!--}}} node editor end -->
		</div>
	</div>
	<!--{{{ js -->
	<script src="/js/wui_menu.js"></script>
	<script src="/js/jquery.min.js"></script>
	<script src="/js/bootstrap.min.js"></script>
	<script src="/js/bootstrap-treeview.min.js"></script>
	<script src="/js/bootbox.min.js"></script>
	<script src="/js/ckeditor/ckeditor.js"></script>
	<!--}}} -->
	<script>
		var author = '<?= $_SESSION["email"] ?>';

		//{{{ replace node key name.
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
		//}}}
		//{{{
		function init_node_parent_selection (nodes, child_key, tabs)
		{
			var np_node = $("#node_parent");
			var np_editor = $("#e_node_parent");

			for (var i = 0; i < nodes.length; i++) {
				var n = nodes[i];

				if (n.load === false) {
					np_node.append ("<option>"+ n.id +"</option>");
					np_editor.append ("<option>"+ n.id +"</option>");
				}
				if (undefined !== n[child_key]
				&&  n[child_key].length > 0) {
					init_node_parent_selection (nodes[i][child_key], child_key, tabs + 1);
				}
			}
		}
		//}}}
		//{{{ form edit node -> show
		function form_edit_node (node)
		{
			$("#editor_form").addClass ("hidden");
			$("#node_form").removeClass ("hidden");

			var ids = node.id.split ("-");

			$("#node_form #node_parent").attr ("disabled");
			$("input#node_name").val (ids[ids.length - 1]);
			$("input#node_title").val (node.text);
			$("#node_parent").val (node.pid);
		}
		//}}}
		//{{{ form edit node -> reset
		function form_edit_node_reset ()
		{
			$("#editor_form").addClass ("hidden");
			$("#node_form").removeClass ("hidden");

			$("#node_form #node_parent").removeAttr ("disabled");

			$("#node_parent").val ("-");
			$("input#node_name").val ("");
			$("input#node_title").val ("");
		}
		//}}}
		//{{{ form edit node -> submit
		function form_edit_node_submit (event)
		{
			var $form = $(this);

			$("#node_parent").removeAttr ("disabled");

			$.ajax ({
					type	: $form.attr ("method")
				,	url		: $form.attr ("action")
				,	data	: $form.serialize ()
				,	success	: function (data, status)
					{
						$("#node_parent").prop ("disabled", true);
						bootbox.alert ("Data has been saved");
					}
				});

			event.preventDefault();
		}
		//}}}
		//{{{ get current date in yyyy.mm.dd format.
		function get_current_date ()
		{
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10){dd='0'+dd}
			if(mm<10){mm='0'+mm}
			today = yyyy+"."+mm+"."+dd;

			return today;
		}
		//}}}
		//{{{ get current time in hh:mm:ss format.
		function get_current_time ()
		{
			var t = new Date ();
			var h = t.getHours ();
			var m = t.getMinutes ();
			var s = t.getSeconds ();

			if (h < 10) { h = '0' + h; }
			if (m < 10) { m = '0' + m; }
			if (s < 10) { s = '0' + s; }

			return h +":"+ m +":"+ s;
		}
		//}}}
		//{{{ form edit content -> reset
		function form_edit_content_reset ()
		{
			$("#editor_form").removeClass ("hidden");
			$("#node_form").addClass ("hidden");

			$("#e_node_parent").removeAttr ("disabled");

			$("#e_node_parent").val ("");
			$("#e_node_name").val ("");
			$("#e_title").val ("");
			$("#e_publish_date").val (get_current_date ());
			$("#e_publish_time").val (get_current_time ());
			$("#e_author").val (author);
			$("#e_comment").val ("off");
			CKEDITOR.instances.e_content.setData ("");
		}
		//}}}
		//{{{ form edit content -> show
		function form_edit_content (node)
		{
			$("#editor_form").removeClass ("hidden");
			$("#node_form").addClass ("hidden");

			var link = node.link +"?_dc="+ new Date ().getTime ();
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

					var doc = document.implementation.createHTMLDocument("content_edit");
					doc.documentElement.innerHTML = res;

					// set field node name
					var ids = node.id.split ("-");
					$("input#e_node_name").val (ids[ids.length - 1]);
					$("#e_node_parent").val (node.pid);

					// set field based on meta data
					$(doc).find ("html > head > meta").each (function () {
							var m_name = $(this).attr ("name");
							var m_content = $(this).attr ("content");

							if (m_name === "publish_date") {
								var dt = m_content.split (" ");

								$("#e_publish_date").val (dt[0]);
								$("#e_publish_time").val (dt[1]);
							} else {
								$("#e_"+ m_name).val (m_content);
							}
						});

					$("#e_comment").prop ("checked", node.comment);

					var body = $(doc).find ("body");

					CKEDITOR.instances.e_content.setData (body.html ());
				});
		}
		//}}}
		//{{{ form edit content -> submit
		function form_edit_content_submit (event)
		{
			var $form	= $(this);
			var data	= {};

			data.e_node_parent	= $form.find ("#e_node_parent").val ();
			data.e_node_name	= $form.find ("#e_node_name").val ();
			data.e_title		= $form.find ("#e_title").val ();
			data.e_publish_date = $form.find ("#e_publish_date").val ();
			data.e_publish_time = $form.find ("#e_publish_time").val ();
			data.e_author		= $form.find ("#e_author").val ();
			data.e_comment		= $form.find ("#e_comment").prop ("checked");
			data.e_content		= CKEDITOR.instances.e_content.getData ();

			$.ajax ({
					type	: $form.attr ("method")
				,	url		: $form.attr ("action")
				,	data	: data
				,	dataType: "json"
				,	success	: function (data, status)
					{
						$("#e_node_parent").prop ("disabled", true);
						bootbox.alert (data.msg);
					}
				,	error	: function (xhr, status, errorThrown)
					{
						bootbox.alert (xhr);
					}
				});

			event.preventDefault();
		}
		//}}}
		//{{{ form edit content -> preview
		function form_edit_content_preview (event)
		{
			bootbox.alert (CKEDITOR.instances.e_content.getData ());
		}
		//}}}
		//{{{ document ready (main)
		$( document ).ready (function() {
			// replace title with text
			replace_properties (wui_menu, "submenu", "nodes", "submenu");
			replace_properties (wui_menu, "title", "text", "nodes");

			var np_node = $("#node_parent");
			var np_editor = $("#e_node_parent");

			np_node.append ("<option></option>");
			np_node.append ("<option>-</option>");
			np_editor.append ("<option></option>");
			np_editor.append ("<option>-</option>");

			init_node_parent_selection (wui_menu, "nodes", 0);

			$("#btn_new_node").click (function () {
					form_edit_node_reset ();
				});

			$("#btn_new_journal").click (function () {
					form_edit_content_reset ();
				});

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

			CKEDITOR.replace ("e_content",
			{
				height			:"350px"
			,	extraPlugins	: "base64image,image2"
			});

			$("#node_form").on ("submit", form_edit_node_submit);
			$("#editor_form").on ("submit", form_edit_content_submit);
			$("#node_form_preview").on ("click", form_edit_content_preview);
		});
		//}}}
	</script>
</body>
</html>

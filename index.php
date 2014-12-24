<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
	define ("APP_PATH", realpath (dirname (__FILE__)));

	require_once "config.php";

	$open = null;

	if (isset ($_GET["open"])) {
		$open = str_replace ("/index.html", "", $_GET["open"]);
		$open = rtrim ($open, "/");
	}

	if (null == $open) {
		$link = $wui["homepage"];
	} else {
		$link = $open;
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="/css/bootstrap.min.css"/>
	<link rel="stylesheet" href="/css/wui.css"/>
	<link rel="shortcut icon" href="favicon.ico"/>
	<title></title>
</head>

<body>
	<div class="container">
		<!--{{{ HEADER -->
		<div class="row">
			<div id="wui_header" class="col-sm-12">
				<div class="row">
					<div id="wui_header_left" class="col-sm-6 text-left">
						<div id="wui_title"></div>
						<div id="wui_subtitle"></div>
					</div>
					<div id="wui_header_right" class="col-sm-6 text-right">
						<div id="wui_social_icon">
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--}}} -->
		<div class="row">
			<div id="wui_menu" class="col-sm-12">
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12">
				<div id="wui_content">
				</div>

				<!--{{{META-->
				<div class="panel panel-default">
					<div class="panel-heading"> Meta </div>
					<table id="wui_content_meta" class="table table-condensed">
					</table>
				</div>
				<!--}}}-->
				<!--{{{ COMMENT-->
				<div id="wui_comment_panel" class="panel panel-default">
					<div class="panel-heading"> Comments </div>
					<div class="panel-body">
						<div id="comments"></div>

						<form id="wui_comment_form" class="form-horizontal"
							role="form"
							action="/comment.php"
							method="POST"
						>
							<div class="form-group hidden">
								<label for="c_link"
									class="col-sm-2 control-label input-sm"
								>
									Link
								</label>
								<div class="col-sm-10">
									<input name="c_link" type="text"
										id="c_link"
										class="form-control input-sm"
									/>
								</div>
							</div>

							<div class="form-group">
								<div class="col-sm-12">
									<label for="c_content"
									>
										Add new comment
									</label>
									<textarea name="c_content" id="c_content"
										class="input-block-level form-control"
									></textarea>
								</div>
							</div>

							<div class="form-group">
								<div class="col-sm-12">
									<div class="btn-group">
										<button type="submit"
											class="btn btn-default"
											id="comment_submit"
										>
										Submit
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
				<!--}}}-->
			</div>
		</div>
		<!--{{{ FOOTER -->
		<div class="row">
			<div class="col-sm-12">
				<div class="row">
					<div id="wui_footer">
						<div id="wui_footer_left" class="col-sm-6 text-left">
						</div>
						<div id="wui_footer_right" class="col-sm-6 text-right">
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-12">
						<strong>Other sites</strong>
						<ul>
							<li><a	href="http://mup.kilabit.info"
									target="_blank">
								Makanan untuk Pikiran
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<!--}}}-->
	</div>

	<script src="/js/jquery.min.js"></script>
	<script src="/js/bootstrap.min.js"></script>
	<script src="/js/wui_menu.js"></script>
	<script src="/js/wui.js"></script>
	<script>
		$( document ).ready (function() {
			WUI.homepage = "<?= $link ?>";

			$("#wui_comment_form").on ("submit", WUI.wui_comment_on_submit);

			WUI.run ();
		});
	</script>
</body>
</html>

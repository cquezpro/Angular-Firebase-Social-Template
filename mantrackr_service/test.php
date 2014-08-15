<?php
	$env = json_decode(file_get_contents("/home/dotcloud/environment.json"), true);

	print_r($env);

?>

<?php
/**
 * @author     Chanaka Mannapperuma <irusri@gmail.com>
 * @date	   2013-08-20
 * @version    Beta 1.0
 * @usage      Expression viewer
 * @licence    GNU GENERAL PUBLIC LICENSE
 * @link       http://irusri.com
 */
header('Cache-Control: no-cache');
header('Pragma: no-cache');
/**unit test following ids**/
$id = trim($_GET['id']);
$view=trim($_GET['view']);
$mode=trim($_GET['mode']);

$get_exptable=trim($_GET['exptable']);
$get_modecontrols=trim($_GET['modecontrols']);
$get_viewcontrols=trim($_GET['viewcontrols']);
$get_genelist=trim($_GET['genelist']);
$get_allcontrols=trim($_GET['allcontrols']);
$get_download=trim($_GET['download']);
$get_zoom=trim($_GET['zoom']);
$get_exlink=trim($_GET['exlink']);
$get_from=trim($_GET['from']);

?>
<head>
<link href="css/pop.css" rel="stylesheet">
<script src="js/utilities.js"></script>
<script src="js/elements.js"></script>
<script src="js/init.js"></script>
<script>
//Variables from remote $_GET
	var get_id = <?php echo json_encode($id);?>;
	var get_mode = <?php echo json_encode($mode); ?>;
	var get_view = <?php echo json_encode($view); ?>;
	
	var get_exptable = <?php echo json_encode($get_exptable); ?>;
	var get_modecontrols = <?php echo json_encode($get_modecontrols); ?>;
	var get_viewcontrols = <?php echo json_encode($get_viewcontrols); ?>;
	var get_genelist = <?php echo json_encode($get_genelist); ?>;
	var get_allcontrols = <?php echo json_encode($get_allcontrols); ?>;
	var get_download= <?php echo json_encode($get_download); ?>;
	var get_zoom= <?php echo json_encode($get_zoom); ?>;
	var get_exlink= <?php echo json_encode($get_exlink); ?>;
	var get_from = <?php echo json_encode($get_from); ?>;
?>

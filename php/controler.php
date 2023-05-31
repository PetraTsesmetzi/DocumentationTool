<?php
include './config.php';
include './classes/DB.php';
include './classes/SubChapter.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';


$articleId = $_POST['id'];

$subchapter = new Subchapter();
$subchapterById = $subchapter->getObjectById($articleId);
echo json_encode($subchapterById);









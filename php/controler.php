<?php
include './config.php';
include './classes/DB.php';
include './classes/SubChapter.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';

//echo $_POST['id'];
$articleId=$_POST['id'];


//$article=new Article();
//$artikelById=$article->getObjectById($articleId);
//echo json_encode($artikelById);

$subchapter=new Subchapter();
$subchapterById=$subchapter->getObjectById($articleId);
echo json_encode($subchapterById);

//$articleAll=$article->getAllAsObjects();
//echo json_encode($artikelById);
//echo json_encode($articleAll->getJSONEncode());



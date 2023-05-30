<?php
include './config.php';
include './classes/DB.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';

//echo $_POST['id'];
$articleId=$_POST['id'];
$article=new Article();
$artikelById=$article->getObjectById($articleId);
//$articleAll=$article->getAllAsObjects();
echo json_encode($artikelById->getJSONEncode());
//echo json_encode($articleAll->getJSONEncode());



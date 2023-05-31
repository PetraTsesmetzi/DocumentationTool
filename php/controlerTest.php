<?php
include './config.php';
include './classes/DB.php';
include './classes/SubChapter.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';

//echo $_POST['id'];
//$articleId=$_POST['id'];

//$article=new Article();
//$artikelById=$article->getObjectById($articleId);
//echo json_encode($artikelById);
try{
    $subchapter=new Subchapter();
    $subchapterById=$subchapter->getObjectById(1);
    echo json_encode($subchapterById);
//    echo "<pre>";
//    print_r($subchapterById);
//    echo "</pre>";

}catch(PDOException $e){
    echo ($e);
}








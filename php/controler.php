<?php
include './config.php';
include './classes/DB.php';
include './classes/SubChapter.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';


$articleId = $_POST['id'] ?? '';
$action = $_POST['action'];

switch ($action) {
    case 'loadArticles':
        $subchapter = new Subchapter();
        $subchapterById = $subchapter->getObjectById($articleId);
        echo json_encode($subchapterById);
        break;
    case 'createArticle':
        $subChapterTitel = $_POST['subChapterTitel'];
        $subChapterNr = $_POST['subChapterNr'];
        $articleTitel = $_POST['articleTitel'];
//        echo $articleTitel;
        $articleNr = $_POST['articleNr'];
        $descriptionsArr = $_POST['descriptionsArr'];
        $codeArr = $_POST['codeArr'];
        $article = new Article();
        $articleId=$article->createNewObject($articleNr,1,$articleTitel);
        echo $articleId;



}









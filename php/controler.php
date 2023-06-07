<?php
include './config.php';
include './classes/DB.php';
include './classes/SubChapter.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';



$action = $_POST['action'];
//$action='loadArticleNumbers';
switch ($action) {
    case 'loadArticles':
        $articles=(new Article())->getAllAsObjects();
        echo json_encode($articles);
        break;
    case 'loadElements':
        $subchapters = (new Subchapter())->getAllAsObjects();
        echo json_encode($subchapters);
        break;
    case 'loadArticlesById':
        $articleId = $_POST['id'] ?? '';
        $subchapterById = (new Subchapter())->getObjectById($articleId);
        echo json_encode($subchapterById);
        break;
    case 'createArticle':
        $subChapterTitel = $_POST['subChapterTitel'];
        $articleTitel = $_POST['articleTitel'];
        $articleNr = $_POST['articleNr'];
        $descriptionsArr = json_decode($_POST['descriptionsArr']);
        $codeArr = json_decode($_POST['codeArr']);
        $subChapterId=(new SubChapter())->getSubChapterId($subChapterTitel);
        $articleId=(new Article())->createNewObject($subChapterId,$articleTitel,$articleNr);
        (new Description())->createNewObject($articleId,$descriptionsArr);
        (new Code())->createNewObject($articleId,$codeArr);
        echo json_encode('neuer artikel wurde erstellt');;
        break;
    case 'deleteArticle':
        $id = $_POST['id'];
        (new Article())->deleteArticle($id);
        break;
    case 'loadArticleNumbers':
        $id = (int)$_POST['id'];
        $subchapters = (new Subchapter())->getAllAsObjects($id);
        echo json_encode($subchapters);
        break;

}









<?php
include './config.php';
include './classes/DB.php';
include './classes/SubChapter.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';



$action = $_POST['action'];

switch ($action) {
    case 'loadElements':
//        $subchapterById = (new Subchapter())->getObjectById(1);
//        echo json_encode($subchapterById);
        $subchapters = (new Subchapter())->getAllAsObjects();
        echo json_encode($subchapters);
//        echo "<pre>";
//        print_r($subchapters);
//        echo "</pre>"; ;
        break;
    case 'loadArticles':
        $articleId = $_POST['id'] ?? '';
        $subchapterById = (new Subchapter())->getObjectById($articleId);
        echo json_encode($subchapterById);
        break;
    case 'createArticle':
        $subChapterTitel = $_POST['subChapterTitel'];
        $subChapterNr = $_POST['subChapterNr'];
        $articleTitel = $_POST['articleTitel'];
        $articleNr = $_POST['articleNr'];
        $descriptionsArr = json_decode($_POST['descriptionsArr']);
        $codeArr = json_decode($_POST['codeArr']);
        echo "<pre>";
        print_r($codeArr);
        echo "</pre>";

        $articleId=(new Article())->createNewObject($articleNr,1,$articleTitel);
        (new Description())->createNewObject($articleId,$descriptionsArr);
        (new Code())->createNewObject($articleId,$codeArr);


}









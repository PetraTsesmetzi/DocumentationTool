<?php
include './config.php';
include './classes/DB.php';
include './classes/SubChapter.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';


$action = $_POST['action'];
//$action='loadArticleNumbers';
try {

    switch ($action) {
        case 'loadArticles':
            $articles = (new Article())->getAllAsObjects();
            echo json_encode($articles);
            break;
        case'loadArticleById':
            $articleId = (int)$_POST['id'] ?? '';
            $article = (new Article())->getObjectById($articleId);
            echo json_encode($article);
            break;
        case 'loadElements':
            $subchapters = (new Subchapter())->getAllAsObjects();
            echo json_encode($subchapters);
            break;
        case 'loadSubchapterById':
            $articleId = (int)$_POST['id'] ?? '';
            $subchapterById = (new Subchapter())->getObjectById($articleId);
            echo json_encode($subchapterById);
            break;
        case 'createArticle':
            $subChapterTitel = $_POST['subChapterTitel'];
            $articleTitel = $_POST['articleTitel'];
            $articleNr = (int)$_POST['articleNr'];
            $descriptionsArr = json_decode($_POST['descriptionsArr']);
            $codeArr = json_decode($_POST['codeArr']);
            $subChapterId = (new SubChapter())->getSubChapterId($subChapterTitel);
            $articleId = (new Article())->createNewObject($subChapterId, $articleTitel, $articleNr);
            (new Description())->createNewObject($articleId, $descriptionsArr);
            (new Code())->createNewObject($articleId, $codeArr);
            echo json_encode('neuer artikel wurde erstellt');
            break;
        case 'deleteArticle':
            $id = $_POST['id'];
            (new Article())->deleteObject($id);
            echo json_encode('neuer artikel wurde erstellt');
            break;
        case 'loadArticleNumbers':
            $id = (int)$_POST['id'];
            $subchapters = (new Subchapter())->getAllAsObjects($id);
            echo json_encode($subchapters);
            break;
        case'updateArticle';
            $id=(int)$_POST['articleId'];
            $articleNr = (int)$_POST['articleNr'];
            $subchapter_Id = (int)$_POST['subchapterId'];
            $articleTitel = $_POST['articleTitel'];
            $descriptionsArr = json_decode($_POST['descriptionsArr']);
            $codeArr = json_decode($_POST['codeArr']);
            $echoFile='echoFile.txt';
            $message=file_get_contents($echoFile);
            $message="id: ".$id."\n"."articleNr: ".$articleNr."\n".'$subchapter_Id'.$subchapter_Id."\n".'$articleTitel:'.$articleTitel."\n";
            file_put_contents($echoFile,$message);

            (new Article())->deleteObject($id);
            $articleId = (new Article())->createNewObject($subchapter_Id, $articleTitel, $articleNr);
            (new Description())->createNewObject($articleId, $descriptionsArr);
            (new Code())->createNewObject($articleId, $codeArr);

            //            (new Article($id,$articleNumber, $subchapter_Id, $articleName))->updateObject();
            echo json_encode('artikel wurde upgedatet');
            break;

    }

}catch(Exception $e){
    $errorFile='errorFile.txt';
    $message=file_get_contents($errorFile);
    $message=$e->getMessage()."\n";
    file_put_contents($errorFile,$message);
}







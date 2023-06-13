<?php
include './config.php';
include './classes/DB.php';
include './classes/SubChapter.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';


$action = $_POST['action'];
$id = $_POST['id'] ?? '';
$subChapterTitel = $_POST['subChapterTitel'] ?? '';


$articleTitel = $_POST['articleTitel'] ?? '';
$articleNr = $_POST['articleNr'] ?? '';
$descriptionsArr = $_POST['descriptionsArr'] ?? '';
$codeArr =$_POST['codeArr'] ?? '';


$articleId=$_POST['articleId'] ?? '';
$subchapter_Id = $_POST['subchapterId'] ?? '';
$request=$_REQUEST;

$args=[$action,$id,$articleId,$subChapterTitel,$articleTitel,$articleNr,$descriptionsArr,$codeArr,$subchapter_Id];
try {

    switch ($action) {
        case 'loadArticles':
//            setVariables();
            $articles = (new Article())->getAllAsObjects();
            echo json_encode($articles);
            break;
        case'loadArticleById':
//            setVariables();
            $article = (new Article())->getObjectById((int)$id);
            echo json_encode($article);
            break;
        case 'loadElements':
//            setVariables();
            $subchapters = (new Subchapter())->getAllAsObjects();
            echo json_encode($subchapters);
            break;
        case 'loadSubchapterById':
//            setVariables();
            $subchapterById = (new Subchapter())->getObjectById((int)$id);
            echo json_encode($subchapterById);
            break;
        case 'createArticle':
            setVariables();
            $subChapterId = (new SubChapter())->getSubChapterId($subChapterTitel);
            $articleId = (new Article())->createNewObject($subChapterId, $articleTitel, $articleNr);
            (new Description())->createNewObject($articleId, json_decode($descriptionsArr));
            (new Code())->createNewObject($articleId,json_decode($codeArr));
            echo json_encode('neuer artikel wurde erstellt');
            break;
        case 'deleteArticle':
//            setVariables();
            (new Article())->deleteObject((int)$id);
            echo json_encode(' artikel wurde geloescht');
            break;
        case 'loadArticleNumbers':
//            setVariables();
            $subchapters = (new Subchapter())->getAllAsObjects((int)$id);
            echo json_encode($subchapters);
            break;
        case'updateArticle';
//          setVariables();
            (new Article())->deleteObject((int)$articleId);
            $article_Id = (new Article())->createNewObject((int)$subchapter_Id, $articleTitel, (int)$articleNr);
            (new Description())->createNewObject($article_Id, json_decode($descriptionsArr));
            (new Code())->createNewObject($article_Id, json_decode($codeArr));

            //(new Article($id,$articleNumber, $subchapter_Id, $articleName))->updateObject();
            echo json_encode('artikel wurde upgedatet');
            break;

    }


}catch(Exception $e){
    //Erstellt eine errorFile.txt mit Error Message
    $errorFile='errorFile.txt';
    $message=file_get_contents($errorFile);
    $message="Message: ".$e->getMessage()."\n"."LineNumber: ".$e->getLine()."\n";
    file_put_contents($errorFile,$message);
}

/**
 * schreibt in einem File alle $_POST Variablen die ankommen
 * @param $args
 * @return void
 */
function setVariables():void{

    $echoFile='echoFile.txt';
    $message=file_get_contents($echoFile);

    foreach ($_POST as $key => $value) {
        $message .= $key . " : " . $value . "\n";
    }

    $message .= "\n". "\n";
    file_put_contents($echoFile,$message);
}





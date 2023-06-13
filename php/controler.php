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

$args=[$action,$id,$subChapterTitel,$articleTitel,$articleNr,$descriptionsArr,$codeArr,$articleId,$subchapter_Id];

try {

    switch ($action) {
        case 'loadArticles':
            setVariables($args);
            $articles = (new Article())->getAllAsObjects();
            echo json_encode($articles);
            break;
        case'loadArticleById':
            setVariables($args);
            $article = (new Article())->getObjectById((int)$id);
            echo json_encode($article);
            break;
        case 'loadElements':
            setVariables($args);
            $subchapters = (new Subchapter())->getAllAsObjects();
            echo json_encode($subchapters);
            break;
        case 'loadSubchapterById':
            setVariables($args);
            $subchapterById = (new Subchapter())->getObjectById((int)$id);
            echo json_encode($subchapterById);
            break;
        case 'createArticle':
            setVariables($args);
            $echoFile='echoFile.txt';
            $message=file_get_contents($echoFile);
            $message= "action: " . $args[0] . "\n"."id:". $args[1]."\n"."articleId: ".$args[2]."\n"."subChapterTitel: ".$args[3]."\n".
                "articleTitel: " . $args[4] . "\n". "articleNr: " . $args[5] . "\n".
                "descriptionsArr: " . $args[6] . "\n". "codeArr: " . $args[7] . "\n".
                "subchapter_Id: " . $args[8] . "\n";
            file_put_contents($echoFile,$message);

            $subChapterId = (new SubChapter())->getSubChapterId($subChapterTitel);
            $articleId = (new Article())->createNewObject($subChapterId, $articleTitel, $articleNr);
            (new Description())->createNewObject($articleId, json_decode($descriptionsArr));
            (new Code())->createNewObject($articleId,json_decode($codeArr));
            echo json_encode('neuer artikel wurde erstellt');
            break;
        case 'deleteArticle':
            setVariables($args);
            (new Article())->deleteObject((int)$id);
            echo json_encode('neuer artikel wurde erstellt');
            break;
        case 'loadArticleNumbers':
            setVariables($args);
            $subchapters = (new Subchapter())->getAllAsObjects((int)$id);
            echo json_encode($subchapters);
            break;
        case'updateArticle';
            setVariables($args);
            (new Article())->deleteObject((int)$articleId);
            $article_Id = (new Article())->createNewObject((int)$subchapter_Id, $articleTitel, (int)$articleNr);
            (new Description())->createNewObject($article_Id, json_decode($descriptionsArr));
            (new Code())->createNewObject($article_Id, json_decode($codeArr));

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


function setVariables($args):void{
    $echoFile='echoFile.txt';
    $message=file_get_contents($echoFile);
    $message= "action: " . $args[0] . "\n"."id:". $args[1]."\n"."articleId: ".$args[2]."\n"."subChapterTitel: ".$args[3]."\n".
        "articleTitel: " . $args[4] . "\n". "articleNr: " . $args[5] . "\n".
        "descriptionsArr: " . $args[6] . "\n". "codeArr: " . $args[7] . "\n".
         "subchapter_Id: " . $args[8] . "\n";
    file_put_contents($echoFile,$message);
}





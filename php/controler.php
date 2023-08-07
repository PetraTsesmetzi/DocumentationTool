<?php
include './config.php';
include './classes/DB.php';
include './classes/SubChapter.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';
include './classes/Chapter.php';
include './classes/Category.php';

$action = $_POST['action'];
$id = $_POST['id'] ?? '';
$subChapterTitel = $_POST['subChapterTitel'] ?? '';


$articleTitel = $_POST['articleTitel'] ?? '';
$articleNr = $_POST['articleNr'] ?? '';
$descriptionsArr = $_POST['descriptionsArr'] ?? '';
$codeArr = $_POST['codeArr'] ?? '';
$newDescObj = $_POST['newDescObj'] ?? '';
$newCodeArr = $_POST['newCodeArr'] ?? '';

$articleId = $_POST['articleId'] ?? '';
$subchapter_Id = $_POST['subchapterId'] ?? '';
$request = $_REQUEST;

$args = [$action, $id, $articleId, $subChapterTitel, $articleTitel, $articleNr, $descriptionsArr, $codeArr, $subchapter_Id];
$chapterName=$_POST['chapterName']?? '';
$categoryName=$_POST['categoryName']?? '';

try {

    switch ($action) {
        case 'loadArticles':
//            setVariables();
            $articles = (new Article())->getAllAsObjects();
            echo json_encode($articles);
            break;
        case'loadArticleById':
//            setVariables();
            $article = (new Article())->getObjectById((int)$articleId);
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
            (new Code())->createNewObject($articleId, json_decode($codeArr));
            echo json_encode('neuer artikel wurde erstellt');
            break;
        case 'deleteArticle':
//            setVariables();
            (new Article())->deleteObject((int)$id);
            echo json_encode(' artikel wurde geloescht');
            break;
        case 'deleteDescription':
//            setVariables();
            (new Description())->deleteObject((int)$id);
            echo json_encode('Description wurde geloescht');
            break;
        case 'deleteCode':
//            setVariables();
            (new Code())->deleteObject((int)$id);
            echo json_encode('Code wurde geloescht');
            break;
        case 'loadArticleNumbers':
//            setVariables();
            $subchapters = (new Subchapter())->getAllAsObjects((int)$id);
            echo json_encode($subchapters);
            break;
        case'updateArticle':
//            setVariables();

            if ($newCodeArr != '') {
                (new Code())->createNewObject($articleId, json_decode($newCodeArr));
            }
            if ($newDescObj != '') {
                (new Description())->createNewObject($articleId, json_decode($newDescObj));
            }
            (new Article($articleId, $articleNr, $subchapter_Id, $articleTitel))->updateObject();
            (new Description())->updateObject($articleId, json_decode($descriptionsArr));
            (new Code())->updateObject($articleId, json_decode($codeArr));

            echo json_encode('artikel wurde upgedatet');
            break;
        case 'loadSubChapterByChapter':
//            setVariables();
            $chapterId=(new Chapter)->getChapterId($chapterName);
            $subchapters = (new Subchapter())->getAllObjByChapterId($chapterId);
            echo json_encode($subchapters);
            break;
        case 'loadChapterByCategory':
            setVariables();
            $categoryId=(new Category())->getCategoryId($categoryName);
            $chapters = (new Chapter())->getAllObjByCategoryId($categoryId);
            echo json_encode($chapters);
            break;
        case 'loadCategory':
            setVariables();
            $category=(new Category())->getAllCategories();
            echo json_encode($category);
            break;
        case 'loadChapters':
            setVariables();
            $chapter=(new Chapter())->getAllChapters();
            echo json_encode($chapter);
            break;

    }


} catch (Exception $e) {
    //Erstellt eine errorFile.txt mit Error Message
    $errorFile = 'errorFile.txt';
    $message = file_get_contents($errorFile);
    $message = "Message: " . $e->getMessage() . "\n" . "LineNumber: " . $e->getLine() . "\n";
    file_put_contents($errorFile, $message);
}

/**
 * zum leichteren debuggen neben dem Enwicklertool vom Browser
 * schreibt in einem File alle $_POST Variablen die ankommen
 * @param $args
 * @return void
 */
function setVariables(): void
{

    $echoFile = 'echoFile.txt';
    $message = file_get_contents($echoFile);

    foreach ($_POST as $key => $value) {
        $message .= $key . " : " . $value . "\n";
    }

    $message .= "\n" . "\n";
    file_put_contents($echoFile, $message);
}





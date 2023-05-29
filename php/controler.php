<?php
include './config.php';
include './classes/DB.php';
include './classes/Article.php';
include './classes/Description.php';
include './classes/Code.php';


$meinArtikel=new Article();

echo "<pre>";
print_r($meinArtikel->getObjectById(3));
//print_r($meinArtikel->getAllAsObjects());
echo "</pre>";


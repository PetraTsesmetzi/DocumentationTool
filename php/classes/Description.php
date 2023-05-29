<?php

class Description

{

    private int $id;
    private string $descriptionText;
    private int $article_Id;

    /**
     * @param int $id
     * @param string $descriptionText
     * @param int $article_Id
     */
    public function __construct(?int $id = null, ?string $descriptionText = null, ?int $article_Id = null)
    {

        if (isset($id) && isset($descriptionText) && isset($article_Id)) {
            $this->id = $id;
            $this->descriptionText = $descriptionText;
            $this->article_Id = $article_Id;
        }
    }


    public function getAllAsObjects(Article $article = null): array|null
    {

        try {
            $dbh = DB::connect();
            if (!isset($article)) {
                $sql = "SELECT * FROM description";
                $result = $dbh->query($sql);
            } else {
                $sql = "SELECT * FROM description WHERE article_Id=:article_Id";
                $stmt = $dbh->prepare($sql);
                $id = $article->getId();
                $stmt->bindParam('article_Id', $id);
                $stmt->execute();
                $result = $stmt;

            }
            $descriptionArr = [];
            while ($description = $result->fetchObject(__CLASS__)) {
                $descriptionArr[] = $description;
            }


        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $descriptionArr;
    }


    public function getObjectById(int $id)
    {

    }

    public function updateObject()
    {

    }

    public function delete($id)
    {

    }

    public function createNewObject(int $id, int $nummer, string $name, int $article_Id = null): Description
    {
        return new Description();
    }

}
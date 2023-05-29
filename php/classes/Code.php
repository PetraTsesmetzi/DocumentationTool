<?php

class Code
{
    private int $id;
    private string $codeText;
    private int $article_Id;

    /**
     * @param int|null $id
     * @param string|null $codeText
     * @param int|null $article_Id
     */
    public function __construct(?int $id = null, ?string $codeText = null, ?int $article_Id = null)
    {
        if (isset($id) && isset($codeText) && isset($article_Id)) {
            $this->id = $id;
            $this->codeText = $codeText;
            $this->article_Id = $article_Id;
        }
    }

    public function getAllAsObjects(Article $article = null): array|null
    {
        try {
            $dbh = DB::connect();
            if (!isset($article)) {
                $sql = "SELECT * FROM code";
                $result = $dbh->query($sql);
            }else{
                $sql="SELECT * FROM code WHERE article_Id=:article_Id";
                $stmt=$dbh->prepare($sql);
                $id=$article->getId();
                $stmt->bindParam(':article_Id',$id);
                $stmt->execute();
                $result=$stmt;

            }
            $codeArr = [];
            while($code=$result->fetchObject(__CLASS__)){
                $codeArr[]=$code;
            }

        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e);
        }

        return $codeArr;
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

    public function createNewObject(int $id, int $nummer, string $name, int $article_Id = null): Code
    {
        return new Code();
    }
}
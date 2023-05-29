<?php

class Article
{
    private int $id;
    private int $articleNumber;
    private string $articleName;
    private array $descriptionArr;
    private array $codeArr;

    /**
     * @param int|null $id
     * @param int|null $articleNumber
     * @param string|null $articleName
     */
    public function __construct(?int $id = null, ?int $articleNumber = null, ?string $articleName = null)
    {
        if (isset($id) && isset($articleNumber) && isset($articleName)) {
            $this->id = $id;
            $this->articleNumber = $articleNumber;
            $this->articleName = $articleName;
        }
    }


    public function getAllAsObjects(): array
    {
        try {
            $dbh = DB::connect();
            $sql = "SELECT * FROM article";
            $result = $dbh->query($sql);
            $articleArr = [];
            while ($article = $result->fetchObject(__CLASS__)) {
                $article->descriptionArr = (new Description())->getAllAsObjects($article);
                $article->codeArr = (new Code())->getAllAsObjects($article);
                $articleArr[] = $article;
            }
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }


        return $articleArr;
    }

    public function getObjectById(int $id): Article

    {
        try{
            $dbh=DB::connect();
            $sql="SELECT * FROM article WHERE id=:id";
            $stmt=$dbh->prepare($sql);
            $stmt->bindParam(':id',$id, PDO::PARAM_INT);
            $stmt->execute();
            $article=$stmt->fetchObject(__CLASS__);
            $article->descriptionArr=(new Description())->getAllAsObjects($article);
            $article->codeArr=(new Code())->getAllAsObjects($article);

        }catch(PDOException $e){
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $article;
    }


    public function updateObject()
    {

    }

    public function delete(int $id)
    {

    }

    public function createNewObject(int $id, int $articleNumber, string $articleName, int $overlayingChapter_Id = null): Article
    {
        return new Article();
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

}
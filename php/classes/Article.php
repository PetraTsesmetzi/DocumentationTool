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


    public function getAllAsObjects(Subchapter $subchapter=null): array
    {


        try {
            $dbh = DB::connect();
            if(!isset($subchapter)){
                $sql = "SELECT * FROM article";
                $result = $dbh->query($sql);
            }else{
                $sql = "SELECT * FROM article WHERE subchapter_Id=:subchapter_Id";
                $stmt = $dbh->prepare($sql);
                $id = $subchapter->getId();
                $stmt->bindParam('subchapter_Id', $id);
                $stmt->execute();
                $result = $stmt;
            }
            $articleArr = [];
            while ($article = $result->fetchObject(__CLASS__)) {
                $article->descriptionArr = (new Description())->getAllAsObjects($article);
                $article->codeArr = (new Code())->getAllAsObjects($article);
                $articleArr[] = $article->getJSONEncode();
            }
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage().$e->getLine());
        }
        return $articleArr;
    }

    public function getObjectById(int $id): string
//    public function getObjectById(int $id): Article
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


//        return $article;
        return $article->getJSONEncode();
    }





    public function getJSONEncode(): string
    {
        return json_encode(get_object_vars($this));
    }


    public function updateObject()
    {

    }

    public function delete(int $id)
    {
        //todo: wenn du löscht sammelst du die glöschten aricleNumbers in einem Ararry
    }

    public function createNewObject(int $articleNumber, int $subchapterId , string $articleName): int
    {
        try {
            $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWD);
//            echo $articleName;
            $sql = "INSERT INTO article(articleNumber,subchapter_Id,articleName) VALUES(:articleNumber,:subchapter_Id,:articleName)";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':articleNumber', $articleNumber, PDO::PARAM_STR);
            $stmt->bindParam(':subchapter_Id', $subchapterId, PDO::PARAM_STR);
            $stmt->bindParam(':articleName', $articleName, PDO::PARAM_STR);
            $stmt->execute();
            $lastId = $dbh->lastInsertId();
            $dbh = null;
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage() . ' ' . $e->getFile() . ' ' . $e->getLine());
        }
        return $lastId;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

}
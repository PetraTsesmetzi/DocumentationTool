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
                $descriptionArr[] = $description->getJSONEncode();
//                $descriptionArr[] = $description;
            }


        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $descriptionArr;
    }
    public function getJSONEncode(): string
    {
        return json_encode(get_object_vars($this));
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

    public function createNewObject($article_Id,$descriptionsArr): void
    {

        foreach ($descriptionsArr as $desc) {
            try{
                if($desc->descriptionText==="")$desc->descriptionText="Bitte lösche dieses Feld!";
                $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWD);
                $sql = "INSERT INTO description(article_Id,elementOrder,descriptionText) VALUES(:article_Id,:elementOrder,:descriptionText)";
                $stmt = $dbh->prepare($sql);
                $stmt->bindParam(':article_Id', $article_Id, PDO::PARAM_INT);
                $stmt->bindParam(':elementOrder',$desc->elementOrder, PDO::PARAM_INT);
                $stmt->bindParam(':descriptionText', $desc->descriptionText, PDO::PARAM_STR);
                $stmt->execute();
                $dbh = null;
            }catch(PDOException $e){
                throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage() . ' ' . $e->getFile() . ' ' . $e->getLine());
            }
        }

    }

}
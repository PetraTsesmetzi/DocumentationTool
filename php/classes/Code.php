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

    /**
     * liest alle codeText aus der db
     * @param Article|null $article
     * @return array|null
     */
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
                $codeArr[]=$code->getJSONEncode();
//                $codeArr[]=$code;
            }

        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e);
        }

        return $codeArr;
    }

    /**
     * gibt alle privaten attribute der klasse als json string zurück
     * @return string
     */
    public function getJSONEncode(): string
    {
        return json_encode(get_object_vars($this));
    }


    /**
     * itireiert durch das codeArr und erstellt für jeden eintrag einen eintrag in die DB
     * @param $article_Id
     * @param $codeArr
     * @return void
     */
    public function createNewObject($article_Id,$codeArr):void
    {
        foreach ($codeArr as $code) {
            try{
                if($code->codeText==="")$code->codeText="Bitte lösche dieses Feld!";
                $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWD);
                $sql = "INSERT INTO code(article_Id,elementOrder,codeText) VALUES(:article_Id,:elementOrder,:codeText)";
                $stmt = $dbh->prepare($sql);
                $stmt->bindParam(':article_Id', $article_Id, PDO::PARAM_INT);
                $stmt->bindParam(':elementOrder',$code->elementOrder, PDO::PARAM_INT);
                $stmt->bindParam(':codeText', $code->codeText, PDO::PARAM_STR);
                $stmt->execute();
                $dbh = null;
            }catch(PDOException $e){
                throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage() . ' ' . $e->getFile() . ' ' . $e->getLine());
            }
        }
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
}
<?php
/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse Code erstellt und liest die Code-Felder
 *
 */

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
     * liest alle codeTexte aus der db
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
     * gibt alle privaten Attribute der Klasse als json String zurück
     * @return string
     */
    public function getJSONEncode(): string
    {
        return json_encode(get_object_vars($this));
    }


    /**
     * itireiert durch das codeArr und erstellt für jeden Eintrag einen Eintrag in die DB
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

    /**
     * löscht einen code Datensatz
     * @param int $id
     * @return void
     * @throws Exception
     */
    public function deleteObject(int $id):void
    {
        try{
            $dbh=new PDO(DB_DSN,DB_USER,DB_PASSWD);
            $sql ="DELETE from code WHERE id=:id";
            $stmt=$dbh->prepare($sql);
            $stmt->bindParam(':id',$id,PDO::PARAM_INT);
            $stmt->execute();
            $dbh=null;
          } catch (PDOException $e) {
            throw new Exception($e->getMessage() . ' ' . $e->getFile() . ' ' . $e->getCode() . ' ' . $e->getLine());
        }
    }

    /**
     * * aktualisiert die vorhandenen code Felder
     * @param $article_Id
     * @param $codeArr
     * @return void
     */
    public function updateObject($article_Id,$codeArr): void
    {
        try {
            $dbh = DB::connect();
            foreach ($codeArr as $code) {
                $sql = "UPDATE code SET  article_Id=:article_Id, 
                    elementOrder=:elementOrder,
                    codeText=:codeText WHERE id=:id";
                $stmt = $dbh->prepare($sql);
                $stmt->bindParam(':article_Id', $article_Id, PDO::PARAM_INT);
                $stmt->bindParam(':elementOrder', $code->elementOrder, PDO::PARAM_INT);
                $stmt->bindParam(':codeText', $code->codeText, PDO::PARAM_STR);
                $stmt->bindParam(':id', $code->codeId, PDO::PARAM_INT);
                $stmt->execute();
            }
            $dbh = null;
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage().'--'.$e->getLine());
        }
    }

}
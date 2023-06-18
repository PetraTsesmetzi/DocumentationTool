<?php

/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse Description erstellt und liest die Beschreibungsblöcke
 *
 */


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

    /**
     * liest alle Beschreibungsblöcke aus der DB raus
     * @param Article|null $article
     * @return array|null
     */
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

    /**
     * gibt alle privaten Attribute der klasse als json string zurück
     * @return string
     */
    public function getJSONEncode(): string
    {
        return json_encode(get_object_vars($this));
    }


    /**
     * erstellt anhand des descritptionsarray die einträge in der datenbank
     * @param $article_Id
     * @param $descriptionsArr
     * @return void
     */
    public function createNewObject($article_Id, $descriptionsArr): void
    {
        try {
            $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWD);
            foreach ($descriptionsArr as $desc) {
                if ($desc->descriptionText === "") $desc->descriptionText = "Bitte lösche dieses Feld!";
                $sql = "INSERT INTO description(article_Id,elementOrder,descriptionText) VALUES(:article_Id,:elementOrder,:descriptionText)";
                $stmt = $dbh->prepare($sql);
                $stmt->bindParam(':article_Id', $article_Id, PDO::PARAM_INT);
                $stmt->bindParam(':elementOrder', $desc->elementOrder, PDO::PARAM_INT);
                $stmt->bindParam(':descriptionText', $desc->descriptionText, PDO::PARAM_STR);
                $stmt->execute();
            }
            $dbh = null;
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage() . ' ' . $e->getFile() . ' ' . $e->getLine());
        }


    }

    /**
     * löscht eine Description -Datensatz
     * @param int $id
     * @return void
     * @throws Exception
     */
    public function deleteObject(int $id): void
    {
        try {
            $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWD);
            $sql = "DELETE from description WHERE id=:id";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $dbh = null;
        } catch (PDOException $e) {
            throw new Exception($e->getMessage() . ' ' . $e->getFile() . ' ' . $e->getCode() . ' ' . $e->getLine());
        }
    }

    /**
     * aktualisiert die vorhandenen description Felder
     * @param $article_Id
     * @param $descriptionsArr
     * @return void
     */
    public function updateObject($article_Id, $descriptionsArr): void
    {
        try {
            $dbh = DB::connect();
            foreach ($descriptionsArr as $desc) {
                $sql = "UPDATE description SET  article_Id=:article_Id, 
                    elementOrder=:elementOrder,
                    descriptionText=:descriptionText WHERE id=:id";
                $stmt = $dbh->prepare($sql);
                $stmt->bindParam(':article_Id', $article_Id, PDO::PARAM_INT);
                $stmt->bindParam(':elementOrder', $desc->elementOrder, PDO::PARAM_INT);
                $stmt->bindParam(':descriptionText', $desc->descriptionText, PDO::PARAM_STR);
                $stmt->bindParam(':id', $desc->descriptionId, PDO::PARAM_INT);
                $stmt->execute();
            }
            $dbh = null;
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage() . '--' . $e->getLine());
        }
    }


}
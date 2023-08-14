<?php

class Category
{
    private int $id;


    private string $categoryName;
    private array $chapterArr;

    /**
     * @param int|null $id
     * @param string|null $categoryName
     */
    public function __construct(?int $id = null,  ?string $categoryName = null)
    {
        if (isset($id)  && isset($chapterName)) {
            $this->id = $id;
            $this->$categoryName = $categoryName;
        }
    }

    public function getAllCategories(): array|null
    {
        try {
            $dbh = DB::connect();
            $sql = "SELECT * FROM category";
            $result = $dbh->query($sql);
            $categories = [];
            while ($category = $result->fetchObject(__CLASS__)) {
                $categories[] = $category->getJSONEncode();
            }
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }

        return $categories;
    }

    /**
     * girbt die ID des Datensatzes bei übergabe eines CategorienTitels
     * @param $categoryTitel
     * @return int
     */
    public function getCategoryId($categoryTitel):int{
        try {

            $dbh = DB::connect();
            $sql = "SELECT id FROM category WHERE categoryName=:categoryName";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':categoryName', $categoryTitel, PDO::PARAM_STR);
            $stmt->execute();
            $categoryId = $stmt->fetchObject(__CLASS__);

        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $categoryId->id;

    }

    public function getObjectNameById(int $id=null): string
    {
        try {

            $dbh = DB::connect();
            $sql = "SELECT categoryName FROM category WHERE id=:id";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $categoryName = $stmt->fetchColumn();
            if ($categoryName === false) {
                throw new Exception("categoryName with ID $id not found.");
            }


        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage().$e->getFile());
        }


        return json_encode($categoryName);
    }


    /**
     * gibt alle privaten attribute der klasse als json string zurück
     * @return string
     */
    public function getJSONEncode(): string
    {
        return json_encode(get_object_vars($this));
    }


}
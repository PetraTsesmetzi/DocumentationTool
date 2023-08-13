<?php

class Chapter
{
    private int $id;
    private int $category;

    private string $chapterName;
    private array $subChapterArr;

    /**
     * @param int|null $id
     * @param string|null $chapterName
     */
    public function __construct(?int $id = null,  ?string $chapterName = null)
    {
        if (isset($id)  && isset($chapterName)) {
            $this->id = $id;
            $this->chapterName = $chapterName;
        }
    }

    /**
     * @return array
     */
    public function getAllChapters(): array|null
    {
        try {
            $dbh = DB::connect();
            $sql = "SELECT * FROM chapter";
            $result = $dbh->query($sql);
            $chapters = [];
            while ($chapter = $result->fetchObject(__CLASS__)) {
                $chapters[] = $chapter->getJSONEncode();
            }
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }

        return $chapters;
    }

    /**
     *
     * @param $chapterTitel
     * @return int
     */
    public function getChapterId($chapterTitel):int{
        try {
            $dbh = DB::connect();
            $sql = "SELECT id FROM chapter WHERE chapterName=:chapterName";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':chapterName', $chapterTitel, PDO::PARAM_STR);
            $stmt->execute();
            $chapterId = $stmt->fetchObject(__CLASS__);

        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $chapterId->id;
    }

    public function getCategoryId($chapterName):int{
        try {
//
            $dbh = DB::connect();
            $sql = "SELECT category_Id FROM chapter WHERE chapterName=:chapterName";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':chapterName', $chapterName, PDO::PARAM_STR);
            $stmt->execute();
            $categoryId = $stmt->fetchObject(__CLASS__);

        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $categoryId->category_Id;

    }

    /**
     * gibt ein objektnamen wieder
     * @param int|null $id
     * @return string
     * @throws Exception
     */
    public function getObjectNameById(int $id=null): string
    {
        try {

            $dbh = DB::connect();
            $sql = "SELECT chapterName FROM chapter WHERE id=:id";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $chapterName = $stmt->fetchColumn();
            if ($chapterName === false) {
                throw new Exception("ChapterName with ID $id not found.");
            }


        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage().$e->getFile());
        }


        return json_encode($chapterName);
    }

    public function getAllObjByCategoryId(int $categoryId=null): array|null
    {
        try {
            $dbh = DB::connect();
            $sql = "SELECT * FROM chapter WHERE category_Id=:categoryId";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':categoryId', $categoryId, PDO::PARAM_INT);
            $stmt->execute();
            $chapterArr=[];
            while ($chapter = $stmt->fetchObject(__CLASS__)) {
                $chapter->subChapterArr = (new SubChapter())->getAllAsObjects($categoryId);
                $chapterArr[] = $chapter->getJSONEncode();
            }

        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage().$e->getLine());
        }
        return $chapterArr;
    }


    public function createNewObject(  int $category_Id, string $chapterName): int
    {
        try {
            $dbh=DB::connect();
//            $dbh = DB::connect();
            $sql = "INSERT INTO chapter(category_Id,chapterName) VALUES(:category_Id,:chapterName)";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':category_Id', $category_Id, PDO::PARAM_INT);
            $stmt->bindParam(':chapterName', $chapterName, PDO::PARAM_STR);
            $stmt->execute();
            $lastId = $dbh->lastInsertId();
            $dbh = null;
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage() . ' ' . $e->getFile() . ' ' . $e->getLine());
        }
        return $lastId;
    }

    /**
     * löscht ein Kapitel
     * @param int $id
     * @return void
     * @throws Exception
     */
    public function deleteObject(int $id):void
    {

        try {
            $dbh = new PDO(DB_DSN, DB_USER, DB_PASSWD);
            $sql = "DELETE from chapter WHERE id=:id";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $dbh = null;
        } catch (PDOException $e) {
            throw new Exception($e->getMessage() . ' ' . $e->getFile() . ' ' . $e->getCode() . ' ' . $e->getLine());
        }
    }

    /**
     * aktualisert chapter
     * @param int $updateChapterId
     * @param string $chapterName
     * @return void
     */
    public function updateObject(int $updateChapterId,string $chapterName ): void
    {
        try {
            $dbh = DB::connect();
            $sql = "UPDATE chapter SET  chapterName=:chapterName
                    WHERE id=:updateChapterId";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':chapterName', $chapterName, PDO::PARAM_STR);
            $stmt->bindParam(':updateChapterId', $updateChapterId, PDO::PARAM_INT);
            $stmt->execute();

            $dbh = null;
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage().'--'.$e->getLine());
        }
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
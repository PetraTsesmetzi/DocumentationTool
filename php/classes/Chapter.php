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
//            echo $subChapterTitel;
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
//    public function getObjectById(int $id=null): string
//    {
//        try {
//
//            $dbh = DB::connect();
//            $sql = "SELECT * FROM chapter WHERE id=:id";
//            $stmt = $dbh->prepare($sql);
//            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
//            $stmt->execute();
//            $chapter = $stmt->fetchObject(__CLASS__);
//            if ($chapter === false) {
//                throw new Exception("Subchapter with ID $id not found.");
//            }
//            $chapter->subChapterArr = (new SubChapter())->getAllAsObjects($chapter);
//
//        } catch (PDOException $e) {
//            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage().$e->getFile());
//        }
////        return $subChapter;
//        return $chapter->getJSONEncode();
//    }
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

    /**
     * gibt alle privaten attribute der klasse als json string zurück
     * @return string
     */
    public function getJSONEncode(): string
    {
        return json_encode(get_object_vars($this));
    }



}
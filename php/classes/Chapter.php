<?php

class Chapter
{
    private int $id;
    private int $category;

    private string $chapterName;
    private array $chapterArr;

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
    public function getAllChapters(): array
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


    public function getAllObjByCategoryId(int $categoryId=null): array
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
<?php

class Chapter
{
    private int $id;
    private int $category;

    private string $chapterName;

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
}
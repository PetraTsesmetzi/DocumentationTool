<?php
/**
 * Autorin: Petra Tsesmetzi
 * Datum: 12.06.2023
 *
 * Die Klasse Subchapter erstellt und liest die Unterkapitel
 *
 */

class SubChapter
{
    private int $id;
    private int $subchapterNumber;

    private string $subchapterName;

    private int $chapter_Id;

    private array $articleArr;


    /**
     * @param int|null $id
     * @param int|null $subchapterNumber
     * @param string|null $subchapterName
     */

    public function __construct(?int $id = null, ?int $subchapterNumber = null, ?string $subchapterName = null)
    {
        if (isset($id) && isset($subchapterNumber) && isset($subchapterName)) {
            $this->id = $id;
            $this->subchapterNumber = $subchapterNumber;
            $this->subchapterName = $subchapterName;
        }
    }

    /**
     * liest alle subchapters aus der DB
     * @return array
     */
    public function getAllSubChapters(): array
    {
        try {
            $dbh = DB::connect();
            $sql = "SELECT * FROM subChapter";
            $result = $dbh->query($sql);
            $subChapters = [];
            while ($subChapter = $result->fetchObject(__CLASS__)) {
                $subChapters[] = $subChapter->getJSONEncode();
            }
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }

        return $subChapters;
    }


    /**
     * liest das subchapter nach der id raus
     * und befüllt das articleArray
     * @param int $id
     * @return string
     */
    public function getObjectById(int $id): string
//    public function getObjectById(int $id): SubChapter
    {
        try {

            $dbh = DB::connect();
            $sql = "SELECT * FROM subChapter WHERE id=:id";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $subChapter = $stmt->fetchObject(__CLASS__);
            $subChapter->articleArr = (new Article())->getAllAsObjects($subChapter);

        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage().$e->getFile());
        }
//        return $subChapter;
        return $subChapter->getJSONEncode();
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
     * liest alle subchapter aus der Datenbank raus
     * @return array
     */
    public function getAllAsObjects(int $id=null): array
    {
        try {
            if(!isset($id)){

                $dbh = DB::connect();
                $sql = "SELECT * FROM subChapter";
                $result = $dbh->query($sql);
                $subChapterArr = [];
                while ($subChapter = $result->fetchObject(__CLASS__)) {
                    $subChapter->articleArr = (new Article())->getAllAsObjects($subChapter);
                    $subChapterArr[] = $subChapter->getJSONEncode();
                }


            }else{

                $dbh = DB::connect();
                $sql = "SELECT * FROM subChapter WHERE id=:id";
                $stmt = $dbh->prepare($sql);
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();
                while ($subChapter = $stmt->fetchObject(__CLASS__)) {
                    $subChapter->articleArr = (new Article())->getAllAsObjects($subChapter);
                    $subChapterArr[] = $subChapter->getJSONEncode();
                }

            }


        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $subChapterArr;
    }

    /**
     * liest subchapter nach id aus der Datenbank raus
     * @param $subChapterTitel
     * @return int
     */
    public function getSubChapterId($subChapterTitel):int{
        try {
//            echo $subChapterTitel;
            $dbh = DB::connect();
            $sql = "SELECT id FROM subChapter WHERE subchapterName=:subchapterName";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':subchapterName', $subChapterTitel, PDO::PARAM_STR);
            $stmt->execute();
            $subChapterId = $stmt->fetchObject(__CLASS__);

        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $subChapterId->id;

    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }



    /**
     * erstellt ein subchapter objekt
     * @param int $subchapterNumber
     * @param string $subchapterName
     * @param int $chapter_Id
     * @return int
     */
    public function createNewObject(int $subchapterNumber, string $subchapterName, int $chapter_Id): int
    {
        try {
            $dbh=DB::connect();
//            $dbh = DB::connect();
            $sql = "INSERT INTO subchapter(subchapterNumber,chapter_Id,subchapterName) VALUES(:subchapterNumber,:chapter_Id,:subchapterName)";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':subchapterNumber', $subchapterNumber, PDO::PARAM_STR);
            $stmt->bindParam(':chapter_Id', $chapter_Id, PDO::PARAM_STR);
            $stmt->bindParam(':subchapterName', $subchapterName, PDO::PARAM_INT);
            $stmt->execute();
            $lastId = $dbh->lastInsertId();
            $dbh = null;
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage() . ' ' . $e->getFile() . ' ' . $e->getLine());
        }
        return $lastId;
    }

}
<?php

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

    public function __construct(?int $id=null, ?int $subchapterNumber=null, ?string $subchapterName=null)
    {
        if (isset($id) && isset($subchapterNumber) && isset($subchapterName)) {
        $this->id = $id;
        $this->subchapterNumber = $subchapterNumber;
        $this->subchapterName = $subchapterName;
        }
    }

    public function getAllAsObjects(): array
    {
        try {
            $dbh = DB::connect();
            $sql = "SELECT * FROM subChapter";
            $result = $dbh->query($sql);
            $subChapter = [];
            while ($subChapter = $result->fetchObject(__CLASS__)) {
                $subChapter->articleArr = (new Article())->getAllAsObjects($subChapter);

                $subChapter[] = $subChapter;
            }
        } catch (PDOException $e) {
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $subChapter;
    }

    public function getObjectById(int $id): string

    {
        try{
            $dbh=DB::connect();
            $sql="SELECT * FROM subChapter WHERE id=:id";
            $stmt=$dbh->prepare($sql);
            $stmt->bindParam(':id',$id, PDO::PARAM_INT);
            $stmt->execute();
            $subChapter=$stmt->fetchObject(__CLASS__);
            $subChapter->articleArr=(new Article())->getAllAsObjects($subChapter);

        }catch(PDOException $e){
            throw new PDOException('Fehler in der Datenbank: ' . $e->getMessage());
        }
        return $subChapter->getJSONEncode();
    }

    public function getJSONEncode(): string
    {
        return json_encode(get_object_vars($this));
    }


    public function updateObject()
    {

    }

    public function delete(int $id)
    {

    }

    public function createNewObject(int $id, int $subchapterNumber, string $subchapterName, int $chapter_Id = null): Article
    {
        return new Article();
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }
}
<?php

class Article
{
    private int $id;
    private int $articleNumber;
    private string $articleName;
    private int $subchapter_Id;
    private array $descriptionArr=[];
    private array $codeArr=[];

    /**
     * @param int $id
     * @param int $articleNumber
     * @param string $articleName
     * @param int $subchapter_Id
     * @param array $descriptionArr
     * @param array $codeArr
     */
    public function __construct(int $id, int $articleNumber, string $articleName, int $subchapter_Id, array $descriptionArr, array $codeArr)
    {
        $this->id = $id;
        $this->articleNumber = $articleNumber;
        $this->articleName = $articleName;
        $this->subchapter_Id = $subchapter_Id;
        $this->descriptionArr = $descriptionArr;
        $this->codeArr = $codeArr;
    }

    public function CreateNewObject(int $id,int $articleNumber,string $articleName,int $subchapter_Id=null ): Article
    {
        // TODO: Implement CreateNewObject() method.
        return new Article();
    }

    public function getObjectById(int $id)
    {
        // TODO: Implement getObjectById() method.
    }

    public function getAllAsObjects()
    {
        // TODO: Implement getAllAsObjects() method.
    }

    public function updateObject()
    {
        // TODO: Implement updateObject() method.
    }

    public function delete($id)
    {
        // TODO: Implement delete() method.
    }
}
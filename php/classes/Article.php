<?php

class Article extends Outline
{
    private int $id;
    private int $articleNumber;
    private string $articleName;
    private int $subchapter_Id;
    private array $descriptionArr=[];
    private array $codeArr=[];
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
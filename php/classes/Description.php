<?php

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
    public function __construct(int $id, string $descriptionText, int $article_Id)
    {
        $this->id = $id;
        $this->descriptionText = $descriptionText;
        $this->article_Id = $article_Id;
    }

    public function CreateNewObject(int $id, int $nummer, string $name, int $article_Id = null): Description
    {
        return new Description();
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
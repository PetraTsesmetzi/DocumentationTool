<?php

class Code
{
    private int $id;
    private string $codeText;
    private int $article_Id;

    /**
     * @param int $id
     * @param string $codeText
     * @param int $article_Id
     */
    public function __construct(int $id, string $codeText, int $article_Id)
    {
        $this->id = $id;
        $this->codeText = $codeText;
        $this->article_Id = $article_Id;
    }

    public function CreateNewObject(int $id, int $nummer, string $name, int $article_Id = null): Code
    {
       return new Code();
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
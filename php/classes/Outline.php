<?php

abstract class Outline implements Saveable
{
    private int $id;
    private int $nummer;
    private string $name;
    private int $overlayingChapter_Id;

    /**
     * @param int $id
     * @param int $number
     * @param string $name
     * @param int $overlayingChapter_Id
     */
    public function __construct(int $id, int $number, string $name, int $overlayingChapter_Id)
    {
        $this->id = $id;
        $this->nummer = $number;
        $this->name = $name;
        $this->$overlayingChapter_Id = $overlayingChapter_Id;
    }


    /**
     * @param int $id
     * @return Outline
     */
    abstract public function CreateNewObject(int $id,int $nummer, string $name, int $overlayingChapter_Id=null):Outline;
}
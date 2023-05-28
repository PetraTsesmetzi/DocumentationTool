<?php

abstract class Outline implements Saveable
{
    private int $id;
    private int $nummer;
    private string $name;
    private int $ueberliegendeKapitel_Id;

    /**
     * @param int $id
     * @param int $number
     * @param string $name
     * @param int $ueberliegendeKapitel_Id
     */
    public function __construct(int $id, int $number, string $name, int $ueberliegendeKapitel_Id)
    {
        $this->id = $id;
        $this->nummer = $number;
        $this->name = $name;
        $this->ueberliegendeKapitel_Id = $ueberliegendeKapitel_Id;
    }


    /**
     * @param int $id
     * @return Outline
     */
    abstract public function CreateNewObject(int $id,int $nummer, string $name, int $ueberliegendeKapitel_Id=null):Outline;
}
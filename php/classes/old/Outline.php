<?php

abstract class Outline implements Saveable
{
    protected int $id;
    protected int $nummer;
    protected string $name;
    protected int $overlayingChapter_Id;

    /**
     * @param int|null $id
     * @param int|null $number
     * @param string|null $name
     * @param int|null $overlayingChapter_Id
     */
    public function __construct(?int $id=null, ?int $number=null, ?string $name=null,?int $overlayingChapter_Id=null)
    {
        if(isset($id) && isset($number) && isset($name) && isset($overlayingChapter_Id)){
            $this->overlayingChapter_Id = $overlayingChapter_Id;

        }
        if (isset($id) && isset($number) && isset($name)) {
            $this->id = $id;
            $this->nummer = $number;
            $this->name = $name;
        }

    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }


    /**
     * @param int $id
     * @return Outline
     */
    abstract public function createNewObject(int $id,int $nummer, string $name, int $overlayingChapter_Id=null):Outline;
}
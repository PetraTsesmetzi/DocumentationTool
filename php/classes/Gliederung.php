<?php

abstract class Gliederung implements Saveable
{
private int $id;

    /**
     * @param int $id
     */
    public function __construct(?int $id=null)
    {
        if(isset($id)){
            $this->id = $id;
        }

    }

    /**
     * @param int $id
     * @return Gliederung
     */
    abstract public function CreateNewObject(int $id):Gliederung;
}
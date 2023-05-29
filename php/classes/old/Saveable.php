<?php

interface Saveable

{


    public function getAllAsObjects():array;
    public function getObjectById(int $id);

    public function updateObject();
    public function delete($id);


}
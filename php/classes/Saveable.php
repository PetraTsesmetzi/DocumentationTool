<?php

interface Saveable

{
    public function getObjectById(int $id);

    public function getAllAsObjects();

    public function updateObject();
    public function delete($id);


}
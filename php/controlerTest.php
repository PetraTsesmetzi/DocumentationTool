<?php

class Article
{
    public string $title;
    public static array $deleted = [];

    /**
     * @param string $title
     */
    public function __construct(string $title)
    {
        $this->title = $title;
    }

    /**
     * @param array $deleted
     */
    public static function setDeleted(array $deleted): void
    {
        self::$deleted = $deleted;
    }

}

class SubChapter{
    public string $title;
    public  array $aricles = [];
}

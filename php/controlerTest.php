<?php
$array = array_map('utf8_encode', array('one', 'two', null, 'three'));
$array =  array('one', 'two', null, 'three');
var_dump(json_encode($array));







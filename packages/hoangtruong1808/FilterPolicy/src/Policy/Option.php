<?php

namespace Policy\Policy;

use ArrayObject;

class Option extends ArrayObject
{
    public function __construct($array = [], $flags = 0, $iteratorClass = "ArrayIterator")
    {
        parent::__construct($array, $flags, $iteratorClass);
    }

    /**
     * @return mixed
     * If key does not exist return -1
     */
    public function get($key)
    {
        return $this->offsetExists($key) ? $this->offsetGet($key) : false;
    }

    public function set($key, $value)
    {
        $this->offsetSet($key, $value);
    }
}

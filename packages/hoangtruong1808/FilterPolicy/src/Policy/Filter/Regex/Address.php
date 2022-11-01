<?php

namespace Policy\Policy\Filter\Regex;

use Policy\Policy\Filter\RegularExpression;

class Address extends RegularExpression
{
    public static $_pattern = '';

    public function __construct($config = [])
    {
        parent::__construct($config);
        $this->setPattern($this->_getPattern());
    }

    public function setSubject($subject, $options = null)
    {
        $pattern_to_replace = array('/\r/', '/\n/', '/\t/', '/ /', '/\-/', '/\//');
        $str_to_replace = array('', '', '', '', '', '');
        parent::setSubject($subject, [$pattern_to_replace, $str_to_replace]);
    }

    public function _getPattern()
    {
        if (!static::$_pattern) {
            $path = __DIR__ . '/address-pattern.txt';
            static::$_pattern = '/' . file_get_contents($path) . '/x';
        }

        return static::$_pattern;
    }
}

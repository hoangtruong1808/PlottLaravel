<?php

namespace Policy\Policy\Filter\Regex;

use Policy\Policy\Filter\RegularExpression;

class Email extends RegularExpression
{
    public function __construct($config = [])
    {
        parent::__construct($config);
        $this->setPattern($this->_getPattern());
    }

    /**
     * @return string
     */
    public function _getPattern()
    {
        return "/[a-zA-Z0-9\"\._\?\+\/-]+\@[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_.]+/x";
    }
}

<?php

namespace Policy\Policy\Filter\Regex;

use Policy\Policy\Filter\RegularExpression;

class CreditCardNumber extends RegularExpression
{
    public function __construct($config = [])
    {
        parent::__construct($config);
        $this->setPattern($this->_getPattern());
    }

    public function _getPattern()
    {
        return "/35[0-9]{14}|6011[0-9]{12}|(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})/x";
    }

    public function setSubject($subject, $options = null)
    {
        $str_to_replace = array('', '', '', '', '', '');
        $pattern_to_replace = array('/\r/', '/\n/', '/\t/', '/ /', '/\-/', '/\//');
        parent::setSubject($subject, [$pattern_to_replace, $str_to_replace]);
    }
}

<?php

namespace Policy\Policy\Filter\Regex;

use Policy\Policy\Helpers\String;
use Policy\Policy\Filter\RegularExpression;

class Regex extends RegularExpression
{
    public function __construct($config = [])
    {
        parent::__construct($config);

        $this->setPattern($this->_getPattern());
    }

    /**
     * Now only get FIRST string in the pattern in the options
     * @return array
     */
    private function _getPattern()
    {
        $pattern = $this->_options->get('pattern');
        $arr_keyword = explode("\n", trim($pattern));
        $patterns = [];
        foreach ($arr_keyword as $word) {
            $patterns[] = '/' . String::removeLineBreak($word) . '/u';
        }
        return $patterns;
    }
}

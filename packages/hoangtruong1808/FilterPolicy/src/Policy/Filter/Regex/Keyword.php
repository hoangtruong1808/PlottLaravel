<?php

namespace Policy\Policy\Filter\Regex;

use Policy\Policy\Filter\RegularExpression;

class Keyword extends RegularExpression
{
    public function __construct($config = [])
    {
        parent::__construct($config);

        $this->setPattern($this->_getPattern());
    }

    private function _getPattern()
    {
        $arr_keyword = explode("\n", trim($this->_options->get('keyword_data')));
        $str_to_replace = array('', '');
        $pattern_to_replace = array('/\r/', '/\n/');
        $patterns = [];
        foreach ($arr_keyword as $word) {
            $replace = preg_replace($pattern_to_replace, $str_to_replace, trim($word));
            if (!empty($replace)) {
                $patterns[] = '/' . $this->escapeSpecialCharacters($replace) . '/';
            }
        }

        return $patterns;
    }
}

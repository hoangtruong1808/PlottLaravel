<?php

namespace Policy\Policy\Filter;

use Policy\Policy\Option;

class RegularExpression
{
    protected $_patterns;
    protected $_subject;
    protected $_options;

    public function __construct($config = [])
    {
        $this->_options = new Option($config);
    }

    /**
     * @param string|array|callable $callable
     */
    public function setPattern($callable = null)
    {
        if (is_callable($callable)) {
            $this->_patterns = $callable();
        } else if (is_array($callable)) {
            $this->_patterns = $callable;
        } else {
            $this->_patterns = [$callable];
        }
    }

    /**
     * @param string $subject
     * @param array $options ['pattern_to_replace', 'str_to_replace']
     */
    public function setSubject($subject, $options = null)
    {
        if (!$options) {
            $str_to_replace = array('', '');
            $pattern_to_replace = array('/\r/', '/\n/');
        } else {
            list($pattern_to_replace, $str_to_replace) = $options;
        }

        $str_replace = preg_replace($pattern_to_replace, $str_to_replace, trim($subject));
        $str_convert = mb_convert_encoding($str_replace, "UTF-8", "auto");
        $this->_subject = ($str_convert);
    }

    /**
     * @return mixed
     */
    public function getSubject()
    {
        return $this->_subject;
    }

    /**
     * @return mixed
     */
    public function getPattern()
    {
        return $this->_patterns;
    }

    /**
     * Skip WARING if pattern is not valid
     * @param int $is_count_duplicate
     * @return array
     */
    public function getMatches($is_count_duplicate = true)
    {
        $matches = [];
        foreach ($this->_patterns as $key => $pattern) {
            @preg_match_all($pattern, $this->_subject, $match);

            if (!count($match[0])) {
                continue;
            }

            $matches['pattern_key_' . $key] = $is_count_duplicate ? $match[0] : array_unique($match[0]);
        }

        return $matches;
    }

    /**
     * @param $keyword
     * @param string $replace
     * @return string
     */
    public function escapeSpecialCharacters($keyword, $replace = '/')
    {
        return preg_quote($keyword, $replace);
    }
}

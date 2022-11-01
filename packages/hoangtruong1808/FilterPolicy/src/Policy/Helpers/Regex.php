<?php

namespace Policy\Policy\Helpers;

class Regex
{
    public static $words;
    private static $_subject;

    /**
     * @var array
     */
    private static $_patterns;

    /**
     * @param string|array|callable $callable
     */
    public static function setPattern($callable = null)
    {
        if (is_callable($callable)) {
            static::$_patterns = $callable();
        } else if (is_array($callable)) {
            static::$_patterns = $callable;
        } else {
            static::$_patterns = [$callable];
        }
    }

    /**
     * @param string $subject
     * @param array $options ['pattern_to_replace', 'str_to_replace']
     */
    public static function setSubject($subject, $options = null)
    {
        if (!$options) {
            $str_to_replace = array('', '');
            $pattern_to_replace = array('/\r/', '/\n/');
        } else {
            list($pattern_to_replace, $str_to_replace) = $options;
        }

        $str_replace = preg_replace($pattern_to_replace, $str_to_replace, trim($subject));
        $str_convert = mb_convert_encoding($str_replace, "UTF-8", "auto");
        static::$_subject = strtolower($str_convert);
    }

    public static function getSubject()
    {
        return static::$_subject;
    }

    public static function getPattern()
    {
        return static::$_patterns;
    }

    public static function getMatches($is_count_duplicate = true)
    {
        $matches = [];
        foreach (static::$_patterns as $pattern) {
            preg_match_all($pattern, static::$_subject, $match);

            if (!count($match[0])) {
                continue;
            }

            $matches[$pattern] = $is_count_duplicate ? $match[0] : array_unique($match[0]);
        }

        return $matches;
    }
}

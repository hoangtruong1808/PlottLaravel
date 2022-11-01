<?php
namespace Policy\Policy\Helpers;

class StringHandler {
    public static function removeLineBreak($string)
    {
        return trim(preg_replace('/\r|\n/', '', $string ));
    }

    public static function echoLineBreak($message)
    {
        echo $message . PHP_EOL;
    }

    public static function toArray(array $separator, $string)
    {
        $first_separator = $separator[0];
        $new_separator = $separator;
        unset($new_separator[0]);

        $replace_separator = array_map(function () use ($first_separator) {
            return $first_separator;
        }, $new_separator);

        $str_replace = str_replace($new_separator, $replace_separator, $string);
        $final = explode($first_separator, $str_replace);

        return array_map(function ($item) {
            return trim($item);
        }, $final);
    }
}

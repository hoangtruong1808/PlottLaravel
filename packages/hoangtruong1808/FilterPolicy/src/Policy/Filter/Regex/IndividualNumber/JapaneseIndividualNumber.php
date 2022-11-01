<?php

namespace Policy\Policy\Filter\Regex\IndividualNumber;

class JapaneseIndividualNumber
{
    protected static $_pattern = '/\d{12,}|\d{4,}[-]\d{4,}[-]\d{4,}+|\d{4,}[\s]\d{4,}[\s]\d{4,}[\s]+/';
    protected static $_pattern_to_replace = '/[^0-9]/';
    protected static $_str_to_replace = '';

    public static function replace($string)
    {
        return preg_replace(static::$_pattern_to_replace, static::$_str_to_replace, $string);
    }

    public static function getPattern()
    {
        return static::$_pattern;
    }

    public static function getMatches($data)
    {
        $patterns = ["/\d{12,}/", "/\d{4,}[-]\d{4,}[-]\d{4,}+/", '/\d{4,}[\s]\d{4,}[\s]\d{4,}+/'];
        $result = [];
        $data_tmp = $data;
        foreach ($patterns as $pa) {
            @preg_match_all($pa, $data_tmp, $matches);
            $result_match = $matches[0];
            if (!empty($result_match)) {
                foreach ($result_match as $item) {
                    $data_tmp = preg_replace("/$item/", '', $data_tmp);
                }
                $result = array_merge_recursive($result, $result_match);
            }
        }

        $data_replace = [];
        foreach ($result as $item_un_replace) {
            $data_replace[] = JapaneseIndividualNumber::replace($item_un_replace);
        }

        $new_value = [];
        foreach ($data_replace as $value) {
            if (!empty($value)) {
                $new_value = array_merge($new_value, static::findIndividualNumber($value));
            }
        }

        if (!empty($new_value)) {
            return ['pattern' => $new_value];
        }

        return [];
    }

    public static function findIndividualNumber($value)
    {
        $num_length = 12;
        $new_value = [];
        if (static::checkLengthValid($value, $num_length)) {
            if (static::verifyPersonalMynumber($value)
                && !in_array($value, $new_value)) {
                $new_value[] = $value;
            }
        }
        return $new_value;
    }

    //Check String length valid function
    public static function checkLengthValid($mynum, $numLength)
    {
        return !(strlen($mynum) != $numLength || strspn($mynum, '1234567890') != $numLength);
    }

    //Check personal Number valid function
    public static function verifyPersonalMynumber($my_num)
    {
        $num_length = 12;
        if (static::checkLengthValid($my_num, $num_length) == false) {
            return false;
        }
        $mod = static::calculateMod($my_num, $num_length);
        if ($mod <= 1) {
            return (substr($my_num, $num_length - 1, 1) == '0');
        } else {
            return ((int)substr($my_num, $num_length - 1, 1) === $num_length - 1 - $mod);
        }
    }

    //Mod Calculate function
    public static function calculateMod($my_num, $numLength)
    {
        $sum = 0;
        $num = 1;
        for ($i = $num; $i <= $numLength - 1; $i++) {
            $m = substr($my_num, $numLength - 1 - $i, 1);
            $n = ($i <= 6) ? $i + 1 : $i - 5;
            $sum += $m * $n;
        }
        return $sum % ($numLength - 1);
    }
}

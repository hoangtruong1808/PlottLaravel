<?php

namespace Policy\Policy\Filter;

class FileSize
{
    protected static $_min;
    protected static $_max;
    protected static $_unit = 1048576;

    public static function set($min, $max)
    {
        static::setMin($min);
        static::setMax($max);
    }

    public static function setMin($min)
    {
        static::$_min = $min * static::$_unit;
    }

    public static function setMax($max)
    {
        static::$_max = $max * static::$_unit;
    }

    public static function isViolation($total_size)
    {
        $min = static::$_min;
        $max = static::$_max;
        $is_violation = false;

        if ($min && $max) {
            if ($min <= $total_size && $total_size < $max) {
                $is_violation = true;
            }
        } elseif ($min) {
            if ($min <= $total_size) {
                $is_violation = true;
            }
        } elseif ($max) {
            if ($total_size < $max) {
                $is_violation = true;
            }
        }

        return $is_violation;
    }
}

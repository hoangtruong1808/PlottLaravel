<?php
namespace Policy\Policy\Helpers;

class MeasureExecutionTime {
    static $start_time;
    static $end_time;
    public static function start()
    {
        static::$start_time = microtime(true);
    }

    public static function end()
    {
        static::$end_time = microtime(true);
    }

    public static function calculate()
    {
        return (static::$end_time - static::$start_time);
    }
}

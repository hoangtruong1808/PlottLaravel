<?php

namespace Policy\Policy\File;

use Policy\Policy\Helpers\StringHandler;

class Reader
{
    public static function readLineByLine($file_path, callable $callable)
    {
        $f_open = fopen($file_path, 'r');
        if ($f_open === false) return [];

        $data_collection = [];
        while (!feof($f_open)) {
            $buffer = fgets($f_open, 4096);
            $buffer = StringHandler::removeLineBreak($buffer);
            if (!$buffer) continue;

            $result_callable = $callable($buffer);

            if (!$result_callable) {
                continue;
            }

            foreach ($result_callable as $key => $res) {
                if (isset($data_collection[$key])) {
                    $data_collection[$key] = array_merge($data_collection[$key], $res);
                } else {
                    $data_collection[$key] = $res;
                }
            }
        }
        fclose($f_open);
        return $data_collection;
    }
}

<?php

namespace Policy\Policy\Filter;

use Policy\Policy\Main;
use Policy\Policy\Helpers\StringHandler;

class DataChecker extends FilterHandler
{
    protected $_data = [];

    public function __construct($filter_options, $data)
    {
        parent::__construct($filter_options);
        $this->_data = $data;
    }

    public function scan()
    {
        if (!$this->_before()) {
            return false;
        }

        $result_check = [];
        $filter_options = $this->options->getArrayCopy();
        $data_to_check = $this->_data->getIterator();
        $is_count_duplicate = !($this->options->get('match_pattern') == 0);

        $this->_createRegex($this->options['check_type'], $filter_options);

        foreach ($data_to_check as $data_key => $item) {
            $filter_condition_key = isset($item['filter_condition_key']) ? $item['filter_condition_key'] : false;
            if ($filter_condition_key) {
                if (!$this->options->get($filter_condition_key)) {
                    continue;
                }
            }

            $tmp_data = $this->_checkDataLineByLine($item['text'], $is_count_duplicate);
            if ($tmp_data) {
                $result_check[$data_key] = $tmp_data;
            }
        }

        return $this->_checkFilterViolation($filter_options, $result_check);
    }

    public function scanWithMerger()
    {
        if (!$this->_before()) {
            return [
                'details' => [],
                'summarize' => [],
            ];
        }

        $filter_options = $this->options->getArrayCopy();
        $data_to_check = $this->_data->getIterator();
        $is_count_duplicate = !($this->options->get('match_pattern') == 0);

        $this->_createRegex($this->options['check_type'], $filter_options);
        if ($this->regex) {
            $this->logger->debug($this->regex->getPattern());
        }

        $data_merge = [];
        $result_check = [];
        foreach ($data_to_check as $data_key => $item) {
            $filter_condition_key = isset($item['filter_condition_key']) ? $item['filter_condition_key'] : false;
            if ($filter_condition_key) {
                if (!$this->options->get($filter_condition_key)) {
                    continue;
                }
            }

            $tmp_data = $this->_checkDataLineByLine($item['text'], $is_count_duplicate);
            if ($tmp_data) {
                $result_check[$data_key] = $tmp_data;
                $data_merge = array_merge_recursive($data_merge, $tmp_data);
            }
        }

        return [
            'details' => $result_check,
            'summarize' => $data_merge,
        ];
    }

    protected function _before()
    {
        $is_filter_not_apply_for_data = in_array($this->options->get('check_type'), [
            Main::FILTER_TYPE_FILE_SIZE,
            Main::FILTER_TYPE_FILE_WITH_PASSWORD
        ]);

        if (!$this->_data->count() || $is_filter_not_apply_for_data) {
            return false;
        }

        return true;
    }

    /**
     * Parse string to array by line break
     * @param $text
     * @param $is_count_duplicate
     * @return array
     */
    protected function _checkDataLineByLine($text, $is_count_duplicate)
    {
        $arr_to_split = [PHP_EOL, "\r\n", "\r"];
        $arr_str = StringHandler::toArray($arr_to_split, ($text));
        // remove empty item
        $arr_str = array_filter($arr_str, function ($item) {
            return $item;
        });

        $data_collection = [];
        foreach ($arr_str as $line) {
            $this->regex->setSubject(StringHandler::removeLineBreak($line));
            $matches = $this->regex->getMatches($is_count_duplicate);
            if (!empty($matches)) {
                $data_collection = array_merge_recursive($data_collection, $matches);
            }
        }

        if (!$is_count_duplicate) {
            foreach ($data_collection as $key => $res) {
                $data_collection[$key] = array_unique($res);
            }
        }

        $this->logger->debug('Data regex: ' . json_encode($data_collection));
        $this->logger->debug('Pattern: ' . json_encode($this->regex->getPattern()));
        return $data_collection;
    }
}

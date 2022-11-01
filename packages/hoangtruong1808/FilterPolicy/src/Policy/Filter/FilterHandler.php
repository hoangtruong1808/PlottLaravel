<?php

namespace Policy\Policy\Filter;

use Policy\Policy\Filter\Regex\Keyword;
use Policy\Policy\Logger;
use Policy\Policy\Main;
use Policy\Policy\Option;

abstract class FilterHandler
{
    protected $options;
    protected $_result;

    /**@var \Policy\Filter\RegularExpression*/
    public $regex;

    public $logger;


    public $is_violation;
    public $detail_matches;

    public function __construct($filter_options)
    {
        $this->options = new Option($filter_options);
        $this->logger = new Logger(sys_get_temp_dir());
    }

    abstract function scan();

    /**
     * @return bool
     */
    abstract protected function _before();

    /**
     * @param $type
     * @param $config
     * @return void
     */
    protected function _createRegex($type, $config)
    {
        $regex_class = array(
            Main::FILTER_TYPE_EMAIL              => 'Policy\Policy\Filter\Regex\Email',
            Main::FILTER_TYPE_KEYWORD            => 'Policy\Policy\Filter\Regex\Keyword',
            Main::FILTER_TYPE_ADDRESS            => 'Policy\Policy\Filter\Regex\Address',
            Main::FILTER_TYPE_PHONE_NUMBER       => 'Policy\Policy\Filter\Regex\PhoneNumber',
            Main::FILTER_TYPE_INDIVIDUAL_NUMBER  => 'Policy\Policy\Filter\Regex\IndividualNumber',
            Main::FILTER_TYPE_CREDIT_CARD_NUMBER => 'Policy\Policy\Filter\Regex\CreditCardNumber',
            Main::FILTER_TYPE_REGULAR_EXPRESSION => 'Policy\Policy\Filter\Regex\Regex',
        );


        if (!array_key_exists($type, $regex_class)) return;

        $this->regex = new $regex_class[$type]($config);
    }

    /**
     * _checkFilterViolation
     * @param array $filter
     * @param array $data_to_compare
     * @return array
     */
    protected function _checkFilterViolation($filter, $data_to_compare)
    {

        $min_of_violations = $filter['match_count'];
        $is_count_duplicate = !($filter['match_pattern'] == 0);

        // if $data_to_compare is empty goto default case
        $check_type = $data_to_compare ? $filter['check_type'] : '';

        switch ($check_type) {
            case Main::FILTER_TYPE_EMAIL:
            case Main::FILTER_TYPE_ADDRESS:
            case Main::FILTER_TYPE_PHONE_NUMBER:
            case Main::FILTER_TYPE_INDIVIDUAL_NUMBER:
            case Main::FILTER_TYPE_CREDIT_CARD_NUMBER:
            case Main::FILTER_TYPE_REGULAR_EXPRESSION:
                $total_matches = [];
                foreach ($data_to_compare as $key => $item_check) {
                    $count_item_matches = array_map(function ($item) use ($is_count_duplicate) {
                        return count($is_count_duplicate ? $item : array_unique($item));
                    }, $item_check);
                    $total_matches[$key] = array_sum($count_item_matches);
                }
                return [
                    'is_violation' => array_sum($total_matches) >= $min_of_violations,
                    'detail_count_matches' => $total_matches
                ];
            case Main::FILTER_TYPE_KEYWORD:
                $condition_check_or = $filter['condition_and_or'] == 0 ? 'AND' : 'OR';
                $pattern = $this->regex->getPattern();
                $result_check = [];
                $total_matches = [];

                $this->logger->debug('_checkFilterViolation $data_to_compare');
                $this->logger->debug($data_to_compare);

                foreach ($data_to_compare as $key => $item_check) {
                    $tmp_violation = false;
                    $count_item_matches = 0;
                    $is_and_enough_condition = count($pattern) > count($item_check);
                    if ($condition_check_or == 'AND' && $is_and_enough_condition) {
                        $result_check[$key] = false;
                        $total_matches[$key] = 0;
                        break;
                    }

                    foreach ($item_check as $pattern_matches) {
                        $count_matches = count($pattern_matches);
                        $count_item_matches += $count_matches;

                        if ($condition_check_or == 'OR') {
                            if ($count_matches >= $min_of_violations) {
                                $tmp_violation = true;
                                break;
                            }
                            $tmp_violation = false;
                        } else { // AND condition
                            if ($count_matches < $min_of_violations) {
                                $tmp_violation = false;
                                break;
                            }
                            $tmp_violation = true;
                        }
                    }
                    $total_matches[$key] = $count_item_matches;
                    $result_check[$key] = $tmp_violation;
                }

                return [
                    'is_violation' => !in_array(false, $result_check),
                    'detail_count_matches' => $total_matches
                ];

            default:
                return [
                    'is_violation' => false,
                    'detail_count_matches' => 0
                ];
        }
    }

    public static function checkFilterViolation($filter, $data_to_compare, $logger = null) {
        // For FILTER_TYPE_FILE_SIZE and FILTER_TYPE_FILE_WITH_PASSWORD does not set match_count value
        // so set default match_count = 1 to check violation
        $min_of_violations = isset($filter['match_count']) ? $filter['match_count'] : 1;

        if (isset($filter['match_pattern'])) {
            $is_count_duplicate = !($filter['match_pattern'] == 0);
        } else {
            $is_count_duplicate = 0;
        }

        // if $data_to_compare is empty goto default case
        $check_type = $data_to_compare ? $filter['check_type'] : '';

        switch ($check_type) {
            case Main::FILTER_TYPE_EMAIL:
            case Main::FILTER_TYPE_ADDRESS:
            case Main::FILTER_TYPE_PHONE_NUMBER:
            case Main::FILTER_TYPE_INDIVIDUAL_NUMBER:
            case Main::FILTER_TYPE_CREDIT_CARD_NUMBER:
            case Main::FILTER_TYPE_REGULAR_EXPRESSION:
            case Main::FILTER_TYPE_FILE_WITH_PASSWORD:
            case Main::FILTER_TYPE_FILE_SIZE:
            $total_matches = [];
                foreach ($data_to_compare as $key => $item_check) {
                    $count_item_matches = array_map(function ($item) use ($is_count_duplicate) {
                        return count($is_count_duplicate ? $item : array_unique($item));
                    }, $item_check);
                    $total_matches[$key] = array_sum($count_item_matches);
                }
                return [
                    'is_violation' => array_sum($total_matches) >= $min_of_violations,
                    'detail_count_matches' => $total_matches
                ];
            case Main::FILTER_TYPE_KEYWORD:
                $condition_check_or = $filter['condition_and_or'] == 0 ? 'AND' : 'OR';
                $keyword_filter = new Keyword($filter);
                $patterns = $keyword_filter->getPattern();

                $tmp_violation = false;
                $count_item_matches = 0;
                foreach ($data_to_compare as $item) {
                    $is_enough_condition_or = false;
                    $is_enough_condition_and = false;
                    foreach ($item as $matches) {
                        $count_matches = count($is_count_duplicate ? $matches: array_unique($matches));
                        $count_item_matches += $count_matches;
                        if ($condition_check_or == 'OR') {
                            if ($count_matches >= 1) {
                                $is_enough_condition_or = true;
                            }
                        } else {
                            $is_enough_condition_and += $count_matches >= 1 ? 1 : 0;
                        }
                    }

                    $is_valid_compare = $count_item_matches >= $min_of_violations;

                    // condition AND
                    if ($condition_check_or == 'AND') {
                        $is_enough_condition_and = $is_enough_condition_and >= count($patterns);
                        $tmp_violation = $is_enough_condition_and && $is_valid_compare;
                    } else {
                        $tmp_violation = $is_enough_condition_or && $is_valid_compare;
                    }
                }

                return [
                    'is_violation' => $tmp_violation,
                    'detail_count_matches' => $count_item_matches
                ];

            default:
                return [
                    'is_violation' => false,
                    'detail_count_matches' => 0
                ];
        }
    }
}

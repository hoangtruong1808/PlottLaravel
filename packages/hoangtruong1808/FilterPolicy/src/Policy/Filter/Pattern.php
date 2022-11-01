<?php

namespace Policy\Policy\Filter;

use Policy\Policy\Filter\Regex\Address;
use Policy\Policy\Filter\Regex\CreditCardNumber;
use Policy\Policy\Filter\Regex\Email;
use Policy\Policy\Filter\Regex\JapaneseIndividualNumber;
use Policy\Policy\Filter\Regex\PhoneNumber;
use Policy\Policy\Helpers\StringHandler;
use Policy\Policy\Main;

class Pattern
{
    /**
     * _getPattern
     *
     * @return array
     */
    public static function getByFilterType($filter)
    {
        switch ($filter['check_type']) {
            case Main::FILTER_TYPE_PHONE_NUMBER:
                return [PhoneNumber::getPattern()];

            case Main::FILTER_TYPE_CREDIT_CARD_NUMBER:
                return [CreditCardNumber::getPattern()];

            case Main::FILTER_TYPE_EMAIL:
                return [Email::getPattern()];

            case Main::FILTER_TYPE_ADDRESS:
                return [Address::getPattern()];
            case Main::FILTER_TYPE_INDIVIDUAL_NUMBER:
                return [JapaneseIndividualNumber::getPattern()];

            case Main::FILTER_TYPE_KEYWORD:
                $arr_keyword = explode("\n", trim($filter['keyword_data']));
                $str_to_replace = array('', '');
                $pattern_to_replace = array('/\r/', '/\n/');
                $patterns = [];
                foreach ($arr_keyword as $word) {
                    $patterns[] = '/' . preg_replace($pattern_to_replace, $str_to_replace, trim($word)) . '/';
                }
                return $patterns;

            case Main::FILTER_TYPE_REGULAR_EXPRESSION:
                $pattern = $filter['pattern'];
                $arr_keyword = explode("\n", trim($pattern));
                $pattern = '/' . strtolower(StringHandler::removeLineBreak($arr_keyword[0])) . '/';
                return [$pattern];

            default:
                return [];
        }
    }
}

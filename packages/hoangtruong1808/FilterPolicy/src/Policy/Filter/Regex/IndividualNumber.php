<?php

namespace Policy\Policy\Filter\Regex;

use Policy\Policy\Filter\RegularExpression;
use Policy\Policy\Filter\Regex\IndividualNumber\JapaneseIndividualNumber;

class IndividualNumber extends RegularExpression
{
    public function __construct($config = [])
    {
        parent::__construct($config);
    }

    public function getMatches($is_count_duplicate = true)
    {
        return JapaneseIndividualNumber::getMatches($this->getSubject());
    }
}

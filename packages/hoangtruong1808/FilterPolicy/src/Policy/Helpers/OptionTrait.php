<?php

namespace Policy\Policy\Helpers;

trait OptionTrait
{
    protected $_option;

    public function setOption($option)
    {
        $this->_option = $option;
    }

    public function addOption($key, $value)
    {
        $this->_option[$key] = $value;
    }

    public function getOption($key = null)
    {
        if (!$key) return $this->_option;

        return isset($this->_option[$key]) ? $this->_option[$key] : false;
    }
}

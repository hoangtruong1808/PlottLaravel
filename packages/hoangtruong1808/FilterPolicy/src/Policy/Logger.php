<?php

namespace Policy\Policy;

use Exception;

class Logger
{
    const LOGGER_INFO = 'INFO';
    const LOGGER_DEBUG = 'DEBUG';
    const LOGGER_ERROR = 'ERROR';
    const LOGGER_WARNING = 'WARNING';

    public $base_path = '';
    public $file_path = '';
    protected $mode = '';
    protected $_is_on = true;
    protected $_logger_filename = '';

    /**
     * @throws \Exception
     */
    public function __construct($base_path = null)
    {
        if (!is_dir($base_path)) {
            if (!mkdir($base_path, 0777, true)) {
                throw new Exception('Can not create log dir');
            }
        }

        $this->base_path = $base_path;
        $this->setMode(self::LOGGER_INFO);
        $this->_setFilename('log.' . date("j.n.Y") . '.log');
        $this->_makeFile();
    }

    /**
     * @throws \Exception
     */
    public function setBaseDir($base_path)
    {
        if (!is_dir($base_path)) {
            if (!mkdir($base_path, 0777, true)) {
                throw new Exception('Can not create log dir');
            }
        }
        $this->base_path = $base_path;
    }

    public function isOn($flag)
    {
        $this->_is_on = $flag;
    }

    public function write($message, $line_break = false)
    {
        if (!$this->_is_on) return;

        file_put_contents($this->base_path . '/log.' . date("j.n.Y") . '.log', $message . PHP_EOL, FILE_APPEND);

        if ($line_break) {
            file_put_contents($this->base_path . '/log.' . date("j.n.Y") . '.log', PHP_EOL, FILE_APPEND);
        }
    }

    public function writeWithType($message, $type = '', $is_append = true)
    {
        if (!$this->_is_on) return;

        if ($is_append) {
            file_put_contents($this->file_path, $this->_convertMessage($message, $type) . PHP_EOL, FILE_APPEND);
        } else {
            file_put_contents($this->file_path, $this->_convertMessage($message, $type) . PHP_EOL);
        }
    }

    protected function _setFilename($filename)
    {
        $this->_logger_filename = $filename;
    }

    protected function _convertMessage($message, $type)
    {
        $message = (is_array($message) || is_object($message)) ? json_encode($message) : $message;

        $logg_type = [
            self::LOGGER_INFO,
            self::LOGGER_DEBUG,
            self::LOGGER_ERROR,
            self::LOGGER_WARNING,
        ];

        return in_array($type, $logg_type) ?
            sprintf('[%s] %s', $type, $message)
            : $message;
    }

    protected function _makeFile()
    {
        $this->file_path = $this->base_path . '/' . $this->_logger_filename;
    }


    public function info($message)
    {
        $this->writeWithType($message, self::LOGGER_INFO);
    }

    public function error($message)
    {
        $this->writeWithType($message, self::LOGGER_ERROR);
    }

    public function debug($message)
    {
        if ($this->mode != self::LOGGER_DEBUG) return;

        $this->writeWithType($message, self::LOGGER_DEBUG);
    }

    /**
     * @return string
     */
    public function getMode()
    {
        return $this->mode;
    }

    /**
     * @param string $mode
     */
    public function setMode($mode)
    {
        $this->mode = $mode;
    }
}

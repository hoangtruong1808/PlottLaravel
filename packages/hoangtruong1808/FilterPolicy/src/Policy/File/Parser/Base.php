<?php

namespace Policy\Policy\File\Parser;

use Policy\Policy\File\FileException;
use Policy\Policy\Helpers\OptionTrait;
use Policy\Policy\Logger;
use Policy\Policy\Process\Process1;

abstract class Base
{
    use OptionTrait;

    protected $_cmd = "";
    protected $_path;
    protected $_tmp_file_path;
    protected $_tmp_dir_path;
    protected $_errors = [];

    /**
     * Execute command line
     * @var \Symfony\Component\Process\Process
     */
    protected $_process;

    public function __construct($option, $time_out = 3600)
    {
        $this->setOption($option);
        $this->_process = new Process1("");
        $this->_process->setTimeout($time_out);
    }

    abstract public function setCommandLine();

    /**
     * @param string $path file path
     */
    public function setFilePath($path)
    {
        $this->_path = $path;
    }

    /**
     * @return bool
     * @throws \Policy\File\FileException
     */
    public function run()
    {
        if (!file_exists($this->_path)) {
            throw new FileException('File does not exits');
        }
        $this->makeTmpFilePath();
        $this->setCommandLine();
        $this->_process->setCommandLine($this->getCommandLine());
        $this->_process->run();
        if (!$this->_process->isSuccessful()) {
            $this->_errors[] = $this->_process->getErrorOutput();
            return false;
        }
        return true;
    }

    public function isSuccessful()
    {
        return $this->_process->isSuccessful();
    }

    public function getError()
    {
        return $this->_errors;
    }

    public function getCommandLine()
    {
        return $this->_cmd;
    }

    public function getTmpFilePath()
    {
        return $this->_tmp_file_path;
    }

    public function makeTmpFilePath()
    {
        $filename_unique = uniqid() . strtotime('now') . '.txt';
        if ($this->_tmp_dir_path) {
            $this->_tmp_file_path = $this->_tmp_dir_path . '/' . $filename_unique;
        } else {
            $this->_tmp_file_path = sys_get_temp_dir() . '/' . $filename_unique;
        }

    }

    public function setTemporaryDir($dir_path)
    {
        $this->_tmp_dir_path = $dir_path;
    }

}

<?php

namespace Policy\Policy\File;

use Exception;
use Policy\Policy\Helpers\System;
use Policy\Policy\File\Parser\Unzip;
use Policy\Policy\Helpers\ArrayUtilities;
use Policy\Policy\File\Parser\TikaApache;
use Policy\Policy\File\Parser\KanjiConversionFilter;

class FileConvert
{
    const CONVERT_TYPE_ZIP = 'ZIP';
    const CONVERT_TYPE_TXT = 'TXT';
    const CONVERT_TYPE_NORMAL = 'NORMAL';

    private $_info;
    private $_parser;
    private $_is_converted;

    private $_file_types = [
        self::CONVERT_TYPE_ZIP => ['zip'],
        self::CONVERT_TYPE_TXT => ["txt", "log", "csv"],
        self::CONVERT_TYPE_NORMAL => ["doc", "xls", "ppt", "docx", "xlsx", "pptx", "docm", "xlsm",
            "pptm", "html", "htm", "sgml", "xml", "rtf", "pdf", "jtd",
        ],
    ];

    private $_errors;
    private $_is_error;


    /**
     * @throws Exception
     */
    public function __construct($file, $option = [])
    {

        if (!isset($file['file_path'])) {
            throw new FileException('file_path is required');
        }

        $file_path = $file['file_path'];
        if (!file_exists($file_path)) {
            throw new FileException($file_path . ' is not exist');
        }
        $this->_info = $file;

        $this->setInfo('size', filesize($file_path));
        $this->setInfo('file_path', $file_path);

        if (isset($file['password'])) {
            $this->setInfo('password', $file['password']);
        }

        $type_convert = $this->getTypeConvert();
        if (!$type_convert) {
            $this->setError('File is not supported');
        } else {
            $this->setInfo('type_convert', $type_convert);
            $this->setInfo('has_password', $this->checkPassword());

            $this->_parser = $this->getParser($type_convert);
            if (isset($option['tmp_dir_path'])) {
                $this->_parser->setTemporaryDir($option['tmp_dir_path']);
            } else {
                $tmp_dir = sys_get_temp_dir();
                $this->_parser->setTemporaryDir($tmp_dir);
            }
            $this->_parser->setFilePath($file_path);
        }
    }

    public function getTypeConvert()
    {
        $extension = strtolower($this->getInfo('extension'));
        foreach ($this->_file_types as $type => $extensions) {
            if (in_array($extension, $extensions)) {
                return $type;
            }
        }

        return false;
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function convert()
    {
        $type_convert = $this->getInfo('type_convert');
        if (!$type_convert) {
            return false;
        }

        if ($this->getInfo('has_password')) {
            if ($this->getInfo('password')) {

            } else {
                $this->setError('File has password but not provide password to convert');
                return false;
            }
        }

        $zip_tmp_path = '';
        if ($type_convert === self::CONVERT_TYPE_ZIP) {
            if ($zip_tmp_path = $this->scanAndAggregateSupportedFiles()) {
                $this->_parser->setFilePath($zip_tmp_path);
            } else {
                $this->setError('The zip file contains files that are not supported for conversion');
                return false;
            }
        }
        $isSuccessful = $this->_parser->run();
        $this->setError($this->_parser->getError());
        $this->setInfo('tmp_file_path', ($isSuccessful ? $this->_parser->getTmpFilePath() : ''));

        if (file_exists($zip_tmp_path)) {
            @unlink($zip_tmp_path);
        }

        $this->setIsConverted(true);
        return $isSuccessful;
    }

    private function checkPassword()
    {
        return Protection::checkFileEncryption($this->getInfo('file_path'), $this->getInfo('extension'));
    }

    /**
     * Scan file list in zip file
     * and synthesize the files that are supported to check
     * Compress all files into 1 zip file
     *
     *
     * Only files at level 1 . are supported
     *
     * Return FALSE - if the zip file does not have a support file
     *
     * Return STRING - temporary zip file path
     *
     * @return string
     * @throws \Exception
     */
    private function scanAndAggregateSupportedFiles()
    {
        $extension_collection = ArrayUtilities::flatten($this->_file_types);
        unset($extension_collection[array_search('zip', $extension_collection)]);
        if ($this->getInfo('tmp_dir_path')) {
            $tmp_zip_path = $this->getInfo('tmp_dir_path') . '/' . uniqid() . strtotime('now') . '.zip';
        } else {
            $tmp_zip_path = sys_get_temp_dir() . '/' . uniqid() . strtotime('now') . '.zip';
        }
        $option = [
            'password' => $this->getInfo('password'),
            'tmp_zip_path' => $tmp_zip_path,
            'extension_extract' => $extension_collection
        ];

        $unzip = new Unzip($option);
        $unzip->skipFileInFolder(true);
        $unzip->setFilePath($this->getInfo('file_path'));
        $extract_data = $unzip->extract();
        if ($extract_data) {
            $unzip->zip($tmp_zip_path, $extract_data);
            $unzip->deleteTmp();
            return $tmp_zip_path;
        }

        return false;
    }

    public function getInfo($key = null)
    {
        if ($key === null) return $this->_info;

        return isset($this->_info[$key]) ? $this->_info[$key] : false;
    }

    protected function setInfo($key, $value)
    {
        $this->_info[$key] = $value;
    }

    /**
     * Delete temporary folders and files
     */
    public function deleteTmpDirAndFile()
    {
        if ($this->_parser instanceof Parser\Base && $this->isConverted()) {
            System::deleteFile($this->_parser->getTmpFilePath());
        }
    }

    /**
     * @return \Policy\File\Parser\Base|bool
     * @throws \Exception
     */
    protected function getParser($type)
    {
        switch ($type) {
            case self::CONVERT_TYPE_TXT:
                return new KanjiConversionFilter();
            case self::CONVERT_TYPE_ZIP:
            case self::CONVERT_TYPE_NORMAL:
//                return new TikaApache($this->getInfo());
                return new KanjiConversionFilter();
            default:
                return false;
        }
    }

    public function setError($message)
    {
        if (!$message) return;

        $this->_is_error = true;
        $this->_errors[] = $message;
    }

    public function isError()
    {
        return $this->_is_error;
    }

    public function getError()
    {
        return $this->_errors;
    }

    /**
     * @return mixed
     */
    public function isConverted()
    {
        return $this->_is_converted;
    }

    /**
     * @param mixed $is_converted
     */
    protected function setIsConverted($is_converted)
    {
        $this->_is_converted = $is_converted;
    }
}

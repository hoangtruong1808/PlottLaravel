<?php

namespace Policy\File\Parser;

use Exception;
use ZipArchive;
use SplFileInfo;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;

class Zip
{
    public $hierarchy = 0;
    public $white_list = [];
    public $black_list = [];

    protected $_path;

    public function __construct($path, $tmp_dir)
    {

    }

    /**
     * @throws \Exception
     */
    function scan($callable = null)
    {
        $zip = new ZipArchive();
        $res = $zip->open($this->_path);
        if ($res !== TRUE) {
            throw new Exception('Unable to open ' . $this->_path);
        }

        $data = [];
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            //skip folder path example: .../directory_name/
            $is_directory = substr($filename, -1) == DIRECTORY_SEPARATOR;
            if ($is_directory) {
                continue;
            }

            if ($this->_getFileLevel($filename) < $this->hierarchy) {
                $path_parts = pathinfo($filename);
                if (!$this->_checkWhiteList($path_parts['extension'])) {
                    continue;
                }

                $data[] = $filename;
                if (is_callable($callable)) {
                    $callable($zip, $filename);
                }
            }
        }

        $zip->close();

        return $data;
    }

    protected function _checkWhiteList($extension)
    {
        if (empty($this->white_list)) {
            return true;
        }

        return in_array($extension, $this->white_list);
    }

    /**
     * @param string $filename
     * @return integer
     */
    protected function _getFileLevel($filename)
    {
        return substr_count($filename, DIRECTORY_SEPARATOR);
    }

    /**
     * @throws \Exception
     */
    public static function zipDirectoryDepth($directory_to_zip, $zip_name)
    {
        // Get real path for our folder
        $root_path = realpath($directory_to_zip);

        if ($root_path === false)
            throw new Exception('The directory path is not found');

        // Initialize archive object
        $zip = new ZipArchive();
        $zip->open($zip_name, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        // Create recursive directory iterator
        /** @var SplFileInfo[] $files */
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($root_path),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $name => $file) {
            // Skip directories (they would be added automatically)
            if (!$file->isDir()) {
                // Get real and relative path for current file
                $file_path = $file->getRealPath();
                $relative_path = substr($file_path, strlen($root_path) + 1);

                // Add current file to archive
                $zip->addFile($file_path, $relative_path);
            }
        }

        // Zip archive will be created only after closing object
        $zip->close();
    }
}

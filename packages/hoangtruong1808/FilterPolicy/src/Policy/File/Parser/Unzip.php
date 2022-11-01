<?php

namespace Policy\File\Parser;

use ZipArchive;
use Policy\Helpers\System;
use Policy\File\FileException;

/**
 * @link https://linux.die.net/man/1/7za
 */
class Unzip extends Base
{
    protected $_skip_file_in_folder = true;

    /**
     * @throws \Policy\File\FileException
     */
    public function __construct($option, $time_out = 3600)
    {
        parent::__construct($option, $time_out);

        if (!class_exists('ZipArchive'))
            throw new FileException('ZipArchive class is require');

        $dir_tmp = sys_get_temp_dir() . '/' . uniqid() . strtotime('now');

//        $dir_tmp = '/data/tmp/truong_zip/' . uniqid() . strtotime('now');

        $this->addOption('zip_tmp_dir_path', $dir_tmp);
        if (!mkdir($dir_tmp)) {
            throw new FileException('Can not create folder');
        }
    }

    /**
     * e Extract <br>
     * -p Set Password <br>
     * -o Set Output directory
     */
    public function setCommandLine()
    {
        $extension_extract = $this->getOption('extension_extract');
        $password = $this->getOption('password');
        $dir_structure = $this->scan($extension_extract);

        if (!$dir_structure) {
            return;
        }


        $file_to_allow = implode(' ', $dir_structure['file_allow_escape_shell']);
        $this->addOption('files_extract', $dir_structure);
        $dir_tmp = $this->getOption('zip_tmp_dir_path');

        $this->_cmd = sprintf(
            '7za e %s -p%s -o%s -y %s',
            escapeshellarg($this->_path),
            escapeshellarg($password),
            escapeshellarg($dir_tmp),
            $file_to_allow
        );
    }

    /**
     * @return bool
     * @throws \Policy\File\FileException
     */
    public function extract()
    {
        if ($this->getOption('password')) {
            if (parent::run()) {
                $result = $this->getOption('files_extract');
            } else {
                return false;
            }
        } else {
            $result = $this->scan($this->getOption('extension_extract'));
        }

        return $result['file_allow'];
    }

    public function scan($extension_extract)
    {
        $zip = new ZipArchive;
        $res = $zip->open($this->_path);
        $arr_file_allow = [];
        $arr_file_to_exclude = [];
        $file_allow_escape_shell = [];

        if ($res !== TRUE) return [];

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);

            if (substr($filename, -1) == '/') {
                $arr_file_to_exclude[] = escapeshellarg($filename . '*');
                continue; // skip directories
            }

            // only get the files in the first level
            if ($this->_skip_file_in_folder && count(explode('/', $filename)) > 1) {
                continue;
            }

            $fileInfo = pathinfo($filename);
            if (!empty($fileInfo['extension'])) {
                $current_extension = strtolower($fileInfo['extension']);

                if (!in_array($current_extension, $extension_extract)) {
                    $arr_file_to_exclude[] = ($filename);
                    continue;
                }
            }

            $zip->extractTo($this->getOption('zip_tmp_dir_path'), $filename);

            $arr_file_allow[] = $this->getOption('zip_tmp_dir_path') . '/' . $filename;
            $file_allow_escape_shell[] = escapeshellarg($filename);
        }

        $zip->close();
        return array(
            'file_allow' => $arr_file_allow,
            'file_to_exclude' => $arr_file_to_exclude,
            'file_allow_escape_shell' => $file_allow_escape_shell,
        );
    }

    public function skipFileInFolder($flag)
    {
        $this->_skip_file_in_folder = $flag;
    }

    /**
     * @param string $dir_path
     * @param array $files
     * @return bool
     */
    public function zip($dir_path, $files)
    {
        if (!$files) return false;

        $z = new ZipArchive();
        if ($z->open($dir_path, ZIPARCHIVE::CREATE) !== TRUE) {
            return false;
        }

        foreach ($files as $pa) {
            $z->addFile($pa);
        }

        $z->close();
        return true;
    }

    public function deleteTmp()
    {
        System::deleteDir($this->getOption('zip_tmp_dir_path'));
    }
}

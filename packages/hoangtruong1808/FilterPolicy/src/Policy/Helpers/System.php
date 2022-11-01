<?php
namespace Policy\Policy\Helpers;

final class System {
    /**
     * @return bool
     */
    public static function deleteDir($dir_path)
    {
        if (!is_dir($dir_path)) {
            return false;
        }

        if (substr($dir_path, strlen($dir_path) - 1, 1) != '/') {
            $dir_path .= '/';
        }

        $files = glob($dir_path . '*', GLOB_MARK);
        foreach ($files as $file) {
            if (is_dir($file)) {
                self::deleteDir($file);
            } else {
                @unlink($file);
            }
        }
        @rmdir($dir_path);
        return true;
    }

    public static function deleteFile($file_path)
    {
        @unlink($file_path);
    }
}

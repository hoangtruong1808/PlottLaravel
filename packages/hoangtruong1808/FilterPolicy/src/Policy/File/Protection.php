<?php

namespace Policy\Policy\File;

use Policy\File\Parser\TikaApache;
use Symfony\Component\Process\Process;

class Protection
{

    public static $extension_office_2007 = array(
        "xlsx", "xlsm", "xltx", "xltm", "docx", "doc", "docm", "dotx", "dotm", "pptx", "pptm",
        "ppsx", "ppsm", "vsdx", "vsdm", "vstx", "vstm",
    );

    /**
     *
     *
     * @link https://gist.github.com/rvanlaak/06ca1b65658a91240362
     * @param string $absolutePath
     * @return bool
     */
    public static function checkFileEncryption($absolutePath, $extension = null)
    {
        if (empty($extension)) {
            $path_parts = pathinfo($absolutePath);
            $extension = $path_parts['extension'];
        }

        $extension = strtolower($extension);

        if (in_array($extension, static::$extension_office_2007)) {
            return static::isOfficeEncryption($absolutePath);
        }

        if (in_array($extension, ['ppt', 'xls'])) {
            $tika = new TikaApache();
            return $tika->isEncryption($absolutePath);
        }

        if ($extension === 'pdf') {
            return static::isPdfEncryption($absolutePath);
        }

        if ($extension === 'zip') {
            return static::isZipEncryption($absolutePath);
        }

        return false;
    }

    /**
     * Check or the file is password protected based on the top file contents.
     *
     * Missing with ppt, xls
     *
     * @link https://gist.github.com/rvanlaak/06ca1b65658a91240362
     * @return bool
     */
    public static function isOfficeEncryption($absolutePath)
    {
        $content = utf8_encode(file_get_contents($absolutePath));
        if (mb_substr($content, 0, 2) == "ÐÏ") {

            // XLS 2003
            if (mb_substr($content, 0x208, 1) == "\x0FE") {
                return true;
            }

            // XLS 2005
            if (mb_substr($content, 0x214, 1) == "\x2F") {
                return true;
            }

            // DOC 2005-
            if (mb_substr($content, 0x20B, 1) == "\x13") {
                return true;
            }

            // DOCX/XLSX 2007+
            $start = str_replace("\x00", " ", mb_substr($content, 0, 2000));
            if (mb_strstr($start, 'E n c r y p t e d P a c k a g e') !== false) {
                return true;
            }

        }
        return false;
    }

    public static function isPdfEncryption($absolutePath)
    {
        $handle = fopen($absolutePath, "r");
        $contents = fread($handle, filesize($absolutePath));
        fclose($handle);

        return (bool)stristr($contents, "/Encrypt");
    }

    /**
     *  -i, --ignore-case         ignore case distinctions
     *  -c, --count               print only a count of matching lines per FILE
     * @link https://supportex.net/blog/2011/08/bash-check-zip-rar-file-password-protection/
     * @link https://stackoverflow.com/questions/56030206/is-there-a-way-to-check-if-a-zip-file-is-password-protected
     */
    public static function isZipEncryption($absolutePath)
    {
        $cmd = '7za l -slt ' . escapeshellarg($absolutePath) . ' | grep -i -c "Encrypted = +"';
        $process = new Process($cmd);
        $process->run();
        if ($process->isSuccessful()) {
            return (int)$process->getOutput() > 0;
        } else {
            return false;
        }
    }
}

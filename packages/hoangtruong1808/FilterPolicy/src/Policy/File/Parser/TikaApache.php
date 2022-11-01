<?php

namespace Policy\File\Parser;

use Exception;
use Policy\Policy\Logger;
use Symfony\Component\Process\Process;

class TikaApache extends Base
{
    public $library_path = '';

    /**
     * -x  or --xml           Output XHTML content (default)
     * -h  or --html          Output HTML content
     * -t  or --text          Output plain text content
     * -T  or --text-main     Output plain text content (main content only)
     * -m  or --metadata      Output only metadata
     * -j  or --json          Output metadata in JSON
    */
    const TIKA_OUTPUT_TEXT = 't';

    /**
     * @throws \Exception
     */
    public function __construct($option = null)
    {
        parent::__construct($option);
        $this->library_path = __DIR__ . '/library/tika-app-2.4.1.jar';
    }

    public function setCommandLine()
    {
        $password = $this->getOption('password');
        $file_type = self::TIKA_OUTPUT_TEXT;

        if (empty($password)) {
            $cmd = sprintf(
                "/usr/bin/java -jar %s -%s -e'UTF-8' %s > %s",
                $this->library_path,
                $file_type,
                escapeshellarg($this->_path),
                escapeshellarg($this->_tmp_file_path)
            );
        } else {
            $cmd = sprintf(
                "/usr/bin/java -jar %s -%s -e'UTF-8' -p%s %s > %s",
                $this->library_path,
                $file_type,
                escapeshellarg($password),
                escapeshellarg($this->_path),
                escapeshellarg($this->_tmp_file_path)
            );
        }

        $this->_cmd = $cmd;
    }

    public function isEncryption($absolutePath)
    {
        $cmd = sprintf(
            "/usr/bin/java -jar %s -%s -e'UTF-8' %s",
            $this->library_path,
            self::TIKA_OUTPUT_TEXT,
            escapeshellarg($absolutePath)
        );
        $this->_process->setCommandLine($cmd);
        $this->_process->run();

        if (!$this->_process->isSuccessful()) {
            $errors = $this->_process->getErrorOutput();
            $this->_errors = $errors;
            $file_has_password = 'org.apache.tika.exception.EncryptedDocumentException';
            preg_match("/$file_has_password/", $errors, $matches);
            return (bool)count($matches);
        }

        return true;
    }


}

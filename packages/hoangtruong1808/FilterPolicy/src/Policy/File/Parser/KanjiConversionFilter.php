<?php

namespace Policy\Policy\File\Parser;

/**
 *
 * Nkf is a yet another kanji code converter among networks, hosts and terminals. <br>
 * It converts input kanji code to designated kanji code such as ISO-2022-JP , Shift_JIS, EUC-JP , UTF-8 or UTF-16 .
 *
 * @link https://linux.die.net/man/1/nkf
 */
class KanjiConversionFilter extends Base
{
    public function __construct($option = null)
    {
        parent::__construct($option);
    }

    /**
     * -w Output code is UTF-8N
    */
    public function setCommandLine()
    {
//        $this->_cmd = sprintf(
//            'nkf -W %s > %s',
//            escapeshellarg($this->_path),
//            escapeshellarg($this->_tmp_file_path)
//        );
        $this->_cmd = sprintf(
            'echo a'
        );
        copy($this->_path, $this->_tmp_file_path);
    }
}

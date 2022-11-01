<?php

namespace Policy\Policy\Filter;

use Barryvdh\Debugbar\Facades\Debugbar;
use Policy\Policy\Main;
use Policy\Policy\File\Reader;

class FileChecker extends FilterHandler
{
    protected $_files = [];

    protected $_filters_not_apply_for_filename = [
        Main::FILTER_TYPE_FILE_SIZE,
        Main::FILTER_TYPE_FILE_WITH_PASSWORD,
    ];

    public function __construct($filter_options, $files, $total_file_size)
    {

        parent::__construct($filter_options);

        $this->_files = $files;
        $this->options->set('total_file_size', $total_file_size);
    }

    /**
     * @throws \Exception
     */
    public function scan()
    {

        if (!$this->_before()) {
            return false;
        }

        $check_type = $this->options->get('check_type');
        $total_size = $this->options->get('total_file_size');
        $file_data = $this->_files->getArrayCopy();
        $filter_options = $this->options->getArrayCopy();

        // checking file size is first
        if ($check_type == Main::FILTER_TYPE_FILE_SIZE) {
            Debugbar::info('File size checking...');
            Debugbar::info('$total_size: ' . $total_size);
            FileSize::setMin($this->options->get('min_capacity_transition'));
            FileSize::setMax($this->options->get('max_capacity_transition'));

            if (FileSize::isViolation($total_size)) {
                foreach ($file_data as $key => $file) {
                    $this->_addResult($key, ['content' => 1]);
                }
            }

            return [
                'is_violation' => count($this->_result) > 0,
                'detail_count_matches' => $this->_result,
            ];
        }

        $this->_createRegex($this->options['check_type'], $filter_options);

        /**@var $file \Policy\File\FileConvert */
        foreach ($file_data as $key => $file) {
            $basename = $file->getInfo('filename');
            Debugbar::info('FILE NAME: ' . $basename);
            $is_count_duplicate = !($this->options->get('match_pattern') == 0);

            $data_count = [];
            $_data_to_compare = [];
            if ($this->options->get('check_file_name')) {
                if (!in_array($check_type, $this->_filters_not_apply_for_filename)) {
                    $this->regex->setSubject($basename);
                    $filename_matches = $this->regex->getMatches($is_count_duplicate);
                    $count_filename = 0;
                    foreach ($filename_matches as $pattern => $array_matches) {
                        $count_filename += count($array_matches);
                        $_data_to_compare[$pattern] = isset($_data_to_compare[$pattern]) ?
                            array_merge($_data_to_compare[$pattern], $array_matches)
                            : $array_matches;
                    }
                    $data_count['filename'] = $count_filename;
                    Debugbar::info('checking filename: ' . $basename);
                    Debugbar::info('checking filename results: ' . json_encode(array_values($filename_matches)));
                }
            }

            if (!$file->isConverted()) {

                Debugbar::info('File converting...');
                Debugbar::info('File converting...');
                $file->convert();
            }

            $is_password = $file->getInfo('has_password');
            Debugbar::info('$is_password: ' . ($is_password ? 'C0' : 'Ko'));

            if ($is_password) {
                if ($check_type == Main::FILTER_TYPE_FILE_WITH_PASSWORD) {
                    $this->_addResult($key, ['filename' => 1, 'content' => 1,]);
                }

                // apply for checking filename with file has password
                if ($check_type != Main::FILTER_TYPE_FILE_WITH_PASSWORD) {
                    $data_check = $this->_checkFilterViolation($filter_options, ['file' => $_data_to_compare]);
                    $is_violation = $data_check['is_violation'];
                    if ($is_violation) {
                        $data_check['detail_count_matches'] = array_merge($data_check['detail_count_matches'], [
                            'filename' => isset($data_count['filename']) ? $data_count['filename'] : 0,
                            'content' => 0
                        ]);
                        $this->_addResult($key, $data_check['detail_count_matches']);
                    }
                }

                continue;
            }

            // If check type is password check but the file has no password
            // or convert file is error
            // then skip and check next type
            if ($check_type == Main::FILTER_TYPE_FILE_WITH_PASSWORD || $file->isError()) {
                Debugbar::info('FILE CONVERT ERROR: ' . json_encode($file->getError()));

                // apply for checking filename with file has password
                if ($check_type != Main::FILTER_TYPE_FILE_WITH_PASSWORD) {
                    $data_check = $this->_checkFilterViolation($filter_options, ['file' => $_data_to_compare]);
                    $is_violation = $data_check['is_violation'];
                    if ($is_violation) {
                        $data_check['detail_count_matches'] = array_merge($data_check['detail_count_matches'], [
                            'filename' => isset($data_count['filename']) ? $data_count['filename'] : 0,
                            'content' => 0
                        ]);
                        $this->_addResult($key, $data_check['detail_count_matches']);
                    }
                }

                continue;
            }

            // check file content
            Debugbar::info('check_data: ' . $this->options->get('check_data'));
            if ($this->options->get('check_data')) {
                $file_content_matched = $this->_checkContent($file->getInfo('tmp_file_path'), $is_count_duplicate);
                $count_content = 0;
                foreach ($file_content_matched as $pattern => $array_matches) {
                    $count_content += count($array_matches);
                    $_data_to_compare[$pattern] = isset($_data_to_compare[$pattern]) ?
                        array_merge($_data_to_compare[$pattern], $array_matches)
                        : $array_matches;
                }
                $data_count['content'] = $count_content;
                Debugbar::info('checking content results: ' . json_encode(array_values($file_content_matched)));
            }

            // violation checking filename and content
            $data_check = $this->_checkFilterViolation($filter_options, ['file' => $_data_to_compare]);
            $is_violation = $data_check['is_violation'];
            if ($is_violation) {
                $data_check['detail_count_matches'] = array_merge($data_check['detail_count_matches'], [
                    'filename' => isset($data_count['filename']) ? $data_count['filename'] : 0,
                    'content' => isset($data_count['content']) ? $data_count['content'] : 0
                ]);
                $this->_addResult($key, $data_check['detail_count_matches']);
            }

        }

        return [
            'is_violation' => count($this->_result) > 0,
            'detail_count_matches' => $this->_result,
        ];
    }

    /**
     * @throws \Exception
     */
    function scanNotCheckResult() {

        if (!$this->_before()) {
            return [
                'details' => [],
                'summarize' => [],
            ];
        }

        $check_type = $this->options->get('check_type');
        $total_size = $this->options->get('total_file_size');
        $file_data = $this->_files->getArrayCopy();
        $filter_options = $this->options->getArrayCopy();

        $data_collection = [];


        // checking file size is first
        if ($check_type == Main::FILTER_TYPE_FILE_SIZE) {
            Debugbar::info('File size checking... $total_size: ' . $total_size);
            FileSize::setMin($this->options->get('min_capacity_transition'));
            FileSize::setMax($this->options->get('max_capacity_transition'));
            $detail = [];
            if (FileSize::isViolation($total_size)) {
                foreach ($file_data as $key => $file) {
                    $detail[$key] = ['filter_size' => [1]];
                }
            }
            Debugbar::info('FileSize $detail: ' . json_encode($detail));
            return [
                'details' => $detail,
                'summarize' => $detail,
            ];
        }

        $this->_createRegex($this->options['check_type'], $filter_options);
        $is_count_duplicate = !($this->options->get('match_pattern') == 0);

        /**@var $file \Policy\File\FileConvert*/
        foreach ($file_data as $key => $file) {
            $basename = $file->getInfo('filename');
            Debugbar::info('FILE NAME: ' . $basename);

            $_data_to_compare = [];
            if ($this->options->get('check_file_name')) {
                if (!in_array($check_type, $this->_filters_not_apply_for_filename)) {
                    $this->regex->setSubject($basename);
                    $filename_matches = $this->regex->getMatches($is_count_duplicate);
                    $_data_to_compare = array_merge_recursive($_data_to_compare, $filename_matches);
                    Debugbar::info('checking filename: ' . $basename);
                    Debugbar::info($filename_matches);
                }
            }

            if (!$file->isConverted()) {
                Debugbar::info('File converting...');
                $file->convert();
                Debugbar::info($file);

            }

            $is_password = $file->getInfo('has_password');
            Debugbar::info('FILE HAS PASSWORD: ' . ($is_password ? 'YES': 'NO'));

            if ($is_password) {
                if ($check_type == Main::FILTER_TYPE_FILE_WITH_PASSWORD) {
                    $data_collection[$key] = ['filter_password' => [1]];
                }

                // apply for checking filename with file has password
                if ($check_type != Main::FILTER_TYPE_FILE_WITH_PASSWORD) {
                    if (!empty($_data_to_compare)) {
                        $data_collection[$key] = $_data_to_compare;
                    }
                }

                continue;
            }

            // If check type is password check but the file has no password
            // or convert file is error
            // then skip and check next type
            if ($check_type == Main::FILTER_TYPE_FILE_WITH_PASSWORD || $file->isError()) {
                $this->logger->error($file->getError());
                if (!empty($_data_to_compare)) {
                    $data_collection[$key] = $_data_to_compare;
                }
                continue;
            }

            // check file content
            Debugbar::info('check_data: ' . $this->options->get('check_data'));
            if ($this->options->get('check_data')) {
                $file_content_matched = $this->_checkContent($file->getInfo('tmp_file_path'), $is_count_duplicate);
                $_data_to_compare = array_merge_recursive($_data_to_compare, $file_content_matched);
                Debugbar::info('File content result');
                Debugbar::info($file_content_matched);
            }

            // violation checking filename and content
            if (!empty($_data_to_compare)) {
                $data_collection[$key] = $_data_to_compare;
            }
        }

        // merge filename and file_content
        $data_merger = [];
        foreach ($data_collection as $item) {
            $data_merger = array_merge_recursive($data_merger, $item);
        }

        return [
            'details' => $data_collection,
            'summarize' => $data_merger,
        ];
    }

    protected function _before()
    {
        if (!$this->_files->count()) return false;

        return true;
    }

    /**
     * @param string $tmp_file_path
     * @param int $is_count_duplicate
     * @return array
     */
    protected function _checkContent($tmp_file_path, $is_count_duplicate)
    {
        $regex = $this->regex;
        return Reader::readLineByLine(
            $tmp_file_path,
            function ($buffer) use ($is_count_duplicate, $regex) {
                $regex->setSubject($buffer);
                return $regex->getMatches($is_count_duplicate);
            }
        );
    }

    protected function _addResult($key, $data_check) {
        $this->_result[$key] = [
            'policy_name' => $this->options->get('policy_name'),
            'detail_matches' => $data_check
        ];
    }
}

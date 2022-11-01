<?php

namespace Policy\Policy;

use ArrayObject;
use Barryvdh\Debugbar\Facades\Debugbar;
use Policy\Policy\File\FileConvert;
use Policy\Policy\Filter\DataChecker;
use Policy\Policy\Filter\FileChecker;
use Policy\Policy\Filter\FilterHandler;

//include_once 'Policy/Process/vendor/autoload.php';

class Main
{

    /**
     * @var \ArrayObject
     */
    public $data;

    /**
     * Files to check policies
     * @var \ArrayObject
     */
    public $files;

    public $errors;
    public $logger;
    public $options;
    public $policies;
    public $middleware = [];

    public $_result = [];
    public $_violation_count = 0;
    public $_last_execution_method;

    const FILTER_TYPE_ALL = 0;
    const FILTER_TYPE_PHONE_NUMBER = 1;
    const FILTER_TYPE_CREDIT_CARD_NUMBER = 2;
    const FILTER_TYPE_EMAIL = 3;
    const FILTER_TYPE_ADDRESS = 4;
    const FILTER_TYPE_FILE_SIZE = 5;
    const FILTER_TYPE_KEYWORD = 7;
    const FILTER_TYPE_REGULAR_EXPRESSION = 8;
    const FILTER_TYPE_FILE_WITH_PASSWORD = 9;
    const FILTER_TYPE_INDIVIDUAL_NUMBER = 10;

    const JUDGMENT_CRITERIA_TYPE_ANY_FILTER_MATCHED = 0;
    const JUDGMENT_CRITERIA_TYPE_ALL_FILTER = 1;
    const JUDGMENT_CRITERIA_TYPE_CUSTOM_FILTER = 2;

    const POLICY_EXEC_TYPE_SEND = 0;
    const POLICY_EXEC_TYPE_HOLD = 1;
    const POLICY_EXEC_TYPE_NEXT = 2;
    const POLICY_EXEC_TYPE_REFUSE = 3;

    /**
     * @throws \Exception
     */
    public function __construct($options)
    {
        $this->data = new ArrayObject();
        $this->files = new ArrayObject();
        $this->policies = new ArrayObject();
        $this->middleware = new ArrayObject();

        $this->options = new Option($options);

        $this->logger = new Logger($this->options->get('log_dir_path'));
        $this->logger->isOn(true);
    }


    /**
     * setData
     *
     * @param array $data
     * @return void
     */
    public function setData($data)
    {
        $this->data = new ArrayObject($data);
    }

    /**
     * setFiles
     *
     * @param array $files
     * @return void
     * @throws \Exception
     */
    public function setFiles($files, $option = [])
    {
        $total_size = 0;
        foreach ($files as $key => $file) {
            $file_convert = new FileConvert($file, $option);
            $total_size += $file_convert->getInfo('size');
            $this->files->offsetSet($key, $file_convert);
        }

        $this->options->set('total_file_size', $total_size);
    }

    /**
     * setPolicies
     *
     * @param array $policies
     * @return void
     */
    public function setPolicies($policies)
    {
        $this->policies = new ArrayObject($policies);
    }



    /**
     * @return void
     */
    public function executeWithMerger()
    {

        $policies = $this->policies->getIterator();
        $result = [];

        foreach ($policies as $policy) {
            if (!$this->_checkMiddleware($policy)) {
                continue;
            }

            $_judgment_criteria = $policy['judgment_criteria'];
            $_min_weight = $policy['judgment_criteria_value'];
            $count_weight = 0;

            Debugbar::info('Policy name: ' . $policy['policy_list_name']);

            $filter_result = [];
            $filters = $this->_parseFilterData($policy['checkpoint']);
            Debugbar::info('$filters  ' . $policy['checkpoint']);

            foreach ($filters as $filter) {
                Debugbar::info('Filter name: ' . $filter['policy_name']);

                if ($filter['check_type'] == self::FILTER_TYPE_ALL) {
                    foreach ($this->data->getIterator() as $key => $value) {
                        $new_filter = $filter;
                        $new_filter['violated_count'] = 1;
                        $new_filter['detail_matches_count'] = 0;
                        $new_filter['filename_matches_count'] = 0;
                        $filter_result['data'][$key][] = $new_filter;
                    }
                    foreach ($this->files->getIterator() as $key => $value) {
                        $new_filter = $filter;
                        $new_filter['filename_matches_count'] = 1;
                        $new_filter['detail_matches_count'] = 1;
                        $new_filter['violated_count'] = 1;
                        $filter_result['files'][$key][] = $new_filter;
                    }

                    $this->_increasedViolation();
                    $count_weight += isset($filter['weight']) ? $filter['weight'] : 1;
                    if ($this->_canSkipTheNextFilter($_judgment_criteria, $count_weight, $_min_weight)) {
                        break;
                    }
                    continue;
                }

                $violation_data = $this->_scanWithMerger($filter);
                //summarize filter
                if ($violation_data['is_violation']) {
                    $detail_count_matches_data = $violation_data['details']['data'];
                    $detail_count_matches_files = $violation_data['details']['files'];
                    $this->_mapResult('data', $filter, $detail_count_matches_data, $filter_result);
                    $this->_mapResult('files', $filter, $detail_count_matches_files, $filter_result);
                    $count_weight += isset($filter['weight']) ? $filter['weight'] : 1;
                    $this->_increasedViolation();
                    if ($this->_canSkipTheNextFilter($_judgment_criteria, $count_weight, $_min_weight)) {
                        break;
                    }
                }
            } // end loop filters
            Debugbar::info('$filter_result');
            Debugbar::info($filter_result);
            $summarize = $this->_summarize(
                $filter_result,
                $policy['exec_type'],
                $_judgment_criteria,
                count($filters),
                $count_weight, $_min_weight
            );

            Debugbar::info(['Policy "' . strtoupper($policy['policy_list_name']) . '" IS VIOLATION: ' => $summarize['is_violation']]);
            if ($summarize['is_violation']) {
                $result[] = [
                    'filter_policy_list_id' => $policy['filter_policy_list_id'],
                    'policy_list_name' => $policy['policy_list_name'],
                    'result' => $filter_result
                ];

                // if violated -> check execute type of policy
                // if did not violate -> check the next policy
                if (!$summarize['can_check_next']) {
                    $this->_last_execution_method = $policy['exec_type'];
                    Debugbar::info('Can check next FALSE');
                    break;
                }
            }
            Debugbar::info('END ' . $policy['policy_list_name'] . PHP_EOL);
        }

        $is_remove_cache_file = $this->options->get('remove_cache_file');
        if ($is_remove_cache_file || $is_remove_cache_file == -1) {
            $this->_removeTemporaryFile();
        }

        $this->_result = $result;
        Debugbar::info('Result end check');
        Debugbar::info(json_encode($result));
        Debugbar::info(empty($result) ? 'NO VIOLATION': 'Last_execution_method: ' . $this->convertExecuteMethod($this->getLastExecutionMethod()));
        Debugbar::info('End Checking');
        Debugbar::info('==================================');
    }


    /**
     * getResult
     *
     * @return array
     * <pre>
     * array(
     *      'filter_policy_list_id' => '',
     *      'policy_list_name' => '',
     *      'result' => [
     *          'data' => [
     *              'mail_subject' => [],
     *              'mail_body' => [],
     *          ],
     *          'files' => [
     *              'file_key' => []
     *          ]
     *      ]
     * );
     * </pre>
     */
    public function getResult()
    {
        return $this->_result;
    }

    /**
     * @return bool
     */
    public function hasViolation()
    {
        return !empty($this->_result);
    }

    /**
     * @return string|int
    */
    public function getLastExecutionMethod()
    {
        return $this->_last_execution_method;
    }

    public function convertExecuteMethod($type)
    {
        $arr = ['POLICY_EXEC_TYPE_SEND', 'POLICY_EXEC_TYPE_HOLD', 'POLICY_EXEC_TYPE_NEXT', 'POLICY_EXEC_TYPE_REFUSE'];
        if (key_exists($type, $arr)) {
            return $arr[$type];
        }
        return 'Unknown ExecuteMethod';
    }

    /**
     * _checkMiddleware
     *
     * @return bool
     */
    protected function _checkMiddleware($data)
    {
        if (!$this->middleware->count()) {
            return true;
        }

        $checkers = $this->middleware->getIterator();
        foreach ($checkers as $key => $checker) {
            if (!$checker($data)) {
                Debugbar::info("Middleware checking $key: FALSE");
                Debugbar::info("Check next policy");
                return false;
            }
            Debugbar::info("Middleware checking $key: TRUE");
        }

        return true;
    }


    /**
     * _checkData
     * Search data
     * @return array
     */
    protected function _scanData($filter)
    {
        Debugbar::info('DATA CHECKER RESULT START', true);

        $data_checker = new DataChecker($filter, $this->data);
        $data_checker->logger = $this->logger;
        $result_check = $data_checker->scan();

        Debugbar::info(json_encode($result_check));
        Debugbar::info('DATA CHECKER RESULT END', true);


        if (!$result_check) {
            return [
                'is_violation' => false,
                'detail_count_matches' => [],
            ];
        }

        return $result_check;
    }

    /**
     * _checkFiles
     *
     * @return array|false
     * @throws \Exception
     */
    protected function _scanFiles($filter)
    {
        if (!$this->files->count()) return false;

        $total_size = $this->options->get('total_file_size');
        $file_checker = new FileChecker($filter, $this->files, $total_size);
        $file_checker->logger = $this->logger;
        $result_check = $file_checker->scan();
        Debugbar::info('FILE CHECKER RESULT START');
        Debugbar::info(json_encode($result_check));
        Debugbar::info('FILE CHECKER RESULT END');

        return $result_check;
    }

    /**
     * @param int $judgment_criteria
     * @param int $weight
     * @param int $min_weight
     * @return bool
     */
    protected function _canSkipTheNextFilter($judgment_criteria, $weight, $min_weight)
    {
        if ($judgment_criteria == self::JUDGMENT_CRITERIA_TYPE_CUSTOM_FILTER) {
            if ($weight >= $min_weight) {
                return true;
            }
        } elseif ($judgment_criteria == self::JUDGMENT_CRITERIA_TYPE_ANY_FILTER_MATCHED) {
            return true;
        }
        return false;
    }

    /**
     * Check the policy is violated or not and get the execute method
     *
     *
     * @param array $result
     * @param int $policy_exec_type
     * @param int $judgment_criteria
     * <ul>
     * <li>JUDGMENT_CRITERIA_TYPE_ANY_FILTER_MATCHED => Just one violation policy</li>
     * <li>JUDGMENT_CRITERIA_TYPE_ALL_FILTER         => All policies must be violated</li>
     * <li>JUDGMENT_CRITERIA_TYPE_CUSTOM_FILTER      => Filters that violate the policy will be cumulative</li>
     * </ul>
     *
     * @param int $filters_count
     * @param int $weight
     *
     * If judgment_criteria = JUDGMENT_CRITERIA_TYPE_CUSTOM_FILTER
     * Filters that violate the policy will be accumulated based on this parameter
     *
     * @param int $min_weight
     * @return array['is_violation' => true|false, 'can_check_next' => true|false]
     */
    protected function _summarize($result, $policy_exec_type, $judgment_criteria, $filters_count, $weight, $min_weight)
    {
        $can_check_next = '';
        $is_violation = false;
        switch ($judgment_criteria) {
            case self::JUDGMENT_CRITERIA_TYPE_ANY_FILTER_MATCHED:
                $is_violation = count($result) > 0;
                break;
            case self::JUDGMENT_CRITERIA_TYPE_ALL_FILTER:
                if ($this->_violation_count >= $filters_count) {
                    $is_violation = true;
                }

                Debugbar::info('_violation_count: ' . $this->_violation_count);
                Debugbar::info('_filters_count: ' . $filters_count);

                break;
            case self::JUDGMENT_CRITERIA_TYPE_CUSTOM_FILTER:
                $is_violation = $weight >= $min_weight;
                break;
        }

        /**
         * After finishing the test
         * If the policy under test is VIOLATED
         * Base on $policy_exec_type to determine the next job
         * Case $policy_exec_type = 0 => Transmission - Do not check the next policy,
         * If exec_type = 1 => Hold - Do not check the next policy, objects will be retained
         * If exec_type = 2 => Next Policy - Check the next policy regardless ò whether a violation occurs or not
         * If exec_type = 3 => Reject - Do not check the next policy, objects will be rejected
         */
        if ($is_violation) {
            switch ($policy_exec_type) {
                case self::POLICY_EXEC_TYPE_SEND:
                case self::POLICY_EXEC_TYPE_HOLD:
                case self::POLICY_EXEC_TYPE_REFUSE:
                    $can_check_next = false;
                    break;
                case self::POLICY_EXEC_TYPE_NEXT:
                    $can_check_next = true;
                    break;
            }
        }

        return [
            'is_violation' => $is_violation,
            'can_check_next' => $can_check_next,
        ];
    }

    /**
     * Count the number of filters with policy violations
     * @param int $count
     * @return void
     */
    protected function _increasedViolation($count = 1)
    {
        $this->_violation_count += $count;
    }

    /**
     * Delete the cache file created when converting the file to txt
     * @return void
     */
    protected function _removeTemporaryFile()
    {
        $files = $this->files->getArrayCopy();

        /**
         * @var $file FileConvert
         */
        foreach ($files as $file) {
            if ($file->isConverted()) {
                $file->deleteTmpDirAndFile();
            }
        }
    }

    /**
     * Determining whether the policy is in violation is based on the
     * combined results of the DATA results and the FILES results.
     * @todo checking DATA
     * @todo checking FILES
     * @todo merging DATA + FILES
     * @todo checking violation after merger
     *
     * @param array $filter
     * @return array
    */
    protected function _scanWithMerger($filter)
    {
        try {
            Debugbar::info('_scanWithMerger START');

            $data_checker = new DataChecker($filter, $this->data);
            $data_checker->logger = $this->logger;
            $result_check_data = $data_checker->scanWithMerger();

            $total_size = $this->options->get('total_file_size');
            $file_checker = new FileChecker($filter, $this->files, $total_size);
            $file_checker->logger = $this->logger;

            $result_check_files = $file_checker->scanNotCheckResult();
            Debugbar::info('DATA result');
            Debugbar::info($result_check_data);

            Debugbar::info('FILES result');
            Debugbar::info($result_check_files);

            $merge_data_and_files = array_merge_recursive($result_check_data['summarize'], $result_check_files['summarize']);
            Debugbar::info('MERGER DATA AND FILE');
            Debugbar::info((['total' => $merge_data_and_files]));
            $result_final = FilterHandler::checkFilterViolation($filter, ['total' => $merge_data_and_files], $this->logger);

            $result_final['details'] = [
                'data' => $result_check_data['details'],
                'files' => $result_check_files['details']
            ];

            Debugbar::info('RESULT FINAL');
            Debugbar::info($result_final);
            Debugbar::info('_scanWithMerger END ');
        } catch (\Exception $e) {
            $result_final = [
                'is_violation' => false,
                'detail_count_matches' => 0,
                'details' => null,
            ];
            Debugbar::error($e->getMessage());
        }


        return $result_final;
    }

    protected function _mapResult($key_map, $filter, $data_map, &$data_effect)
    {
        $is_count_duplicate = $this->_isCountDuplicate($filter);
        Debugbar::info('$data_map');
        Debugbar::info($data_map);
        foreach ($data_map as $index => $value) {
            $violated_count = array_reduce(array_values($value), function ($carry, $item) use ($is_count_duplicate) {
                if (!$is_count_duplicate) {
                    $item = array_unique($item);
                }
                $carry += count($item);
                return $carry;
            }, 0);
            $filter['filename_matches_count'] = 0;
            $filter['detail_matches_count'] = 0;
            $filter['violated_count'] = $violated_count;
            $data_effect[$key_map][$index][] = $filter;
        }
    }

    protected function _isCountDuplicate($filter)
    {
        if (!isset($filter['match_pattern'])) return false;

        return !($filter['match_pattern'] == 0);
    }

    /**
     * Get filters array list from policy
     *
     * @param string|array $filters
     * Return array if $filters is array or json is valid, otherwise return []
     *
     * @return array
    */
    protected function _parseFilterData($filters) {
        if (is_array($filters)) {
            return $filters;
        }

        if (is_string($filters)) {
            $json = json_decode($filters, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $json;
            } else {
                Debugbar::error('FILTER DATA IS INVALID JSON: ' . json_last_error_msg());
            }
        }

        return [];
    }
}

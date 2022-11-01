<?php

namespace Policy;
use Barryvdh\Debugbar\Facades\Debugbar;
use Policy\Policy\Logger;
use Policy\Policy\Main;


class FilterPolicy extends Main
{
    const WAIT_APPROVED_FILE_STATUS = 1;
    const APPROVED_FILE_STATUS = 2;
    const DISAPPROVED_FILE_STATUS = 3;

    protected $_tmp_dir_path = __DIR__.'\File\tmp_file';

    /**
     * @throws \Exception
     */
    public function __construct()
    {
    }

    public function setData($data)
    {
        $options = [
            'log_dir_path' => $this->_tmp_dir_path,
        ];

        parent::__construct($options);

        $this->_init($data);
    }

    /**
     * @throws \Exception
     */
    private function _init($data)
    {
//        $this->logger->setMode(Logger::LOGGER_DEBUG);

        $files = $data['files'];

        $login_data = $data['login_data'];
        $tmp_dir_upload_path = $data['tmp_dir_upload_path'];

        $data_validate = [
            'user_mail' => $login_data['user_mail'],
            'login_code' => $login_data['login_code'],
        ];
        Debugbar::info('$data_validate: ' . json_encode($data_validate));
        Debugbar::info('files base: ' . json_encode($files));

        // make tmp dir
        if (!is_dir($this->_tmp_dir_path)) {
            if (!mkdir($this->_tmp_dir_path, 0777, true)) {
                throw new Exception('Can not create log dir');
            }
        }

        $this->options->set('remove_cache_file', true);
        $this->setPolicies($this->_getPolicies());
        $this->setFiles($this->getFilesAdapter($files, $tmp_dir_upload_path),
            [
                'tmp_dir_path' => $this->_tmp_dir_path,
                'merge_file_option' => true,
            ]
        );


        $this->middleware->offsetSet('isFromUserMatched', function ($policy) use ($data_validate) {
            //check user
            $policy_from_user = $policy['from_user'];
            if (strlen(preg_replace('/\s+/u', '', $policy_from_user)) == 0) {
                Debugbar::info('Policy From User is empty. Check all user');
                return true;
            }

            $user_mail = $data_validate['user_mail'];
            $login_code = $data_validate['login_code'];

            $policy_from_user_string = preg_replace('/\r\n/', ',', $policy_from_user);
            $policy_from_user_array = explode(',', $policy_from_user_string);

            foreach ($policy_from_user_array as $key => $policy_from_user_value) {
                if (strlen(preg_replace('/\s+/u', '', $policy_from_user_value)) == 0) {
                    continue;
                }
                $policy_from_user_value = trim($policy_from_user_value);
                $policy_from_user_array[$key] = $policy_from_user_value;
                if ($policy_from_user_value == $user_mail || $policy_from_user_value == $login_code) {
                    return true;
                }
            }
            return false;
        });


    }

    private function _getPolicies()
    {
        $data = [];
        $list = \App\Models\Policy::orderBy('rank')->get()->toArray();
        foreach ($list as $item) {
            $item['policy_list_name'] = $item['filter_policy_list_name'];
            $data[] = $item;
        }

        return $data;
    }

    /**
     * Since the temporary file has no file extension,
     * it is necessary to copy the file to a temporary directory and use this file to check the policy.
     *
     * @throws \Exception
     *
     */
    public function getFilesAdapter($files, $tmp_dir_upload_path)
    {
        $files_adapter = [];
        foreach ($files as $key => $file_info) {
            $path_parts = pathinfo($file_info['file_name']);
            $tmp_file_path = $tmp_dir_upload_path . basename($file_info['tmp_name']);
            $files_adapter[$key] = array_merge($path_parts, [
                'size' => filesize($tmp_file_path),
                'file_path' => $tmp_file_path,
            ]);
        }

        return $files_adapter;
    }

    public function getResultAdapter()
    {
        $result = $this->getResult();
        if (!$result) {
            return [];
        }

        Debugbar::info('JSON RESULT:'.json_encode($result));

        $data_collection = [];
        $data_origin = $this->data->getArrayCopy();
        foreach ($data_origin as $data_key => $res) {
            // loop policy
            foreach ($result as $policy_res) {
                $filter_policy_list_id = $policy_res['filter_policy_list_id'];
                $policy_list_name = $policy_res['policy_list_name'];
                $_result = $policy_res['result'];
                if (!isset($_result['data']) || !count($_result['data'])) continue;
                $log_tmp = [];
                // loop data
                foreach ($_result['data'] as $res_key => $detail) {
                    if ($data_key == $res_key) {
                        $log_tmp = $detail;
                    }
                }

                if (!$log_tmp) continue;

                $data_collection[$data_key][] = [
                    'filter_policy_list_id' => $filter_policy_list_id,
                    'filter_policy_list_name' => $policy_list_name,
                    'detail_matches' => $log_tmp
                ];
            }
        }

        $_files = $this->files->getArrayCopy();
        $file_collection = [];
        foreach ($_files as $key => $f) {
            $p_collect = [];
            foreach ($result as $policy_res) {
                $filter_policy_list_id = $policy_res['filter_policy_list_id'];
                $policy_list_name = $policy_res['policy_list_name'];
                $_result = $policy_res['result'];

                if (!isset($_result['files']) || !count($_result['files'])) continue;

                $policy_files = $_result['files'];
                $detail_matches = [];
                if ($policy_files) {
                    foreach ($policy_files as $file_key => $file_detail) {
                        if ($key != $file_key) continue;

                        $detail_matches = $file_detail;
                    }
                }

                if (!$detail_matches) continue;

                $p_collect[] = [
                    'filter_policy_list_id' => $filter_policy_list_id,
                    'filter_policy_list_name' => $policy_list_name,
                    'detail_matches' => $detail_matches
                ];
            }

            if ($p_collect) {
                $file_collection[$key] = $p_collect;
            }
        }

        $final_result = [
            'files' => $file_collection,
            'data' => $data_collection
        ];

        Debugbar::info('Result: ' . json_encode($final_result));
        return $final_result;
    }

    /**
     * We have 4 policy execute type:
     * <li>POLICY_EXEC_TYPE_REFUSE</li>
     * <li>DISAPPROVED_FILE_STATUS</li>
     * <li>POLICY_EXEC_TYPE_HOLD</li>
     * <li>POLICY_EXEC_TYPE_NEXT</li>
     * <br>
     * In there 2 type need to change approval status:
     * <li><b>POLICY_EXEC_TYPE_REFUSE</b></li>
     * <li><b>DISAPPROVED_FILE_STATUS</b></li>
     *
     * @return int
     */
    public function getApprovalStatus($policy_execution_method)
    {
        if ($policy_execution_method == Main::POLICY_EXEC_TYPE_REFUSE) {
            return self::DISAPPROVED_FILE_STATUS;
        } else {
            return self::WAIT_APPROVED_FILE_STATUS;
        }
    }
}

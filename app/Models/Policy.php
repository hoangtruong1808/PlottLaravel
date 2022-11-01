<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Policy extends Model
{
    const REVOKE_FLAG_TYPE_NOT_DELETED  = 0;
    const JUDGMENT_CRITERIA_2 = 2;

    const JUDGMENT_CRITERIA = 2;
    const CHECK_TYPE_PHONE_NUMBER = 1;
    const CHECK_TYPE_CREDIT_CARD_NUMBER= 2;
    const CHECK_TYPE_MAIL_ADDRESS = 3;
    const CHECK_TYPE_ADDRESS = 4;
    const CHECK_TYPE_INDIVIDUAL_NUMBER = 10;
    const CHECK_TYPE_KEY_WORD = 7;
    const CHECK_TYPE_REGULAR = 8;
    const CHECK_TYPE_FILE_SIZE= 5;
    const CHECK_PASSWORD = 9;
    const MAX_VALUE_LENGTH = 100;
    const MIN_VALUE_LENGTH = 0;
    const CHECK_ALL = 0;
    const JUDGMENT_CRITERIA_WEIGHT = 2;
    const CHECK_TYPE_KEYWORD = 7;
    const CHECK_TYPE_REGULAR_EXPRESSION = 8;

    use HasFactory, SoftDeletes;

    public $timestamps = false;

    protected $table = 'tbl_filter_policy';

    protected $fillable = [
        'filter_policy_list_id',
        'filter_policy_list_name',
        'from_user',
        'from_auth_group',
        'project_id',
        'rank',
        'exec_type',
        'judgment_criteria',
        'judgment_criteria_value',
        'checkpoint',
    ];

    protected $primaryKey = 'filter_policy_list_id';

    public function generateCheckpointData($data, $check_point_list_name)
    {
        $checkpoint = array();
        $checkpoint['check_type'] = $data['check_type'];
        $checkpoint['policy_name'] = $check_point_list_name[$data['check_type']];
        if (isset($data['weight'])){
            $checkpoint['weight'] =  $data['weight'];
        }

        switch($data['check_type']){
            case self::CHECK_TYPE_FILE_SIZE:
                $checkpoint['min_capacity_transition'] = $data['min_capacity_transition'];
                $checkpoint['max_capacity_transition'] = $data['max_capacity_transition'];
                $checkpoint['match_pattern'] = $data['match_pattern'];
                break;

            case self::CHECK_TYPE_KEY_WORD:
                $checkpoint['condition_and_or'] = $data['andor'];
                $checkpoint['match_count'] = $data['match_count'];
                $checkpoint['match_pattern'] = $data['match_pattern'];
                $checkpoint['check_data'] = isset($data['data']) ? $data['data'] : 0;
                $checkpoint['check_file_name'] = isset($data['file_name']) ? $data['file_name'] : 0;
                $checkpoint['keyword_data'] = $data['keyword'];
                break;
            case self::CHECK_TYPE_REGULAR:
                $checkpoint['pattern'] = $data['pattern'];
                $checkpoint['match_count'] = $data['match_count'];
                $checkpoint['match_pattern'] = $data['match_pattern'];
                $checkpoint['check_data'] = isset($data['data']) ? $data['data'] : 0;
                $checkpoint['check_message'] = isset($data['msg']) ? $data['msg'] : 0;
                break;

            case self::CHECK_PASSWORD:
            case self::CHECK_ALL:
                break;
            default:
                $checkpoint['match_count'] = isset($data['match_count'])?$data['match_count']: 0;
                $checkpoint['match_pattern'] = isset($data['match_pattern'])?$data['match_pattern']:0;
                $checkpoint['check_data'] = isset($data['data']) ? $data['data'] : 0;
                $checkpoint['check_file_name'] = isset($data['file_name']) ? $data['file_name'] : 0;
        }
        return $checkpoint;
    }
}

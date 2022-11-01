<?php

namespace App\Http\Controllers;

use App\Http\Requests\PolicyRequest;
use App\Models\Policy;
use App\Models\Role;
use App\Models\User;
use Barryvdh\Debugbar\Facades\Debugbar;
use Doctrine\DBAL\Exception;
//use Policy\FilterPolicy;
use FilterPolicy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Response;
use Symfony\Component\Routing\Matcher\RedirectableUrlMatcher;

class TestPolicyController extends Controller
{
    public function __construct()
    {
    }

    public function index()
    {
        $count_policy = Policy::all()->count();
        return response()->view('filter-policy/index', [
            'title' => 'Danh sách bộ lọc',
            'count_policy' => $count_policy,
        ]);
    }

    public function getAllJson(Policy $policy_model)
    {
        $policy_list = Policy::orderBy('rank')->get()->toArray();
        echo json_encode($policy_list);
        die;
    }

    public function create(Request $request, Policy $policy_model)
    {
        $select_check_points = $this->getCheckTypeArray();
        return view('filter-policy/create')->with([
            'title' => 'Tạo bộ lọc mới',
            'select_check_points' =>  $select_check_points,
        ]);
    }

    public function store(PolicyRequest $request, Policy $policy_model)
    {
        try {
            $judgment_criteria_value = NULL;
            if ($request->judgment_criteria == "2") {
                $judgment_criteria_value = $request->judgment_criteria_value;
            }
            foreach ($request->check_point as $key => $value) {
                $check_point[] = $policy_model->generateCheckpointData($value, $this->getCheckTypeArray());
            }
            $check_point_json = json_encode($check_point);
            $policy_data = [
                "filter_policy_list_name" => $request->filter_policy_list_name,
                "from_user" => $request->from_user,
                "exec_type" => $request->exec_type,
                "judgment_criteria" => $request->judgment_criteria,
                "judgment_criteria_value" => $judgment_criteria_value,
                "checkpoint" => $check_point_json,
                "rank" => Policy::max('rank') + 1,
            ];
            if(Policy::create($policy_data)) {
                $data['status'] = 'success';
                $data['message'] = 'Thêm policy thành công';
            }
            else {
                $data['status'] = 'fail';
            }
            Debugbar::info('abc');
        }
        catch(\Exception $e) {
            $data['status'] = 'fail';
            var_dump($e->getMessage());
        }
        return Response::json($data);
    }

    public function edit($policy_id)
    {
        $policy = Policy::findOrFail($policy_id)->toArray();
        $title = 'Cập nhật bộ lọc';
        $code = $policy_id;
        $select_check_points = $this->getCheckTypeArray();
        //Check user permission with "allow" method, You may authorize multiple actions at a time using the "any" or "none" methods
        return view('filter-policy/create', compact('policy', 'title', 'code', 'select_check_points'));

    }

    public function update(PolicyRequest $request, Policy $policy_model)
    {
        try {
            $judgment_criteria_value = NULL;
            if ($request->judgment_criteria == 2) {
                $judgment_criteria_value = $request->judgment_criteria_value;
            }
            foreach ($request->check_point as $key => $value) {
                $check_point[] = $policy_model->generateCheckpointData($value, $this->getCheckTypeArray());
            }
            $check_point_json = json_encode($check_point);
            $policy_data = [
                "filter_policy_list_name" => $request->filter_policy_list_name,
                "from_user" => $request->from_user,
                "exec_type" => $request->exec_type,
                "judgment_criteria" => $request->judgment_criteria,
                "judgment_criteria_value" => $judgment_criteria_value,
                "checkpoint" => $check_point_json,
            ];
            if(Policy::where('filter_policy_list_id', $request->id)->update($policy_data)) {
                $data['status'] = 'success';
                $data['message'] = 'Thêm policy thành công';
            }
            else {
                $data['status'] = 'fail';
            }
        }
        catch(\Exception $e) {
            $data['status'] = 'fail';
            var_dump($e->getMessage());
        }
        return Response::json($data);
    }

    public function updateRank() {

        $status = false;
        $type = $_GET["type"];
        $id = $_GET["id"];

        $list_policy = Policy::all()->toArray();

        $max_rank = Policy::max('rank');
        $policy = Policy::where('filter_policy_list_id', $id)->first()->toArray();

        if ($policy) {
            if ($type == "up") {
                $rank = $policy["rank"] - 1;
            } else {
                if ($policy["exec_type"] == 2) {
                    if ($policy["rank"] >= $max_rank) {
                        $status = false;
                    }
                }
                $rank = $policy["rank"] + 1;
            }

            $next_policy = Policy::where('rank', $rank)->first()->toArray();
            if ($next_policy["exec_type"] == 2 && $type == "up"
                && $next_policy["rank"] == $max_rank
            ) {
                $status = false;
            }

            $rtn1 = Policy::where('filter_policy_list_id', $id)->update(["rank" => $rank]);
            $rtn2 = Policy::where('filter_policy_list_id', $next_policy["filter_policy_list_id"])->update(["rank" => $policy['rank']]);

            if ($rtn1 && $rtn2) {
                $status = true;
            } else {
                $status = false;
            }
        } else {
            $status = false;
        }
        return response()->json(
            ['status' => $status]
        );
    }

    public function destroy($policy_id, Policy $policy_model)
    {
        try {
            $policy = Policy::where('filter_policy_list_id', '=', $policy_id)->first()->toArray();
            $rank = $policy['rank'];
            Policy::where('rank', '>' , $rank)->decrement('rank',1);
            $policy_destroy = Policy::where('filter_policy_list_id', '=', $policy_id)->delete();
            if ($policy_destroy) {
                $data['status'] = 'success';
            }
            else {
                $data['status'] = 'fail';
            }
        }
        catch(\Exception $e) {
            dd($e->getMessage());
            $data['status'] = 'fail';
        }
        return Response::json($data);
    }

    public function testFacade() {
        dd(TestPackage::demoFacadeMethod());
    }

    public function check_file_view()
    {
        try {
            return view('filter-policy/detail')->with([
                'title' => "Kiểm tra file",
            ]);


        }
        catch (PloException $e) {
            var_dump($e->getMessage());
        }
    }

    public function check_file(Request $request) {
        $status = 'fail';
        $html = '';
        $tmp_path = "file_tmp/";
        $files = $request->file('file');
        $file_data = array();
        if ($files) {
            try {
                foreach ($files as $key => $file) {

                    $tmp_name = basename($file->getFilename(), ".tmp") . "." . $file->getClientOriginalExtension();
                    $file_name = $file->getClientOriginalName();
                    $file->move($tmp_path, "$tmp_name");
                    $file_data[$key]['file_name'] = $file_name;
                    $file_data[$key]['tmp_name'] = $tmp_name;
                }

                $policy_data = [
                    'files' => $file_data,
                    'login_data' => [
                        'user_mail' => Auth::user()->email,
                        'login_code' => Auth::user()->username,
                    ],
                    'tmp_dir_upload_path' => public_path() . "/" . $tmp_path,
                ];
                FilterPolicy::setData($policy_data);
                FilterPolicy::executeWithMerger();

                foreach ($file_data as $key => $file) {
                    @unlink(public_path() . "/" . $tmp_path . $file['tmp_name']);
                }
            }
            catch (Exception $e) {
                $html = 'Có lỗi xảy ra';
            }

            $status = 'success';
            $html = view('filter-policy/result', compact('file_data'))->render();
        }
        else {
            $html = '<b style="color:red">Không tìm thấy file</b>';
        }
        return response()->json([
            'status' => $status,
            'html'  => $html,
        ]);
    }

    public function getCheckTypeArray() {
        return [
            0 => 'Tất cả',
            1 => 'Số điện thoại',
            2 => 'Thẻ tín dụng',
            3 => 'Ðịa chỉ email',
            4 => 'Địa chỉ',
            10 => 'Số cá nhân',
            5 => 'Kích thước tập tin',
            7 => 'Từ khóa',
            8 => 'Biểu thức chính quy',
            9 => 'Tệp có mật khẩu',
        ];
    }
}

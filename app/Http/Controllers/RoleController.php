<?php

namespace App\Http\Controllers;

use App\Models\User;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Response;
use App\Models\Role;
use App\Http\Requests\RoleRequest;
use Illuminate\Http\Request;


class RoleController extends Controller
{
    private $role_permission_array;

    public function __construct()
    {
        $this->role_permission_array = Config::get('define.role_permission');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Role $role_model)
    {
        $this->authorize('view', $role_model);
        $role_list = Role::orderBy('id')->get()->toArray();
        foreach ($role_list as $role_key => $role_value) {
            $user_count = count(Role::findOrFail($role_value['id'])->user);
            $role_list[$role_key]['user_count'] = $user_count;
        }
        DebugBar::info($role_list);
        return response()->view('roles/index', [
            'title' => 'Danh sách quyền',
            'role_list' => $role_list,
            'role_permission' => $this->role_permission_array,
            'role_model' => $role_model,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Role $role_model)
    {
        $this->authorize('create', $role_model);
        $validator = $this->dataValidate($request->all());

        if ($validator->passes()) {
            try {
                $role_data = [
                    "name" => $request->name,
                    "permission" => json_encode($request->role_permission),
                ];
//                dd($role_data);
                if (Role::create($role_data)) {
                    $data['status'] = 'success';
                    $data['message'] = 'Thêm tài khoản thành công';
                } else {
                    $data['status'] = 'fail';
                }
            } catch (\Exception $e) {
                $data['status'] = 'fail';
                var_dump($e->getMessage());
            }
        }
        else {
            $data['status'] = 'error';
            $data['error'] = $validator->errors()->getMessages();
        }
        return Response::json($data);
    }


    public function detail($role_id, Role $role_model)
    {
        $this->authorize('view', $role_model);
        $role_detail = Role::findOrFail($role_id)->toArray();
        $role_permission_detail = json_decode($role_detail['permission']);
        $role_user_list = Role::findOrFail($role_id)->user;

        return view('roles/detail')->with([
            'title' => 'Chi tiết quyền',
            'role_detail' => $role_detail,
            'role_permission_detail' => $role_permission_detail,
            'role_permission_array' => $this->role_permission_array,
            'role_user_list' => $role_user_list,
            'role_model' => $role_model,
        ]);;
    }


    public function edit($role_id, Role $role_model)
    {
        $this->authorize('update', $role_model);
        $role = Role::findOrFail($role_id)->toArray();
        return response()->json($role);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Role $role)
    {
        $this->authorize('update', $role);
        $validator = $this->dataValidate($request->all());

        if ($validator->passes()) {
            try {
                $role_data = [
                    "name" => $request->name,
                    "permission" => json_encode($request->role_permission),
                ];

                if (Role::where('id', $request->id)->update($role_data)) {
                    $data['status'] = 'success';
                    $data['message'] = 'Cập nhật thành công';
                } else {
                    $data['status'] = 'fail';
                }
            } catch (\Exception $e) {
                $data['status'] = 'fail';
                var_dump($e->getMessage());
            }
        }
        else {
            $data['status'] = 'error';
            $data['error'] = $validator->errors()->getMessages();
        }
        return Response::json($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy($role_id,  Role $role_model)
    {
        $this->authorize('delete', $role_model);

        try {
            if (count(Role::find($role_id)->user) == 0) {
                Role::where('id', '=', $role_id)->delete();
            }
            else {
                var_dump('không được xóa role có user');
            }
        }
        catch(\Exception $e) {
            $data['status'] = 'fail';
        }
        return Redirect::to(route('role_show'));
    }

    public function dataValidate($data) {
        $messages = [
            'name.required' => 'Vui lòng nhập tên quyền',
            'role_permission.required' => 'Vui lòng chọn cài đặt',
        ];

        $validator = Validator::make($data, [
            'name' => 'required',
//            'role_permission' => 'required',
        ], $messages);

        return $validator;
    }

}

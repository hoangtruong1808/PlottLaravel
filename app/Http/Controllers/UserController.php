<?php

namespace App\Http\Controllers;

use App\Library\TestFacade;
use App\Library\TestFacadeClass;
use App\Models\Role;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Storage;
use Response;
use App\Models\User;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use TestPackage;

class UserController extends Controller
{
    public function __construct()
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(User $account)
    {
        $this->authorize('view', $account);
        $name_cookie = cookie('name', 'hoangtruong', 30);
        DebugBar::info($name_cookie);
        return response()->view('users/index', [
            'title' => 'Danh sách người dùng',
        ]);
    }

    public function getAllJson(User $account)
    {
        $this->authorize('view', $account);
        $user_list = User::all()->toArray();
        echo json_encode($user_list);
        die;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, User $account)
    {
        $this->authorize('create', $account);
        $name  = $request->cookie('name');
        $role = Role::where('active', '=', '1')->get();

        DebugBar::info($name);
        return view('users/create')->with([
            'title' => 'Tạo người dùng',
            'name'  => $name,
            'role'  => $role,
        ]);;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request, User $account)
    {
        $this->authorize('create', $account);
        try {
            if ($request->file('avatar')) {
                $avatar = $request->file('avatar')->getClientOriginalName();
                $request->file('avatar')->storeAs('public/avatar', $avatar);
            }
            else {
                $avatar = 'admin2.jpg';
            }
            $user_data = [
                "username" => $request->username,
                "password" => bcrypt($request->password),
                "fullname" => $request->fullname,
                "email" => $request->email,
                "status" => $request->status,
                "phone" => $request->phone,
                "avatar" => $avatar,
                "roles" => $request->roles,
            ];
            if(User::create($user_data)) {
                $data['status'] = 'success';
                $data['message'] = 'Thêm tài khoản thành công';
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

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit($user_id, User $account)
    {
        $this->authorize('update', $account);

        $account = User::findOrFail($user_id);
        $user = $account->toArray();
        $title = 'Cập nhật tài khoản';
        $code = $user['id'];
        $role = Role::where('active', '=', '1')->get();


        //Check user permission with "allow" method, You may authorize multiple actions at a time using the "any" or "none" methods
        if (Gate::allows('edit-user', $account)) {
            return view('users/create', compact('user', 'title', 'code', 'role'));
        } else {
            echo "Ban khong co quyen chinh sua user này";
        }


    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UserRequest $request, User $account)
    {
        $this->authorize('update', $account);

        //$this->authorize('update', $request);
        try {
            $user_data = [
                "username" => $request->username,
                "password" => bcrypt($request->password),
                "fullname" => $request->fullname,
                "email" => $request->email,
                "status" => $request->status,
                "phone" => $request->phone,
                "roles" => $request->roles,
            ];
            if ($request->file('avatar')) {
                $avatar = $request->file('avatar')->getClientOriginalName();
                $request->file('avatar')->storeAs('public/avatar', $avatar);
                $user_data["avatar"] = $avatar;
            }
            if ($request->password) {
                $user_data["password"] = bcrypt($request->password);
            }
            if(User::where('id', $request->id)->update($user_data)) {
                $data['status'] = 'success';
                $data['message'] = 'Cập nhật tài khoản thành công';
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy($user_id, User $account)
    {
        $this->authorize('delete', $account);
        try {
            $user_destroy = User::where('id', '=', $user_id)->delete();
            if ($user_destroy) {
                $data['status'] = 'success';
            }
            else {
                $data['status'] = 'fail';
            }
        }
        catch(\Exception $e) {
            $data['status'] = 'fail';
        }
        return Response::json($data);
    }

    public function testFacade() {
        dd(TestPackage::demoFacadeMethod());
    }

//Topic
//Should Vietnam have more public holidays or longer holidays? Why? Give your opinion and
//support it with reasons and examples taken from your reading, experience, or observations.

}

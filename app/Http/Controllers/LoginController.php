<?php

namespace App\Http\Controllers;

use App\Library\LDAP\Ldap;
use App\Models\User;
use App\Providers\TestServiceProvider;
use Barryvdh\Debugbar\Facades\Debugbar;
use DB;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use LdapRecord\Connection;
use Validator;

const NORMAL_ACCOUNT_TYPE = 0;
const LDAP_ACCOUNT_TYPE = 1;

class LoginController extends Controller
{
    public function __construct()
    {
    }

    public function index()
    {
        //Debugbar::info($connection->auth()->attempt('n-truong', '3VjAun5FjQM4CPg'));
        Debugbar::error('Test Debugbar error message');
        Debugbar::warning('Test Debugbar warning message');
        Debugbar::addMessage('Another message', 'mylabel');
        if(Auth::check())  {
            header("Location: ". route('user_show'));
            exit();
        }

        return view('login/index')->with([
            'title' => 'Đăng nhập',
        ]);
    }

    public function exec_login(Request $request)
    {
        Debugbar::error('Logining');
        $validator = $this->dataValidate($request->all());

        if ($validator->passes()) {
            if (Auth::attempt($request->only('username', 'password'))) {
                var_dump('abc');
                return Redirect::to('/user');
            } else {
                $error[] = "Mật khẩu hoặc tên người dùng không đúng";
                return Redirect::back()->withErrors($error);
            }
        }
        else {
            $error = $validator->errors()->all();
            return Redirect::back()->withErrors($error);
        }
    }

    public function dataValidate($data) {
        $messages = [
            'username.required' => 'Vui lòng nhập tên người dùng',
            'password.required' => 'Vui lòng nhập mật khẩu',
        ];

        $validator = Validator::make($data, [
            'username' => 'required',
            'password' => 'required',
        ], $messages);

        return $validator;
    }

    public function logout(){
        Auth::logout();
        return Redirect::to('/login');
        Session::flush();
        return Redirect::to('/login');
    }

    public function exec_login2(Request $request)
    {
        $validator = $this->dataValidate($request->all());

        if ($validator->passes()) {
            $username = $request->username;
            $password = $request->password;

            if($request->account_type == LDAP_ACCOUNT_TYPE) {
                dd($username, $password);
            }
            else {
                $account = User::where([
                    ['username', '=', $username],
                    ['ldap', '=', 0],
                ])->first();

                if ($account) {
                    if (Hash::check($password, $account->password))
                    {
                        Session::put('account', $account);
                        return Redirect::to(route('user_show'));
                    }
                    else {
                        $error[] = "Mật khẩu hoặc tên người dùng không đúng";
                        return Redirect::back()->withErrors($error);
                    }
                }
                else {
                    $error[] = "Mật khẩu hoặc tên người dùng không đúng";
                    return Redirect::back()->withErrors($error);
                }
            }
        }
        else {
            $error = $validator->errors()->all();
            return Redirect::back()->withErrors($error);
        }

    }
    //
}

//2C 3B 4A 5B 6B 7C 8D 9D 10B 15C 17C 18A 19D/A 20D 21 22 23c 24
//A/ B/ C/ D D/ A/ C D/

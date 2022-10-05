<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use DB;

class LoginController extends Controller
{
    public function index()
    {
        return view('login/index')->with([
            'title' => 'Đăng nhập',
        ]);
    }
    public function exec_login(Request $request)
    {
        var_dump($request);
        var_dump('abc');
        die;
    }
}

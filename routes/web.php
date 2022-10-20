<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/login', [LoginController::class, 'index']) -> name('login');
Route::post('/exec_login', [LoginController::class, 'exec_login']) -> name('exec_login');
Route::get('/logout', [LoginController::class, 'logout']) -> name('logout');

Route::middleware('auth')->group(function(){
    Route::prefix('/user')->group(function(){
        Route::get('/', [UserController::class, 'index'])->name('user_show');
        Route::get('/get-all-json', [UserController::class, 'getAllJson'])->name('user_get_json');
        Route::get('/create', [UserController::class, 'create'])->name('user_create');
        Route::post('/store', [UserController::class, 'store'])->name('user_store');
        Route::get('/edit/{user_id}', [UserController::class, 'edit'])->name('user_edit');
        Route::post('/get', [UserController::class, 'update'])->name('user_update');
        Route::get('/test-facade', [UserController::class, 'testFacade'])->name('test_facade');
        Route::get('/destroy/{user_id}', [UserController::class, 'destroy'])->name('user_destroy');
    });

    Route::prefix('/role')->group(function(){
        Route::get('/', [RoleController::class, 'index'])->name('role_show');
        Route::get('/detail/{role_id}', [RoleController::class, 'detail'])->name('role_detail');
        Route::post('/store', [RoleController::class, 'store'])->name('role_store');
        Route::get('/edit/{role_id}', [RoleController::class, 'edit'])->name('role_edit');
        Route::post('/get', [RoleController::class, 'update'])->name('role_update');
        Route::get('/destroy/{role_id}', [RoleController::class, 'destroy'])->name('role_destroy');
    });
});







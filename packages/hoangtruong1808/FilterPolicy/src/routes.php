<?php

use Illuminate\Support\Facades\Route;
use Policy\Http\Controllers\PolicyController;

Route::get('testabc', function() {
        echo 'abc';
    }
);

//Route::middleware('auth')->group(function(){
    Route::prefix('/filter-policy')->group(function() {
        Route::get('/check_file', [PolicyController::class, 'check_file_view'])->name('check_file_view');
        Route::post('/check_file', [PolicyController::class, 'check_file'])->name('policy_check_file');
        Route::get('/', [PolicyController::class, 'index'])->name('policy_show');
        Route::get('/get-all-json', [PolicyController::class, 'getAllJson'])->name('policy_get_json');
        Route::get('/create', [PolicyController::class, 'create'])->name('policy_create');
        Route::post('/store', [PolicyController::class, 'store'])->name('policy_store');
        Route::get('/edit/{policy_id}', [PolicyController::class, 'edit'])->name('policy_edit');
        Route::post('/get', [PolicyController::class, 'update'])->name('policy_update');
        Route::get('/update-rank', [PolicyController::class, 'updateRank'])->name('policy_update_rank');
        Route::get('/destroy/{policy_id}', [PolicyController::class, 'destroy'])->name('policy_destroy');
    });
//});

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_filter_policy', function (Blueprint $table) {
            $table->increments('filter_policy_list_id');
            $table->string('filter_policy_list_name')->nullable();
            $table->string('from_user')->nullable();
            $table->string('from_auth_group')->nullable();
            $table->string('from_company')->nullable();
            $table->string('project_id')->nullable();
            $table->smallInteger('rank')->nullable();
            $table->smallInteger('exec_type')->nullable();
            $table->smallInteger('judgment_criteria')->nullable();
            $table->smallInteger('judgment_criteria_value')->nullable();
            $table->json('checkpoint')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_filter_policy');
    }
};

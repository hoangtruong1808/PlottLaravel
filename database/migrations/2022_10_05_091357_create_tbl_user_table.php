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
        Schema::create('tbl_user', function (Blueprint $table) {
            $table->increments('id');
            $table->string('fullname', 55)->nullable();
            $table->string('username', 35)->nullable();
            $table->string('password', 100)->nullable();
            $table->string('phone', 10)->nullable();
            $table->string('email', 55)->nullable();
            $table->string('avatar', 255)->nullable();
            $table->timestamp('create_at')->nullable();
            $table->timestamp('update_at')->nullable();
            $table->smallInteger('status');
            $table->smallInteger('ldap')->default(0);
            $table->smallInteger('roles')->nullable()->default(1);
            $table->smallInteger('flag')->nullable()->default(0);
            $table->string('ldap_name', 55)->nullable();
//            $table->smallInteger('is_delete')->nullable()->default(0);
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
        Schema::dropIfExists('tbl_user');
    }
};

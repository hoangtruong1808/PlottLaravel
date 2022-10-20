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
        Schema::table('tbl_role', function (Blueprint $table) {
            $table->json('permission')->nullable();
            $table->smallInteger('active')->nullable()->default(1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tbl_role', function (Blueprint $table) {
            $table->dropColumn('permission');
            $table->dropColumn('active');
        });
    }
};

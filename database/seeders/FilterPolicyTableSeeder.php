<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FilterPolicyTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tbl_filter_policy')->insert(
            ['filter_policy_list_name' => 'Policy_name', 'from_user' => '0001', 'from_auth_group' => '0001', 'from_company' => '0001', 'project_id' => '0001', 'rank' => 1, 'exec_type'=>1, 'judgment_criteria'=>1, 'checkpoint' => '[{"check_type":"0","policy_name":"All"}]']
        );
    }
}

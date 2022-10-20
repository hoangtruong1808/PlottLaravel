<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('tbl_user')->insert(
            [
//                ['fullname' => 'Nguyễn Hoàng Trường', 'username' => 'n-truong@plott.local', 'password'=>'', 'phone' => '0704804311', 'email' => 'n-truong@plott.co.jp', 'avatar' => 'n-truong@plott.local.jpg', 'create_at' => '2022-03-10 11:04:23', 'update_at' => '2022-03-10 11:04:23', 'status' => 1, 'ldap' => 1],
                ['fullname' => 'Admin', 'username' => 'admin', 'password' => '$2y$10$4xGL0oVwQjsQGj7NrTNvLel4JcNaXLsbPRTWAgrnLR2tPdqcmPAR2', 'phone' => '0123456789', 'email' => 'admin@gmail.com', 'avatar' => 'admin.png', 'create_at'=>'2022-03-10 11:04:23', 'update_at'=>'2022-03-10 11:04:23', 'status' => 1, 'roles' => 0]
            ]
        );
    }
}

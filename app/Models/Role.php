<?php

namespace App\Models;

use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;

    protected $table = 'tbl_role';

    protected $fillable = [
        'id',
        'name',
        'permission',
        'active'
    ];

    public function user()
    {
        return $this->hasMany(User::class, 'roles');
    }

    public function havePermission($type_permission, $user_role)
    {
        $role_detail = $this->find($user_role)->toArray();
        $role_permission = json_decode($role_detail['permission']);

        return isset($role_permission->role_management->$type_permission) && $role_permission->role_management->$type_permission == 1;
    }

}

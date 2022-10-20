<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'tbl_user';

    protected $fillable = [
        'fullname',
        'username',
        'password',
        'phone',
        'email',
        'avatar',
        'status',
        'ldap',
        'orders',
        'roles',
        'flag',
        'ldap_name'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    const CREATED_AT = 'create_at';
    const UPDATED_AT = 'update_at';

    public function roles_func()
    {
        return $this->belongsTo(Role::class, 'id');
    }
    public function isAdmin()
    {
        return ($this->roles == 1);
    }
    public function havePermission($type_permission)
    {
        $role = new Role();
        $role_detail = $role->find($this->roles)->toArray();
        $role_permission = json_decode($role_detail['permission']);
        Debugbar::info($role_detail);
        return isset($role_permission->user_management->$type_permission) && $role_permission->user_management->$type_permission == 1;
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'tbl_vacation';

    protected $fillable = [
        'id',
        'user_id',
        'reason',
        'vacation_date',
    ];
}

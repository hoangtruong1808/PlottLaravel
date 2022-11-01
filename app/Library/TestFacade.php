<?php
namespace App\Library;
use Illuminate\Support\Facades\Facade;

class TestFacade extends Facade
{
    protected static function getFacadeAccessor() {
        return 'demofacade1';
    }
}

?>

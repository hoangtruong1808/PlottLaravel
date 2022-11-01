<?php
namespace Hoangtruong1808\Test;
use Illuminate\Support\Facades\Facade;

class TestFacade extends Facade
{
    protected static function getFacadeAccessor() {
        return 'TestFacade';
    }
}

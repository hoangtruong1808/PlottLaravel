<?php
namespace Policy;
use Illuminate\Support\Facades\Facade;

class PolicyFacade extends Facade
{
    protected static function getFacadeAccessor() {
        return 'FilterPolicy';
    }
}

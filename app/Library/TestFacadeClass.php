<?php
namespace App\Library;

class TestFacadeClass
{
    protected $value = 0;
    private $variable;

    public function demoFacadeMethod()
    {
        return 'This is custome Facade demo';
    }

    public function hello(){
        return 'abc';
    }

    public function setVariable($variable) {
//        $variableContainer = app('demofacade1');

        $this->variable = $variable;

        return $this->variable;
    }

    public function getVariable() {
        return  $this->variable;
    }

    public function getVariableContainer() {
        return app('demofacade1')->getVariable();
    }
    public function increase()
    {
        $this->value++;

        return $this->value;
    }
    /**
    “It is suggested that first grade teachers should evaluate their students by giving them verbal
    comments instead of grades, and should not criticize or compare their students in any situation
    or for any reasons.”
     **/
}
?>

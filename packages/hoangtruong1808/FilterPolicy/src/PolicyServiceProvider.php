<?php

namespace Policy;

use Illuminate\Support\ServiceProvider;

class PolicyServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('FilterPolicy',  FilterPolicy::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__.'/routes.php');
        $this->loadMigrationsFrom(__DIR__.'/Database/migration');
        $this->loadViewsFrom(__DIR__.'/resources/view', 'Policy');
    }
}

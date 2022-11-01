<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit8715880ecfa6b137f859ef077d472ac7
{
    public static $prefixLengthsPsr4 = array (
        'N' => 
        array (
            'NTruong\\Test\\' => 13,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'NTruong\\Test\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit8715880ecfa6b137f859ef077d472ac7::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit8715880ecfa6b137f859ef077d472ac7::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit8715880ecfa6b137f859ef077d472ac7::$classMap;

        }, null, ClassLoader::class);
    }
}

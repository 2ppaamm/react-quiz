<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInit0bd0c934c2f9d448f62abd243f2d9b66
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        require __DIR__ . '/platform_check.php';

        spl_autoload_register(array('ComposerAutoloaderInit0bd0c934c2f9d448f62abd243f2d9b66', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInit0bd0c934c2f9d448f62abd243f2d9b66', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        \Composer\Autoload\ComposerStaticInit0bd0c934c2f9d448f62abd243f2d9b66::getInitializer($loader)();

        $loader->register(true);

        return $loader;
    }
}

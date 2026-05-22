<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown if a callback refers to an undefined method or if some arguments are missing.
 * @internal
 */
class BadMethodCallException extends Exception implements ExceptionInterface
{
    protected static string $logLevel = Psr\Log\LogLevel::CRITICAL;
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Bad method call';
    }
}

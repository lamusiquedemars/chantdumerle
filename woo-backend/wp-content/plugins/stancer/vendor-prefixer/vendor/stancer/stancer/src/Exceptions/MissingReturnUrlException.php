<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown when no return URL was setted and an operation needs it.
 * @internal
 */
class MissingReturnUrlException extends BadMethodCallException implements ExceptionInterface
{
    protected static string $logLevel = Psr\Log\LogLevel::CRITICAL;
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'You must provide a return URL.';
    }
}

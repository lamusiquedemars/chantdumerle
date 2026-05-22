<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown if an argument is not of the expected type.
 * @internal
 */
class InvalidArgumentException extends Exception implements ExceptionInterface
{
    protected static string $logLevel = Psr\Log\LogLevel::NOTICE;
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Invalid argument';
    }
}

<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown to indicate range errors during program execution.
 * @internal
 */
class RangeException extends Exception implements ExceptionInterface
{
    protected static string $logLevel = Psr\Log\LogLevel::NOTICE;
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Range error';
    }
}

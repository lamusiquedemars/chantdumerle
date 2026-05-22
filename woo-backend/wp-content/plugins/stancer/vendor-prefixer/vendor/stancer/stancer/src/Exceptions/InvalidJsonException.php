<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exeption thrown if we try to parse bad json.
 * @internal
 */
class InvalidJsonException extends InvalidArgumentException implements ExceptionInterface
{
    protected static string $logLevel = Psr\Log\LogLevel::DEBUG;
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Invalid json metadata.';
    }
}

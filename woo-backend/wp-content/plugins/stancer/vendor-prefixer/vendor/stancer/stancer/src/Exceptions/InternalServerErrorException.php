<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * An unexpected condition was encountered and no more specific message is suitable.
 *
 * This represent an 500 HTTP return on the API.
 * @internal
 */
class InternalServerErrorException extends ServerException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Internal Server Error';
    protected static string $logLevel = Psr\Log\LogLevel::CRITICAL;
    protected static string $status = '500';
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Server error, please leave a minute to repair it and try again';
    }
}

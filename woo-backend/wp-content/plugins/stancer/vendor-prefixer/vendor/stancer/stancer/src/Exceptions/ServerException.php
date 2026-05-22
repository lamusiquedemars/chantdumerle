<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown for 500 level errors.
 * @internal
 */
class ServerException extends HttpException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Server error';
    protected static string $logLevel = Psr\Log\LogLevel::CRITICAL;
    protected static string $status = '5xx';
}

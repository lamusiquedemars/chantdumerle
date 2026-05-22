<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown for 300 level errors.
 * @internal
 */
class RedirectionException extends HttpException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Redirection';
    protected static string $logLevel = Psr\Log\LogLevel::WARNING;
    protected static string $status = '3xx';
}

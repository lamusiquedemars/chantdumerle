<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown when too many redirects are followed.
 *
 * This represent an 310 HTTP return on the API.
 * @internal
 */
class TooManyRedirectsException extends RedirectionException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Too Many Redirection';
    protected static string $logLevel = Psr\Log\LogLevel::CRITICAL;
    protected static string $status = '310';
}

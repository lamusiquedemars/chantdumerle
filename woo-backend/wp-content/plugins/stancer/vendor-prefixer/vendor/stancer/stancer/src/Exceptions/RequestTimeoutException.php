<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * The server timed out waiting for the request.
 *
 * This represent an 408 HTTP return on the API.
 * @internal
 */
class RequestTimeoutException extends ClientException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Request Timeout';
    protected static string $logLevel = Psr\Log\LogLevel::ERROR;
    protected static string $status = '408';
}

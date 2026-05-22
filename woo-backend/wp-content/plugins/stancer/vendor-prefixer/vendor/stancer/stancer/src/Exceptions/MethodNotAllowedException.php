<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * A request method is not supported for the requested resource.
 *
 * This represent an 405 HTTP return on the API.
 * @internal
 */
class MethodNotAllowedException extends ClientException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Method Not Allowed';
    protected static string $logLevel = Psr\Log\LogLevel::CRITICAL;
    protected static string $status = '405';
}

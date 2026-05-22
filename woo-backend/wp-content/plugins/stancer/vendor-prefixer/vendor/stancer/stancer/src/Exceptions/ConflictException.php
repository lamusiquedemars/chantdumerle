<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * The request could not be completed due to a conflict with the current state of the target resource.
 *
 * This represent an 409 HTTP return on the API.
 * @internal
 */
class ConflictException extends ClientException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Conflict';
    protected static string $logLevel = Psr\Log\LogLevel::ERROR;
    protected static string $status = '409';
}

<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * The request was valid, but the server is refusing action.
 *
 * This represent an 403 HTTP return on the API.
 * @internal
 */
class ForbiddenException extends ClientException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Forbidden';
    protected static string $logLevel = Psr\Log\LogLevel::ERROR;
    protected static string $status = '403';
}

<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * The server cannot or will not process the request due to something that is perceived to be a client error.
 *
 * This represent an 400 HTTP return on the API.
 * @internal
 */
class BadRequestException extends ClientException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Bad Request';
    protected static string $logLevel = Psr\Log\LogLevel::CRITICAL;
    protected static string $status = '400';
}

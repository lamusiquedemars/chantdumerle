<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Indicates that the resource requested is no longer available and will not be available again.
 *
 * This represent an 410 HTTP return on the API.
 * @internal
 */
class GoneException extends ClientException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Gone';
    protected static string $logLevel = Psr\Log\LogLevel::ERROR;
    protected static string $status = '410';
}

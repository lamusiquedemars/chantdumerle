<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * The client must first authenticate itself with a proxy.
 *
 * This represent an 407 HTTP return.
 * @internal
 */
class ProxyAuthenticationRequiredException extends ClientException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Proxy Authentication Required';
    protected static string $logLevel = Psr\Log\LogLevel::ERROR;
    protected static string $status = '407';
}

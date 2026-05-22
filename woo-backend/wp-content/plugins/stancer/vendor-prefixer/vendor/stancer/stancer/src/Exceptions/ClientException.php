<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown for 400 level errors.
 * @internal
 */
class ClientException extends HttpException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Client error';
    protected static string $logLevel = Psr\Log\LogLevel::ERROR;
    protected static string $status = '4xx';
}

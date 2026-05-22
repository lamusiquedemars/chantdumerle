<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * The requested resource is capable of generating only content not acceptable according to the Accept headers.
 *
 * This represent an 406 HTTP return.
 * @internal
 */
class NotAcceptableException extends ClientException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Not Acceptable';
    protected static string $logLevel = Psr\Log\LogLevel::ERROR;
    protected static string $status = '406';
}

<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Indicates that the resource requested is locked and needs some payment.
 *
 * This is not used in API.
 *
 * This represent an 402 HTTP return.
 * @internal
 */
class PaymentRequiredException extends ClientException implements ExceptionInterface
{
    protected static string $defaultMessage = 'Payment Required';
    protected static string $logLevel = Psr\Log\LogLevel::ERROR;
    protected static string $status = '402';
}

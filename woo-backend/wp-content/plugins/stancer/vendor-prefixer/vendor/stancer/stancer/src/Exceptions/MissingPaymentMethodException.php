<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Psr;
use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown when no payment method was setted before a pay tentative.
 * @internal
 */
class MissingPaymentMethodException extends BadMethodCallException implements ExceptionInterface
{
    protected static string $logLevel = Psr\Log\LogLevel::ERROR;
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'You must provide a valid credit card or SEPA account to make a payment.';
    }
}

<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown on miss-validation with expiration year.
 * @internal
 */
class InvalidExpirationYearException extends InvalidExpirationException implements ExceptionInterface
{
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Expiration year is invalid.';
    }
}

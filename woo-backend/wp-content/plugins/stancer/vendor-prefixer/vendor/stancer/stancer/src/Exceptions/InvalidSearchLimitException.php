<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown on invalid search limit.
 * @internal
 */
class InvalidSearchLimitException extends InvalidArgumentException implements ExceptionInterface
{
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Limit must be between 1 and 100.';
    }
}

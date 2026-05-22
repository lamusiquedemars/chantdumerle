<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

use Stancer\Scoped\Isolated\Stancer\Interfaces\ExceptionInterface;
/**
 * Exception thrown on invalid search start.
 * @internal
 */
class InvalidSearchStartException extends InvalidArgumentException implements ExceptionInterface
{
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Start must be a positive integer.';
    }
}

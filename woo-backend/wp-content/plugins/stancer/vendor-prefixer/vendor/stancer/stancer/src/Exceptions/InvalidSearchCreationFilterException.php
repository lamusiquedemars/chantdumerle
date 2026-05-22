<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

/**
 * Exception thrown on invalid search creation date.
 * @internal
 */
class InvalidSearchCreationFilterException extends InvalidSearchFilterException
{
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Created must be a positive integer or a DateTime object and must be in the past.';
    }
}

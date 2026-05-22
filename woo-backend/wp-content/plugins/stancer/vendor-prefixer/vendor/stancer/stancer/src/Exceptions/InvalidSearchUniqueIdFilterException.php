<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Exceptions;

/**
 * Exception thrown on invalid search unique id.
 * @internal
 */
class InvalidSearchUniqueIdFilterException extends InvalidSearchFilterException
{
    /**
     * Return default message for that kind of exception.
     */
    public static function getDefaultMessage() : string
    {
        return 'Invalid unique ID.';
    }
}

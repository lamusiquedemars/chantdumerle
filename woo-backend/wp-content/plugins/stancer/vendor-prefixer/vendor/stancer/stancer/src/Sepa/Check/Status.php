<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Sepa\Check;

/**
 * List of a sepa check status.
 * @internal
 */
enum Status : string
{
    case AVAILABLE = 'available';
    case CHECKED = 'checked';
    case ERROR = 'check_error';
    case SENT = 'check_sent';
    case UNAVAILABLE = 'unavailable';
}

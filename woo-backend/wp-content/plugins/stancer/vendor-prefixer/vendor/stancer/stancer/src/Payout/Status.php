<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Payout;

/**
 * List of a payout status.
 * @internal
 */
enum Status : string
{
    case FAILED = 'failed';
    case PAID = 'paid';
    case PENDING = 'pending';
    case SENT = 'sent';
    case TO_PAY = 'to_pay';
}

<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Payment;

use Stancer\Scoped\Isolated\Stancer\Traits\CapturableTrait;
/**
 * List of a payment status.
 * @internal
 */
enum Status : string
{
    use CapturableTrait;
    case AUTHORIZE = 'authorize';
    case AUTHORIZED = 'authorized';
    case CANCELED = 'canceled';
    case CAPTURE = 'capture';
    case CAPTURE_SENT = 'capture_sent';
    case CAPTURED = 'captured';
    case DISPUTED = 'disputed';
    case EXPIRED = 'expired';
    case FAILED = 'failed';
    case REFUSED = 'refused';
    case TO_CAPTURE = 'to_capture';
}

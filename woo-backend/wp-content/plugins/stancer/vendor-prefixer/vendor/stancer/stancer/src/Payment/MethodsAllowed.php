<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Payment;

/**
 * List of a payment methods allowed.
 * @internal
 */
enum MethodsAllowed : string
{
    case CARD = 'card';
    case SEPA = 'sepa';
}

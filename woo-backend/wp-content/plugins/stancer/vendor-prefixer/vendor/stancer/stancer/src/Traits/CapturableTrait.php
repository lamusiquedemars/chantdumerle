<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Traits;

/**
 * Simple trait to handle everything around amounts.
 * @internal
 */
trait CapturableTrait
{
    /**
     * Return a boolean telling if the payment is capturable.
     *
     * @return boolean
     */
    public function isCapturable() : bool
    {
        return $this === static::AUTHORIZED;
    }
}

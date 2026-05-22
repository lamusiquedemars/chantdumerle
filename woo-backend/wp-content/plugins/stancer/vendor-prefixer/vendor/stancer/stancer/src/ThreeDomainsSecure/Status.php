<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\ThreeDomainsSecure;

/**
 * List of a 3-D Secure status.
 * @internal
 */
enum Status : string
{
    case NONE = 'none';
    case REQUIRED = 'required';
}

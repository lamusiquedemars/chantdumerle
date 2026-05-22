<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated\Stancer\Http\Verb;

/**
 * HTTP GET.
 * @internal
 */
class Get extends AbstractVerb
{
    protected bool $isAllowed = \true;
}

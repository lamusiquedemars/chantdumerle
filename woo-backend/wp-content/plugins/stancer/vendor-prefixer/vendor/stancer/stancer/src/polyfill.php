<?php

declare (strict_types=1);
namespace Stancer\Scoped\Isolated;

if (!\class_exists('SensitiveParameter')) {
    /** @internal */
    #[\Attribute(\Attribute::TARGET_PARAMETER)]
    final class SensitiveParameter
    {
    }
}
if (!\class_exists('Stancer\\Scoped\\Isolated\\Override')) {
    /** @internal */
    #[\Attribute(\Attribute::TARGET_METHOD)]
    final class Override
    {
    }
}

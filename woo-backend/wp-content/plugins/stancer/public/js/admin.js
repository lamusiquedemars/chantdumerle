"use strict";
(function ($) { return $(function () {
    var prefix = 'woocommerce_stancer';
    var validateDescription = function ($description, descriptionType) {
        var _a, _b;
        if (!$description.length || $description.attr('type') !== 'text') {
            return true;
        }
        var _c = window.stancer_admin, confirmMessage = _c.confirmMessage, descriptionMessage = _c.descriptionMessage, maxSize = _c.maxSize, minSize = _c.minSize, renewalDescriptionMessage = _c.renewalDescriptionMessage;
        var typeMessage = descriptionType === 'descriptionMessage' ? descriptionMessage : renewalDescriptionMessage;
        var length = (_b = (_a = $description.val()) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        var isValid = (length < maxSize && length > minSize);
        if (!isValid) {
            $description.prop("isValid", false);
            isValid = confirm("\"".concat(typeMessage, "\" ").concat(confirmMessage));
        }
        return isValid;
    };
    var validateKey = function () {
        var $testMode = $("#".concat(prefix, "_test_mode"));
        var $liveKeys = [
            $("#".concat(prefix, "_api_live_public_key")),
            $("#".concat(prefix, "_api_live_secret_key")),
        ];
        var requireKey = function (keys) { return keys.map(function (key) { return key.prop('required', true); }); };
        var unRequireKey = function (keys) { return keys.map(function (key) { return key.prop('required', false); }); };
        $testMode === null || $testMode === void 0 ? void 0 : $testMode.on('input', function () { return $testMode.prop('checked') ? unRequireKey($liveKeys) : requireKey($liveKeys); });
    };
    validateKey();
    $('#mainform').on('submit', function (event) {
        var $payment_description = $("#".concat(prefix, "_payment_description"));
        var $renewal_description = $("#".concat(prefix, "_subscription_renewal_description"));
        if (!validateDescription($payment_description, 'descriptionMessage') ||
            !validateDescription($renewal_description, 'renewalDescriptionMessage')) {
            event.stopPropagation();
            event.preventDefault();
        }
    });
}); })(jQuery);

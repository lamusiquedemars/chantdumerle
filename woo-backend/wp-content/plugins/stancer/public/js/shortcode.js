"use strict";
(function ($) { return $(function () {
    /**
     * shortcode checkout handler.
     *
     * @param button
     */
    var placeOrder = function (button) {
        if (button === void 0) { button = '.js-stancer-place-order'; }
        var data = function () { return $(button).parents('form').serialize(); };
        var canSubmit = function () { return $('#payment_method_stancer').is(':checked'); };
        window.stancer_onSubmit({
            button: button,
            route: {
                path: '',
                url: stancer_data.initiate
            },
            data: data,
        }, canSubmit);
    };
    window.stancer_changePaymentMethodOrCallback(placeOrder)();
}); })(jQuery);

"use strict";
(function ($) { return $(function () {
    var params = Object.fromEntries(window.location.search.slice(1).split('&').map(function (value) { return value.split('='); }));
    var $body = $(document.body);
    /**
     * Initiate the payment method change.
     * @param button
     */
    var changePaymentMethod = function (button) {
        var _a, _b;
        if (button === void 0) { button = '.js-stancer-change-payment-method'; }
        informationPaymentChange();
        var data = {
            nonce: (_a = stancer_data.changePaymentMethod) === null || _a === void 0 ? void 0 : _a.nonce,
            subscription: params.change_payment_method,
            action: 'initiate',
        };
        var path = '/stancer/v1/change_payment_method/initiate';
        var url = (_b = stancer_data.changePaymentMethod) === null || _b === void 0 ? void 0 : _b.url;
        var route = { path: path, url: url };
        window.stancer_onSubmit({ button: button, route: route, data: data });
    };
    var changePaymentCallback = function (callback) {
        return isChangePaymentMethod() ? changePaymentMethod : callback;
    };
    /**
     * call Backend for payment change information
     */
    var informationPaymentChange = function () {
        var _a, _b;
        var success = function (result) { var _a; return $('#payment .payment_method_stancer label[for=payment_method_stancer]').text((_a = result.card) !== null && _a !== void 0 ? _a : ''); };
        var failure = function (result) { return $body.trigger('checkout_error', result.reason); };
        window.stancer_callServer({
            data: {
                nonce: (_a = stancer_data.changePaymentMethod) === null || _a === void 0 ? void 0 : _a.nonce,
                subscription: params.change_payment_method,
                action: 'information'
            },
            responseCallBack: function (result) {
                result.result == 'success' ? success(result) : failure(result);
            },
            route: {
                path: '/stancer/v1/change_payment_method/information',
                url: (_b = stancer_data.changePaymentMethod) === null || _b === void 0 ? void 0 : _b.url,
            }
        });
    };
    /**
     * Check if we are in a change payment method context
     * @param button
     * @returns
     */
    var isChangePaymentMethod = function (button) {
        if (button === void 0) { button = '.js-stancer-change-payment-method'; }
        return $(button).length ? true : false;
    };
    /**
     *  Validate the payment and return if the payment change has been validated.
     *
     * @param data
     * @returns
     */
    var paymentMethodHasBeenChanged = function (data) {
        return isChangePaymentMethod() && validatePaymentChange(data);
    };
    /**
     * Validate The payment change with the pp information, and backend information.
     * @param data
     * @returns boolean
     */
    var validatePaymentChange = function (data) {
        var _a, _b;
        if (data.status !== 'finished' && data.status !== 'error') {
            return false;
        }
        var success = function (result) {
            if (result.card) {
                $('#order_review .shop_table tfoot tr:nth-child(2) td.product-total').text(result.card);
            }
            $('#payment').empty();
        };
        var failure = function (result) { return ''; };
        var after = function (result) {
            if (result.messages) {
                var $message = $(document.createElement('div')).html(result.messages);
                var $notice = $('.woocommerce-notices-wrapper');
                $notice.remove('.wc-block-components-notice-banner, .woocommerce-error, .woocommerce-info');
                $message.addClass(result.result === 'success' ? 'woocommerce-info' : 'woocommerce-error');
                $notice.append($message);
            }
        };
        var callData = {
            nonce: (_a = stancer_data.changePaymentMethod) === null || _a === void 0 ? void 0 : _a.nonce,
            subscription: params.change_payment_method,
            action: 'validate'
        };
        window.stancer_callServer({
            data: callData,
            responseCallBack: function (result) {
                result.result == 'success' ? success(result) : failure(result);
                after(result);
            },
            route: {
                path: '/stancer/v1/change_payment_method/validate',
                url: (_b = stancer_data.changePaymentMethod) === null || _b === void 0 ? void 0 : _b.url,
            }
        });
        return true;
    };
    //EXPORT
    window.stancer_paymentMethodHasBeenChanged = paymentMethodHasBeenChanged;
    window.stancer_changePaymentMethodOrCallback = changePaymentCallback;
}); })(jQuery);

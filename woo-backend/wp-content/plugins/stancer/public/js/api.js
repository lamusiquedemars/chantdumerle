"use strict";
(function ($) { return $(function () {
    var $body = $(document.body);
    //This is unused for now, it's not deleted cause it could be usefull when we will let people register their cards.
    var $cardSelect = $('#stancer-card');
    if ($cardSelect.selectWoo) {
        $cardSelect.selectWoo({
            minimumResultsForSearch: Infinity,
            width: '100%',
        });
    }
    /**
     * Call our backend for information.
     * We Try to call with wordpress API requests, if it's not available we fallback on AJAX requests
     *
     * @param arg0: ServerCallData
     * @returns void
     */
    var callServer = function (_a) {
        var data = _a.data, responseCallBack = _a.responseCallBack, route = _a.route;
        if (typeof data == 'function') {
            data = data();
        }
        if (window.wp !== undefined && window.wp.apiFetch !== undefined && route.path !== '') {
            window.wp.apiFetch({
                path: route.path,
                method: 'POST',
                data: data
            })
                .then(function (response) { return responseCallBack(response); });
        }
        else {
            if (route.url === undefined) {
                throw new Error('No URL given with shortcodeAjaxrequest');
            }
            $.ajax({
                url: route.url,
                type: 'POST',
                data: data,
                dataType: 'json',
                success: function (data, _textStatus, _jqXHR) { return responseCallBack(data); },
                error: function (_jqXHR, _textStatus, errorThrown) { return $body.trigger('checkout_error', [errorThrown]); },
            });
        }
    };
    /**
     * Submit handler on checkout form submisssion.
     * To be look like an <form onSubmit>
     *
     * @param param0
     * @param canSubmit
     */
    var onSubmit = function (_a, canSubmit) {
        var button = _a.button, route = _a.route, data = _a.data;
        if (canSubmit === void 0) { canSubmit = function () { return true; }; }
        $body.on('click', button, function (event) {
            if (!canSubmit()) {
                return true;
            }
            event.preventDefault();
            var $button = $(button);
            $button.prop('disabled', true);
            $button.block({ message: null });
            var responseCallBack = function (response) {
                response.result == 'success' ? window.stancer_iframe(response) : processResponseFailure(response);
                $button.prop('disabled', false);
                $button.unblock();
            };
            callServer({ data: data, route: route, responseCallBack: responseCallBack });
            return false;
        });
    };
    /**
     * The function that handle a failed backend call.
     *
     * @param result
     * @returns
     */
    var processResponseFailure = function (result) {
        // Reload page
        if (result.reload) {
            window.location.reload();
            return false;
        }
        // Trigger update in case we need a fresh nonce
        if (result.refresh) {
            $body.trigger('update_checkout');
        }
        // Add new errors
        if (result.messages) {
            var $scrollElement = $(document.createElement('div'))
                .addClass('woocommerce-NoticeGroup, woocommerce-NoticeGroup-checkout')
                .html(result.messages);
            var $form = $('form.checkout');
            $form.remove('.woocommerce-NoticeGroup-checkout, .woocommerce-error, .woocommerce-message');
            $form
                .prepend($scrollElement)
                .removeClass('processing')
                .unblock();
            $('.input-text, select, input:checkbox', $form)
                .trigger('validate')
                .trigger('blur');
            $.scroll_to_notices($scrollElement);
            $body.trigger('checkout_error', [result.messages]);
        }
    };
    //EXPORT
    window.stancer_callServer = callServer;
    window.stancer_onSubmit = onSubmit;
}); })(jQuery);

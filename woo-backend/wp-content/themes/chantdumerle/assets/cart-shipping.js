(function ($) {
  const params = window.cdmCartShipping;

  if (!$ || !params || !params.wcAjaxUrl || !params.updateShippingMethodNonce) {
    return;
  }

  let request = null;
  let lastFocusedShippingMethodId = null;

  function getAjaxUrl(endpoint) {
    return String(params.wcAjaxUrl).replace("%%endpoint%%", endpoint);
  }

  function collectShippingMethods() {
    const methods = {};

    $(
      'select.shipping_method, :input[name^="shipping_method"][type=radio]:checked, :input[name^="shipping_method"][type=hidden]'
    ).each(function () {
      const index = $(this).data("index");
      methods[index == null ? 0 : index] = $(this).val();
    });

    return methods;
  }

  function block($element) {
    if (!$element.length || !$element.block) {
      return;
    }

    $element.addClass("processing").block({
      message: null,
      overlayCSS: {
        background: "#fff",
        opacity: 0.6,
      },
    });
  }

  function unblock($element) {
    if ($element.length && $element.unblock) {
      $element.removeClass("processing").unblock();
    }

    $(".cart_totals").removeClass("processing").find(".blockUI").remove();
  }

  function updateCartTotals(event) {
    if (!$("body").hasClass("woocommerce-cart")) {
      return;
    }

    const shippingMethods = collectShippingMethods();
    const hasShippingMethod = Object.keys(shippingMethods).length > 0;
    const $totals = $("div.cart_totals");

    if (!hasShippingMethod || !$totals.length) {
      return;
    }

    if (request) {
      request.abort();
    }

    lastFocusedShippingMethodId =
      event && event.target && event.target.id ? event.target.id : null;

    block($totals);

    request = $.ajax({
      type: "POST",
      url: getAjaxUrl("update_shipping_method"),
      data: {
        security: params.updateShippingMethodNonce,
        shipping_method: shippingMethods,
      },
      dataType: "html",
      success(response) {
        if (!response) {
          return;
        }

        const $response = $($.parseHTML(response, document, true));
        const $newTotals = $response.is(".cart_totals")
          ? $response
          : $response.find(".cart_totals").first();

        if (!$newTotals.length) {
          window.location.reload();
          return;
        }

        $totals.replaceWith($newTotals);
        $(document.body).trigger("updated_cart_totals");
        $(document.body).trigger("updated_shipping_method");

        if (lastFocusedShippingMethodId) {
          const selectedInput = document.getElementById(lastFocusedShippingMethodId);
          selectedInput?.focus();
        }
      },
      complete() {
        unblock($totals);
        request = null;
      },
    });
  }

  document.addEventListener(
    "change",
    function (event) {
      const target = event.target;

      if (
        !(target instanceof HTMLElement) ||
        !$("body").hasClass("woocommerce-cart") ||
        !target.matches(
          'select.shipping_method, input[name^="shipping_method"], select[name^="shipping_method"]'
        )
      ) {
        return;
      }

      event.stopImmediatePropagation();
      updateCartTotals(event);
    },
    true
  );
})(window.jQuery);

"use strict";
document.addEventListener('DOMContentLoaded', function () {
    if (window.opener) {
        var redirect = '' !== window.location.search ? '&order_payed' : '?order_payed';
        window.opener.location = window.location.href + redirect;
        window.close();
    }
});

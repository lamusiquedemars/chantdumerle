"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * This function register the stancer payment method
 */
var main = function () {
    // Declare Interfaces.
    var _a;
    // Declare WordPress related globals.
    var wordPress = window.wp;
    var settings = window.wcSettings.paymentMethodData['stancer'];
    var registerPaymentMethod = window.wc.wcBlocksRegistry.registerPaymentMethod;
    // Declare React function & wordpress,woocommerce constants.
    var useEffect = React.useEffect;
    /**
     *  Set the Button Label
     *
     * @returns string
     */
    var buttonLabel = function () {
        return wordPress.htmlEntities.decodeEntities(settings.label);
    };
    /**
     * Listen to the Button prevent the click event and call the api ourself to put the stancer url in our iframe
     *
     * @param data
     * @param setPaymentUrl
     * @param IsisClosed
     * @returns void
     */
    var buttonListener = function (data) {
        return useEffect(function () {
            var button = document.querySelector('.wc-block-components-checkout-place-order-button');
            if (data().payment_method !== 'stancer' || settings.page_type !== 'pip' || button === null) {
                return;
            }
            button.addEventListener('click', function (e) {
                var _a;
                var checkedPaymentMethod = document.querySelector('.wc-block-components-radio-control__option-checked');
                if ((checkedPaymentMethod === null || checkedPaymentMethod === void 0 ? void 0 : checkedPaymentMethod.getAttribute('for')) !== null &&
                    !((_a = checkedPaymentMethod === null || checkedPaymentMethod === void 0 ? void 0 : checkedPaymentMethod.getAttribute('for')) === null || _a === void 0 ? void 0 : _a.includes('stancer')) &&
                    button.innerHTML !== wordPress.htmlEntities.decodeEntities(settings.label)) {
                    return;
                }
                e.preventDefault();
                e.stopImmediatePropagation();
                callApi(data()).then(function (response) {
                    var _a;
                    // Block checkout doesn't give us an easy acess to the checkout data that we sent.
                    var receipt = (_a = response.payment_result.payment_details.filter(function (object) {
                        return object.key == 'receipt';
                    })[0].value) !== null && _a !== void 0 ? _a : '';
                    window.stancer_iframe({
                        redirect: response.payment_result.redirect_url,
                        result: response.payment_result.payment_status,
                        receipt: receipt,
                    });
                });
            });
        }, []);
    };
    /**
     *
     * @param data CompletePaymentData the data needed for our api call in the good format.
     * @returns Promise<BlockApiResponse>
     */
    var callApi = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wordPress.apiFetch({
                        path: '/wc/store/v1/checkout',
                        method: 'POST',
                        data: data,
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    }); };
    /**
     * Create a reactNode with our description, we also have our Iframe logic in here to get the props.
     *
     * @returns ReactNode
     */
    var Content = function (props) {
        var activePaymentMethod = props.activePaymentMethod, billing = props.billing, shippingData = props.shippingData;
        if (typeof activePaymentMethod === 'undefined') {
            throw Error('Undefined payment method, cannot process.');
        }
        var formdata = function () {
            var formdata = {
                billing_address: billing === null || billing === void 0 ? void 0 : billing.billingAddress,
                payment_method: activePaymentMethod,
                shipping_address: shippingData === null || shippingData === void 0 ? void 0 : shippingData.shippingAddress,
            };
            return formdata;
        };
        buttonListener(formdata);
        return (React.createElement("div", null,
            React.createElement(Description, null)));
    };
    /**
     * Get the description of our payment module
     *
     * @returns ReactNode
     */
    var Description = function () {
        return wordPress.htmlEntities.decodeEntities(settings.description);
    };
    /**
     * Set the Label to be displayed
     * With Logo as defined by the user
     *
     * @param props
     * @returns ReactNode
     */
    var Label = function (_a) {
        var components = _a.components;
        var PaymentMethodLabel = components === null || components === void 0 ? void 0 : components.PaymentMethodLabel;
        if (PaymentMethodLabel == undefined) {
            throw new Error('Label not Found');
        }
        return (React.createElement("div", { className: "payment_method_stancer" },
            React.createElement(PaymentMethodLabel, { text: settings.title + ' ' }),
            React.createElement("img", { className: settings.logo.class, src: settings.logo.url })));
    };
    var options = {
        ariaLabel: (_a = settings.title) !== null && _a !== void 0 ? _a : 'stancer',
        canMakePayment: function () { return true; },
        content: React.createElement(Content, null),
        edit: React.createElement(Content, null),
        label: React.createElement(Label, null),
        name: 'stancer',
        paymentMethodId: 'stancer',
        placeOrderButtonLabel: buttonLabel(),
        supports: { features: settings.supports },
    };
    registerPaymentMethod(options);
};
main();


define([
    'knockout',
    'jquery',
    'mage/url',
    'Magento_Customer/js/model/customer',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/url-builder',
    'Magento_Checkout/js/model/error-processor',
    'Magento_Checkout/js/model/cart/cache',
    'uiRegistry',
    'underscore'
], function (
    ko,
    $,
    urlFormatter,
    customer,
    quote,
    urlBuilder,
    errorProcessor,
    cartCache,
    registry,
    _
) {
    'use strict';

    return function (shipping) {
        return shipping.extend({
            cidFields: ko.observable(null),

            validateCidShippingForm: function () {
                this.source.set('params.invalid', false);
                this.source.trigger('cidShippingForm.data.validate');
                return this.source.get('params.invalid');
            },

            validateShippingInformation: function () {
                var originalResult = this._super();
                if (originalResult == false) {
                    return false;
                }

                /* validate cid fields */
                if (this.validateCidShippingForm()) {
                    return false;
                }

                return true;
            },

            initialize: function () {
                var self = this;
                this._super();

                var formDataCached = cartCache.get('cidShippingForm');
                if (formDataCached) {
                    self.cidFields(formDataCached);
                }

                registry.async('checkoutProvider')(function (checkoutProvider) {
                    checkoutProvider.set('cidShippingForm', self.cidFields())

                    checkoutProvider.on('cidShippingForm', function (cidFields) {
                        self.cidFields(cidFields);
                        if (self.cancelSaveFields) {
                            clearTimeout(self.cancelSaveFields)
                            self.cancelSaveFields = null;
                        }
                        self.cancelSaveFields = setTimeout(self.saveCidFields, 1000, cidFields);
                    });
                });

                return this;
            },

            saveCidFields: function (formData) {
                if (formData.shipping_cid_type != '' && formData.shipping_cid_number != '') {
                    var quoteId = quote.getQuoteId();
                    var isCustomer = customer.isLoggedIn();
                    var url;

                    if (isCustomer) {
                        url = urlBuilder.createUrl('/carts/mine/set-order-cid-fields', {});
                    } else {
                        url = urlBuilder.createUrl('/guest-carts/:cartId/set-order-cid-field', { cartId: quoteId });
                    }

                    var payload = {
                        cartId: quoteId,
                        cidFields: formData
                    };
                    var result = true;
                    $.ajax({
                        url: urlFormatter.build(url),
                        data: JSON.stringify(payload),
                        global: false,
                        contentType: 'application/json',
                        type: 'PUT',
                        async: true
                    }).done(
                        function (response) {
                            cartCache.set('cidShippingForm', formData);
                            result = true;
                        }
                    ).fail(
                        function (response) {
                            result = false;
                            errorProcessor.process(response);
                        }
                    );

                    return result;
                }
            }

        });
    };
});
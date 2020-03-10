/*global define*/
define([
    'knockout',
    'jquery',
    'mage/url',
    'Magento_Ui/js/form/form',
    'Magento_Customer/js/model/customer',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/url-builder',
    'Magento_Checkout/js/model/error-processor',
    'Magento_Checkout/js/model/cart/cache',
    'Mugar_CustomerIdentificationDocument/js/model/checkout/cid-shipping-form',
    'mage/validation'
], function (ko, $, urlFormatter, Component, customer, quote, urlBuilder, errorProcessor, cartCache, formData) {
    'use strict';

    return Component.extend({
        cidFields: ko.observable(null),
        formData: formData.cidFieldsData,
        quoteIsVirtual: quote.isVirtual(),

        initialize: function () {
            var self = this;
            this._super();
            formData = this.source.get('cidShippingForm');
            var formDataCached = cartCache.get('cid-form');
            if (formDataCached) {
                formData = this.source.set('cidShippingForm', formDataCached);
            }

            this.cidFields.subscribe(function (change) {
                self.formData(change);
            });

            return this;
        },

        onFormChange: function () {
            var cidFields = this.source.get('cidShippingForm');
            this.cidFields(cidFields);
            if (this.cancelSaveFields) {
                clearTimeout(this.cancelSaveFields)
                this.cancelSaveFields = null;
            }
            this.cancelSaveFields = setTimeout(this.saveCidFields, 500, cidFields);
        },

        saveCidFields: function (formData) {
            if (formData.shipping_cid_type == '')
                return;

            if (formData.shipping_cid_number == '')
                return;

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
                    cartCache.set('cid-form', formData);
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
    });
});
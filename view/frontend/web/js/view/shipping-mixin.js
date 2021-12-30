define([
    'jquery',
    'underscore'
], function ($, _) {
    'use strict';

    return function (target) {
        return target.extend({
            defaults: {
                template: 'Mugar_CustomerIdentificationDocument/shipping'
            },
            validateCidShippingForm: function () {
                this.source.set('params.invalid', false);
                this.source.trigger('cidShippingForm.data.validate');
                return !this.source.get('params.invalid');
            },

            validateShippingInformation: function () {
                if (this._super() === false) {
                    return false;
                }

                /* validate cid fields */
                return this.validateCidShippingForm();
            }
        });
    };
});

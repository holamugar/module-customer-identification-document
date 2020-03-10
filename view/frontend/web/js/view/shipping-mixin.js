define([
    'ko'
], function (
    ko
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

                /* validate cid fields */
                if (this.validateCidShippingForm()) {
                    return false;
                }

                return originalResult;
            },
        });
    };
});
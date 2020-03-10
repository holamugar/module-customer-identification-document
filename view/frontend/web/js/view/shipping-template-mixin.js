define([], function (
) {
    'use strict';

    return function (shipping) {
        return shipping.extend({
            defaults: {
                template: 'Mugar_CustomerIdentificationDocument/shipping'
            }
        });
    };
});
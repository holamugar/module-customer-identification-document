<?php
/**
 * Customer Identification Document
 *
 * @category   Mugar
 * @package    Mugar_CustomerIdentificationDocument
 * @license    http://www.opensource.org/licenses/mit-license.html  MIT License
 * @author     Mugar (https://www.mugar.io/)
 *
 */

namespace Mugar\CustomerIdentificationDocument\Plugin\Sales\Model\AdminOrder\Create;

use Magento\Sales\Model\AdminOrder\Create;

class AddCidFieldsPlugin
{
    public function beforeImportPostData(
        Create $subject,
        $data
    ) {
        $quote = $subject->getQuote();
        $fields = [
            'shipping_cid_type' => 'setShippingCidType',
            'shipping_cid_number' => 'setShippingCidNumber',
            'billing_cid_type' => 'setBillingCidType',
            'billing_cid_number' => 'setBillingCidNumber',
        ];
        foreach ($data as $key => $value) {
            if (!isset($fields[$key])) {
                continue;
            }
            call_user_func([$quote, $fields[$key]], $value);
        }
    }
}

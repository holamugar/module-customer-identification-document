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

namespace Mugar\CustomerIdentificationDocument\Plugin\Sales\Block\Adminhtml\Order\Create\Form\Account;

use Magento\Framework\Data\Form;
use Magento\Sales\Block\Adminhtml\Order\Create\Form\Account;
use Mugar\CustomerIdentificationDocument\Helper\Data;

class AddCidFieldsPlugin
{
    /**
     * Mugar\CustomerIdentificationDocument\Helper\Data
     * @var Data
     */
    protected $helper;

    /**
     * CidConfiguration constructor.
     *
     * @param Data $helper
     */
    public function __construct(
        Data $helper
    ) {
        $this->helper = $helper;
    }

    public function afterGetForm(
        Account $subject,
        Form $form
    ) {
        if ($this->helper->isShippingEnabled()) {
            $form->addField(
                'shipping_cid_type',
                'select',
                [
                    'name' => 'order[shipping_cid_type]',
                    'label' => $this->helper->getShippingLabel(),
                    'required' => true,
                    'options' => array_combine(
                        $this->helper->getShippingDocumentTypes(),
                        $this->helper->getShippingDocumentTypes()
                    )
                ]
            );
            $form->addField(
                'shipping_cid_number',
                'text',
                [
                    'name' => 'order[shipping_cid_number]',
                    'required' => true
                ]
            );

            $form->addValues([
                'shipping_cid_type' => $subject->getQuote()->getShippingCidType(),
                'shipping_cid_number' => $subject->getQuote()->getShippingCidNumber()
            ]);
        }

        if ($this->helper->isBillingEnabled()) {
            $form->addField(
                'cid_billing_cid_type',
                'select',
                [
                    'name' => 'order[billing_cid_type]',
                    'label' => $this->helper->getBillingLabel(),
                    'required' => true,
                    'options' => array_combine(
                        $this->helper->getBillingDocumentTypes(),
                        $this->helper->getBillingDocumentTypes()
                    )
                ]
            );
            $form->addField(
                'cid_billing_cid_number',
                'text',
                [
                    'name' => 'order[billing_cid_number]',
                    'required' => true
                ]
            );
            $form->addValues([
                'cid_billing_cid_type' => $subject->getQuote()->getBillingCidType(),
                'cid_billing_cid_number' => $subject->getQuote()->getBillingCidNumber()
            ]);
        }
        return $form;
    }
}

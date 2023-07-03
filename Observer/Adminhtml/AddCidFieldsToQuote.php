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

namespace Mugar\CustomerIdentificationDocument\Observer\Adminhtml;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Mugar\CustomerIdentificationDocument\Api\Data\CidFieldsInterface;

class AddCidFieldsToQuote implements ObserverInterface
{
    public function execute(Observer $observer)
    {
        $quote = $observer->getEvent()->getQuote();
        $order = $observer->getEvent()->getOrder();

        $quote->setData(
            CidFieldsInterface::SHIPPING_CID_TYPE,
            $order->getData(CidFieldsInterface::SHIPPING_CID_TYPE)
        );
        $quote->setData(
            CidFieldsInterface::SHIPPING_CID_NUMBER,
            $order->getData(CidFieldsInterface::SHIPPING_CID_NUMBER)
        );
        $quote->setData(
            CidFieldsInterface::BILLING_CID_TYPE,
            $order->getData(CidFieldsInterface::BILLING_CID_TYPE)
        );
        $quote->setData(
            CidFieldsInterface::BILLING_CID_NUMBER,
            $order->getData(CidFieldsInterface::BILLING_CID_NUMBER)
        );
    }
}

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

namespace Mugar\CustomerIdentificationDocument\Controller\Adminhtml\Types;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\Controller\ResultFactory;

class Index extends Action
{
    /**
     * @var string
     */
    private $pageTitle;

    /**
     * @var string
     */
    protected $activeMenuItem;

    /**
     * Index constructor.
     * @param Context $context
     * @param string $activeMenuItem
     * @param string $pageTitle
     */
    public function __construct(Context $context, $activeMenuItem = '', $pageTitle = '')
    {
        parent::__construct($context);
        $this->activeMenuItem = $activeMenuItem;
        $this->pageTitle = $pageTitle;
    }

    /**
     * @return \Magento\Backend\Model\View\Result\Page
     */
    public function execute()
    {
        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
        if ($this->activeMenuItem) {
            $resultPage->setActiveMenu($this->activeMenuItem);
        }
        $resultPage->getConfig()->getTitle()->prepend($this->pageTitle);
        return $resultPage;
    }
}
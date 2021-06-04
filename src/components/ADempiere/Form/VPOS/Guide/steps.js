import language from '@/lang'
const steps = [
  {
    element: '#ProductValue',
    popover: {
      title: language.t('form.productInfo.codeProduct'),
      description: language.t('form.guideSteps.productValue.description'),
      position: 'bottom'
    }
  },
  {
    element: '#BusinessPartner',
    popover: {
      title: language.t('form.pos.order.BusinessPartnerCreate.businessPartner'),
      position: 'bottom'
    }
  },
  {
    element: '#linesOrder',
    popover: {
      title: language.t('form.guideSteps.linesTable.title'),
      position: 'top'
    }
  },
  {
    element: '#buttonPanelLeftPos',
    popover: {
      title: language.t('form.guideSteps.buttonPanelLeftPos.title'),
      position: 'right'
    }
  },
  {
    element: '#toolPoint',
    popover: {
      title: language.t('form.guideSteps.toolsPoint.title'),
      position: 'bottom'
    }
  },
  {
    element: '#point',
    popover: {
      title: language.t('form.pos.title'),
      position: 'right'
    }
  },
  {
    element: '#buttonPanelRightPos',
    popover: {
      title: language.t('form.guideSteps.buttonPanelRightPos.title'),
      position: 'left'
    }
  },
  {
    element: '#fieldListCollection',
    popover: {
      title: language.t('form.guideSteps.fieldListCollection.title'),
      position: 'left'
    },
    panel: 'Collection'
  },
  {
    element: '#buttonCollection',
    popover: {
      title: language.t('form.guideSteps.buttonCollection.title'),
      position: 'left'
    },
    panel: 'Collection'
  },
  {
    element: '#cardCollection',
    popover: {
      title: language.t('form.guideSteps.cardCollection.title'),
      position: 'left'
    },
    panel: 'Collection'
  },
  {
    element: '#infoInvoce',
    popover: {
      title: language.t('form.guideSteps.infoInvoce.title'),
      position: 'top'
    },
    panel: 'Collection'
  }
]
export default steps

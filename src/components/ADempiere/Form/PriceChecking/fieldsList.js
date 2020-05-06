import { TEXT } from '@/utils/ADempiere/references'

export default [
  // Product Code
  {
    elementColumnName: 'ProductValue',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      cssClassName: 'price-inquiry',
      handleActionKeyPerformed: true
    }
  },
  // Product Name
  {
    elementColumnName: 'ProductName',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 20,
      isReadOnly: true,
      cssClassName: 'price-inquiry'
    }
  },
  // Product Description
  {
    elementColumnName: 'ProductDescription',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 30,
      displayType: TEXT.id,
      isReadOnly: true,
      cssClassName: 'price-inquiry'
    }
  },
  // Price List
  {
    elementColumnName: 'PriceList',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 16,
      sequence: 40,
      isReadOnly: true,
      cssClassName: 'price-inquiry',
      help: '0.00'
    }
  },
  // Tax Amount
  {
    elementColumnName: 'TaxAmt',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      sequence: 50,
      isReadOnly: true,
      cssClassName: 'price-inquiry',
      help: '0.00'
    }
  },
  // Total
  {
    elementColumnName: 'GrandTotal',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 60,
      isReadOnly: true,
      cssClassName: 'price-inquiry',
      help: '0.00'
    }
  }
]

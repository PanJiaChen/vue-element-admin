// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Sofia Calderon sofia.ester.calderon@gmail.com www.westfalia-it.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import {
  convertContextInfo,
  convertOrganization,
  convertLanguage,
  convertCountry,
  convertBusinessPartner,
  convertConversionRate,
  convertBankAccount,
  convertDocumentType,
  convertDocumentStatus,
  convertPriceList,
  convertTaxRate,
  convertProduct,
  convertProductPrice
} from '@/utils/ADempiere/apiConverts/core.js'
import contextInfo from './objects/fromApi/contextInfo.json'
import convertedContextInfo from './objects/converted/contextInfo.json'
import contextInfoWithoutMessage from './objects/fromApi/contextInfoWithoutMessage.json'
import convertedContextInfoWithoutMessage from './objects/converted/contextInfoWithoutMessage.json'
import organization from './objects/fromApi/organization.json'
import convertedOrganization from './objects/converted/organization.json'
import language from './objects/fromApi/language.json'
import convertedLanguage from './objects/converted/language.json'
import country from './objects/fromApi/country.json'
import convertedCountry from './objects/converted/country.json'
import countryWithNoCurrency from './objects/fromApi/countryNoCurrency.json'
import convertedCountryWithNoCurrency from './objects/converted/countryNoCurrency.json'
import businessPartner from './objects/fromApi/businessPartner.json'
import convertedBusinessPartner from './objects/converted/businessPartner.json'
import conversionRate from './objects/fromApi/conversionRate.json'
import convertedConversionRate from './objects/converted/conversionRate.json'
import conversionRateNoCurrency from './objects/fromApi/conversionRateNoCurrency.json'
import convertedConversionRateNoCurrency from './objects/converted/conversionRateNoCurrency.json'
import salesRepresentative from './objects/fromApi/salesRepresentative.json'
import convertedSalesRepresentative from './objects/converted/salesRepresentative.json'
import bankAccount from './objects/fromApi/bankAccount.json'
import convertedBankAccount from './objects/converted/bankAccount.json'
import documentType from './objects/fromApi/documentType.json'
import convertedDocumentType from './objects/converted/documentType.json'
import documentStatus from './objects/fromApi/documentStatus.json'
import convertedDocumentStatus from './objects/converted/documentStatus.json'
import priceList from './objects/fromApi/priceList.json'
import convertedPriceList from './objects/converted/priceList.json'
import taxRate from './objects/fromApi/taxRate.json'
import convertedTaxRate from './objects/converted/taxRate.json'
import product from './objects/fromApi/product.json'
import convertedProduct from './objects/converted/product.json'
import productPrice from './objects/fromApi/productPrice.json'
import convertedProductPrice from './objects/converted/productPrice.json'

describe('context info', () => {
  it('should return a converted context info', () => {
    const actualContextInfo = convertContextInfo(contextInfo)
    expect(actualContextInfo).toEqual(convertedContextInfo)
  })
  it('should return empty object for undefined context info', () => {
    const actualContextInfo = convertContextInfo(null)
    expect(actualContextInfo).toEqual({ messageText: {}})
  })
  it('should return a converted context info with an empty message', () => {
    const actualContextInfo = convertContextInfo(contextInfoWithoutMessage)
    expect(actualContextInfo).toEqual(convertedContextInfoWithoutMessage)
  })
})

describe('organization', () => {
  it('should return a converted organization object', () => {
    const actualOrganization = convertOrganization(organization)
    expect(actualOrganization).toEqual(convertedOrganization)
  })
})

describe('language', () => {
  it('should return a converted language object', () => {
    const actualLanguage = convertLanguage(language)
    expect(actualLanguage).toEqual(convertedLanguage)
  })
})

describe('country', () => {
  it('should return a converted country object with currency', () => {
    const actualCountry = convertCountry(country)
    expect(actualCountry).toEqual(convertedCountry)
  })
  it('should return a converted country object without currency', () => {
    const actualCountry = convertCountry(countryWithNoCurrency)
    expect(actualCountry).toEqual(convertedCountryWithNoCurrency)
  })
})

describe('business partner', () => {
  it('should return a converted business partner object', () => {
    const actualBusinessPartner = convertBusinessPartner(businessPartner)
    expect(actualBusinessPartner).toEqual(convertedBusinessPartner)
  })
})

describe('conversion rate', () => {
  it('should return a converted conversion rate object with currencies', () => {
    const actualConversionRate = convertConversionRate(conversionRate)
    expect(actualConversionRate).toEqual(convertedConversionRate)
  })

  it('should return a converted conversion rate object without currencies', () => {
    const actualConversionRate = convertConversionRate(
      conversionRateNoCurrency
    )
    expect(actualConversionRate).toEqual(convertedConversionRateNoCurrency)
  })
})

describe('sales representative', () => {
  it('should return a converted sales representative object', () => {
    const actualSalesRep = convertBusinessPartner(salesRepresentative)
    expect(actualSalesRep).toEqual(convertedSalesRepresentative)
  })
})

describe('bank account', () => {
  it('should return a converted bank account object', () => {
    const actualBankAccount = convertBankAccount(bankAccount)
    expect(actualBankAccount).toEqual(convertedBankAccount)
  })
  it('should return undefined', () => {
    const actualBankAccount = convertBankAccount(null)
    expect(actualBankAccount).toBeUndefined()
  })
})

describe('document type', () => {
  it('should return a converted document type object', () => {
    const actualDocumentType = convertDocumentType(documentType)
    expect(actualDocumentType).toEqual(convertedDocumentType)
  })
  it('should return undefined', () => {
    const actualDocumentType = convertBankAccount(null)
    expect(actualDocumentType).toBeUndefined()
  })
})

describe('document status', () => {
  it('should return a converted document status object', () => {
    const actualDocumentStatus = convertDocumentStatus(documentStatus)
    expect(actualDocumentStatus).toEqual(convertedDocumentStatus)
  })
})

describe('price list', () => {
  it('should return a converted price list object', () => {
    const actualPriceList = convertPriceList(priceList)
    expect(actualPriceList).toEqual(convertedPriceList)
  })
})

describe('tax rate', () => {
  it('should return a converted tax rate object', () => {
    const actualTaxRate = convertTaxRate(taxRate)
    expect(actualTaxRate).toEqual(convertedTaxRate)
  })
})

describe('product', () => {
  it('should return a converted product object', () => {
    const actualProduct = convertProduct(product)
    expect(actualProduct).toEqual(convertedProduct)
  })
})

describe('product price', () => {
  it('should return a converted product price object', () => {
    const actualProductPrice = convertProductPrice(productPrice)
    expect(actualProductPrice).toEqual(convertedProductPrice)
  })
})

// Instance for connection Access (or Security)
export const AccessInstance = () => {
  const Access = require('@adempiere/grpc-access-client')
  const { ACCESS_ADDRESS } = require('@/api/ADempiere/constants')
  const { getLanguage } = require('@/lang/index')

  return new Access({
    host: ACCESS_ADDRESS,
    version: 'Version Epale',
    language: getLanguage() || 'en_US'
  })
}

// Instance for connection Business Data
export const BusinessDataInstance = () => {
  const BusinessData = require('@adempiere/grpc-data-client')
  const { BUSINESS_DATA_ADDRESS } = require('@/api/ADempiere/constants')
  const { getLanguage } = require('@/lang/index')
  const { getToken, getCurrentOrganization, getCurrentWarehouse } = require('@/utils/auth')

  return new BusinessData({
    host: BUSINESS_DATA_ADDRESS,
    sessionUuid: getToken(),
    organizationUuid: getCurrentOrganization(),
    warehouseUuid: getCurrentWarehouse(),
    language: getLanguage() || 'en_US'
  })
}

// Get Instance for connection
export const DictionaryInstance = () => {
  const Dictionary = require('@adempiere/grpc-dictionary-client')
  const { DICTIONARY_ADDRESS } = require('@/api/ADempiere/constants')
  const { getLanguage } = require('@/lang/index')
  const { getToken } = require('@/utils/auth')

  return new Dictionary(
    DICTIONARY_ADDRESS,
    getToken(),
    getLanguage() || 'en_US'
  )
}

// Instance for connection Enrollment
export const EnrollmentInstance = () => {
  const Enrollment = require('@adempiere/grpc-enrollment-client')
  const { ENROLLMENT_ADDRESS } = require('@/api/ADempiere/constants')

  return new Enrollment(
    ENROLLMENT_ADDRESS,
    3.9,
    'ADempiere-Vue'
  )
}

export const POSInstance = () => {
  const POS = require('@adempiere/grpc-pos-client')
  const { BUSINESS_DATA_ADDRESS } = require('@/api/ADempiere/constants')
  const { getLanguage } = require('@/lang/index')
  const { getToken, getCurrentOrganization, getCurrentWarehouse } = require('@/utils/auth')

  return new POS({
    host: BUSINESS_DATA_ADDRESS,
    sessionUuid: getToken(),
    organizationUuid: getCurrentOrganization(),
    warehouseUuid: getCurrentWarehouse(),
    language: getLanguage() || 'en_US'
  })
}

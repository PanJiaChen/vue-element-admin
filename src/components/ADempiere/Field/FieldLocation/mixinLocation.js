import { requestGetCountryDefinition } from '@/api/ADempiere/system-core.js'
import { getLocationAddress } from '@/api/ADempiere/field/location.js'

export default {
  name: 'MixinLocationField',
  computed: {
    currentCountryDefinition() {
      return this.$store.getters.getCountry
    },
    isShowedLocationForm: {
      get() {
        return this.$store.getters.getIsShowedLocation
      },
      set() {
        // empty
      }
    }
  },
  methods: {
    getLocationAddress,
    requestGetCountryDefinition,
    toggleShowedLocationForm() {
      this.$store.commit('setShowedLocation', !this.isShowedLocationForm)
    },
    setShowedLocationForm(isShow) {
      this.$store.commit('setShowedLocation', isShow)
    },
    /**
     * TODO: Add support with sequence to displayed
     * @param {object} entityValues
     */
    getDisplayedValue(entityValues) {
      let value = ''

      if (!this.isEmptyValue(entityValues)) {
        if (!this.isEmptyValue(entityValues.Address1)) {
          value = entityValues.Address1
        }
        if (!this.isEmptyValue(entityValues.City)) {
          value += ', ' + entityValues.City
        }
        if (!this.isEmptyValue(entityValues.RegionName)) {
          value += ', ' + entityValues.RegionName
        }
        if (!this.isEmptyValue(entityValues.Postal)) {
          value += ', ' + entityValues.Postal
        }
      }

      return value
    }
  }
}

export default {
  name: 'MixinBusinessPartner',
  props: {
    parentMetadata: {
      type: Object,
      default: () => {}
    },
    showsPopovers: {
      type: Object,
      default: () => {
        return {
          panelType: 'form',
          isShowCreate: false,
          isShowList: false
        }
      }
    }
  },
  computed: {
    shortsKey() {
      return {
        closeForm: ['esc'],
        refreshListWithoutValues: ['shift', 'r'],
        refreshList: ['f5']
      }
    }
  },
  methods: {
    keyAction(event) {
      switch (event.srcKey) {
        case 'closeForm':
          this.closeForm()
          break
      }
    },
    closeForm() {
      this.showsPopovers.isShowList = false
      this.showsPopovers.isShowCreate = false
    },
    /**
     * ColumnName equals property to set into request's system-core
     * @param {object} values
     * @returns {object}
     */
    convertValuesToSend(values) {
      const valuesToSend = {}
      Object.keys(values).forEach(key => {
        const value = values[key]
        if (this.isEmptyValue(value)) {
          return
        }
        switch (key) {
          case 'Code':
            // Only used with search
            valuesToSend['searchValue'] = value
            break
          case 'Value':
            valuesToSend['value'] = value
            break
          case 'Name':
            valuesToSend['name'] = value
            break
          case 'Contact':
            valuesToSend['contactName'] = value
            break
          case 'EMail':
            valuesToSend['eMail'] = value
            break
          case 'Phone':
            valuesToSend['phone'] = value
            break
          // Location values
          case 'C_Country_ID_UUID':
            valuesToSend['countryUuid'] = value
            break
          case 'C_Region_ID_UUID':
            valuesToSend['regionUuid'] = value
            break
          case 'DisplayColumn_C_Region_ID':
            valuesToSend['regionName'] = value
            break
          case 'C_City_ID_UUID':
            valuesToSend['cityUuid'] = value
            break
          case 'DisplayColumn_C_City_ID':
            valuesToSend['cityName'] = value
            break
          case 'Address1':
            valuesToSend['address1'] = value
            break
          case 'Address2':
            valuesToSend['address2'] = value
            break
          case 'Address3':
            valuesToSend['address3'] = value
            break
          case 'Address4':
            valuesToSend['address4'] = value
            break
          case 'Postal':
            valuesToSend['postalCode'] = value
            break
        }
      })

      valuesToSend['posUuid'] = this.$store.getters.getPointOfSalesUuid
      return valuesToSend
    },
    setBusinessPartner({ id, name, uuid }, isCloseForm = true) {
      const { parentUuid, containerUuid } = this.parentMetadata
      // set ID value
      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_BPartner_ID', // this.parentMetadata.columnName,
        value: id
      })

      // set display column (name) value
      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: 'DisplayColumn_C_BPartner_ID', // this.parentMetadata.displayColumnName,
        value: name
      })

      // set UUID value
      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_BPartner_ID_UUID', // this.parentMetadata.columnName + '_UUID',
        value: uuid
      })

      if (isCloseForm) {
        this.closeForm()
      }
    }
  }
}

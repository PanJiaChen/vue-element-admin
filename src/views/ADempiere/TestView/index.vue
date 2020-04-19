<template>
  <div class="wrapper">
    <el-form
      v-if="isLoaded"
      key="form-loaded"
      label-position="top"
      label-width="200px"
    >
      <el-row>
        <field
          v-for="(metadata) in metadataList"
          :key="metadata.columnName"
          :metadata-field="metadata"
        />
      </el-row>
    </el-form>
    <div
      v-else
      key="form-loading"
      v-loading="!isLoaded"
      :element-loading-text="$t('notifications.loading')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="loading-panel"
    />
  </div>
</template>

<script>
import Field from '@/components/ADempiere/Field'
import { createFieldFromDefinition, createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'
import { URL, TEXT, NUMBER, INTEGER, TEXT_LONG, TABLE_DIRECT } from '@/utils/ADempiere/references'

export default {
  name: 'TestView',
  components: {
    Field
  },
  data() {
    return {
      metadataList: [],
      panelMetadata: {},
      isLoaded: false,
      panelUuid: 'Test-View',
      panelType: 'custom'
    }
  },
  computed: {
    getterPanel() {
      return this.$store.getters.getPanel(this.panelUuid)
    }
  },
  created() {
    this.getPanel()
  },
  methods: {
    getPanel() {
      const panel = this.getterPanel
      if (panel) {
        this.metadataList = panel.fieldList
        this.isLoaded = true
      } else {
        this.setFieldsList()
        this.$store.dispatch('addPanel', {
          name: 'Test View',
          uuid: this.panelUuid,
          panelType: this.panelType,
          fieldList: this.metadataList
        })
          .then(responsePanel => {
            this.metadataList = responsePanel.fieldList
          })
          .finally(() => {
            this.isLoaded = true
          })
      }
    },
    setFieldsList() {
      const fieldsList = []

      let sequence = 10
      // URL
      fieldsList.push(createFieldFromDefinition({
        containerUuid: this.panelUuid,
        columnName: 'URL',
        definition: {
          name: 'Web',
          displayType: URL.id,
          panelType: this.panelType,
          sequence
        }
      }))
      // From Field UUID
      createFieldFromDictionary({
        containerUuid: this.panelUuid,
        fieldUuid: '8ceabe8a-fb40-11e8-a479-7a0060f0aa01'
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      // From Column UUID
      createFieldFromDictionary({
        containerUuid: this.panelUuid,
        columnUuid: '8b4bbb7e-fb40-11e8-a479-7a0060f0aa01'
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      // From Element Column Name
      createFieldFromDictionary({
        containerUuid: this.panelUuid,
        elementColumnName: 'M_RMA_ID'
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      // From Table and Column Name
      createFieldFromDictionary({
        containerUuid: this.panelUuid,
        tableName: 'C_BPartner',
        columnName: 'PaymentRule',
        overwriteDefinition: {
          isMandatory: true
        }
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      // Table direct
      // To be define
      sequence = sequence + 10
      fieldsList.push(createFieldFromDefinition({
        containerUuid: this.panelUuid,
        columnName: 'C_Currency_ID',
        definition: {
          name: 'Currency',
          displayType: TABLE_DIRECT.id,
          panelType: this.panelType,
          keyColumn: 'C_Currency.C_Currency_ID',
          directQuery: 'SELECT C_Currency.C_Currency_ID,NULL,C_Currency.ISO_Code,C_Currency.IsActive FROM C_Currency WHERE C_Currency.C_Currency_ID=?',
          query: 'SELECT C_Currency.C_Currency_ID,NULL,C_Currency.ISO_Code,C_Currency.IsActive FROM C_Currency ORDER BY 3',
          sequence
        }
      }))

      sequence = sequence + 10
      // Text
      fieldsList.push(createFieldFromDefinition({
        containerUuid: this.panelUuid,
        columnName: 'Name',
        definition: {
          name: 'Only Name',
          displayType: TEXT.id,
          panelType: this.panelType,
          displayLogic: '@URL@!""',
          sequence
        }
      }))

      sequence = sequence + 10
      // Amount
      fieldsList.push(createFieldFromDefinition({
        containerUuid: this.panelUuid,
        columnName: 'Amount',
        definition: {
          name: 'Amount for it',
          displayType: NUMBER.id,
          panelType: this.panelType,
          readOnlyLogic: '@C_Currency_ID@<>""',
          sequence
        }
      }))

      sequence = sequence + 10
      // Integer
      fieldsList.push(createFieldFromDefinition({
        containerUuid: this.panelUuid,
        columnName: 'SeqNo',
        definition: {
          name: 'Sequence for record',
          displayType: INTEGER.id,
          panelType: this.panelType,
          mandatoryLogic: '@URL@!""',
          sequence
        }
      }))

      sequence = sequence + 10
      // Text Long
      fieldsList.push(createFieldFromDefinition({
        containerUuid: this.panelUuid,
        columnName: 'Description',
        definition: {
          name: 'Only Description',
          displayType: TEXT_LONG.id,
          panelType: this.panelType,
          sequence
        }
      }))

      this.metadataList = fieldsList
    }
  }
}
</script>

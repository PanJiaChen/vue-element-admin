<template>
  <el-main
    v-shortkey="shortsKey"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion>
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}
          <template v-if="!isEmptyValue(parentMetadata.name)">
            ({{ parentMetadata.name }})
          </template>
          <!-- <i class="el-icon-circle-plus" /> -->
        </template>
        <el-form
          label-position="top"
          size="small"
        >
          <el-row>
            <field
              v-for="(field) in metadataList"
              :key="field.columnName"
              :metadata-field="field"
            />
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-table
      ref="businesPartnerTable"
      :data="businessPartnersList"
      highlight-current-row
      border
      fit
      height="350"

      @current-change="handleCurrentChange"
    >
      <el-table-column
        :label="$t('form.productInfo.code')"
        prop="value"
        width="100"
      />
      <el-table-column
        :label="$t('form.productInfo.id')"
        prop="id"
        width="90"
      />
      <el-table-column
        prop="name"
        :label="$t('form.productInfo.name')"
      />
      <el-table-column
        :label="$t('form.productInfo.lastName')"
        prop="lastName"
      />
      <el-table-column
        :label="$t('form.pos.order.BusinessPartnerCreate.taxId')"
        prop="taxId"
        align="right"
      />
    </el-table>
    <custom-pagination
      :total="businessParners.recordCount"
      :current-page="1"
      :handle-change-page="handleChangePage"
    />
    <!-- -->
  </el-main>
</template>

<script>
import CustomPagination from '@/components/ADempiere/Pagination'
import {
  // createFieldFromDefinition,
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import fieldsList from './fieldsListSearch.js'
import BParterMixin from './mixinBusinessPartner.js'
import Field from '@/components/ADempiere/Field'

export default {
  name: 'BusinessPartnersList',
  components: {
    CustomPagination,
    Field
  },
  mixins: [
    // formMixin,
    BParterMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Business-Partner-List',
          containerUuid: 'Business-Partner-List'
        }
      }
    },
    showsPopovers: {
      type: Object,
      default: () => {
        return {
          isShowCreate: false,
          isShowList: false
        }
      }
    },
    showField: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoadedRecords: false,
      activeAccordion: 'query-criteria',
      fieldsList,
      metadataList: [],
      unsubscribe: () => {}
    }
  },
  computed: {
    businessParners() {
      return this.$store.getters.getBusinessPartner
    },
    businessPartnersList() {
      return this.$store.getters.getBusinessPartnersList
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.businessParners
      return (!isLoaded || isReload) && this.showsPopovers.isShowList
    }
  },
  watch: {
    isReadyFromGetData(isToLoad) {
      if (isToLoad) {
        this.searchBPartnerList({})
      }
    },
    showField(value) {
      if (value && this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()

    if (this.isReadyFromGetData) {
      this.searchBPartnerList({})
    }
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    createFieldFromDictionary,
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList': {
          const values = this.$store.getters.getValuesView({
            containerUuid: this.metadata.containerUuid,
            format: 'object'
          })

          this.searchBPartnerList(values)
          break
        }
        case 'refreshListWithoutValues': {
          this.searchBPartnerList({})
          break
        }
        case 'closeForm':
          this.closeForm()
          break
      }
    },
    handleCurrentChange(row) {
      this.setBusinessPartner(row)
    },
    handleChangePage(newPage) {
      this.$store.dispatch('setBPartnerPageNumber', newPage)
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField' &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          const values = this.$store.getters.getValuesView({
            containerUuid: mutation.payload.containerUuid,
            format: 'object'
          })
          this.searchBPartnerList(values)
        }
      })
    },
    searchBPartnerList(values, isConvert = true) {
      if (isConvert && !this.isEmptyValue(values)) {
        values = this.convertValuesToSend(values)
      }
      return this.$store.dispatch('listBPartnerFromServer', values)
        .then(response => {
          return response
        })
        .finally(() => {
          this.isLoadedRecords = true
        })
    },
    setFieldsList() {
      const list = []
      // Product Code
      this.fieldsList.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(response => {
            const data = response
            list.push({
              ...data,
              containerUuid: 'Business-Partner-List'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = list
    }
  }
}
</script>

<template>
  <el-main
    v-shortkey="shortsKey"
    @shortkey.native="keyAction"
  >
    <el-collapse v-model="activeAccordion" accordion>
      <el-collapse-item name="query-criteria">
        <template slot="title">
          Business Partner
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
            <field-definition
              v-for="(field) in fieldsList"
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
        label="Key"
        prop="value"
        width="180"
      />
      <el-table-column
        label="ID"
        prop="id"
        width="100"
      />
      <el-table-column
        prop="name"
        label="Name"
      />
      <el-table-column
        label="Last Name"
        prop="lastName"
      />
      <el-table-column
        label="NAICS"
        prop="naics"
        width="100"
      />
      <el-table-column
        label="Tax ID"
        prop="taxId"
        align="right"
        width="100"
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
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import fieldsList from './fieldsListSearch.js'
import BParterMixin from './mixinBusinessPartner.js'

export default {
  name: 'BusinessPartnersList',
  components: {
    CustomPagination
  },
  mixins: [
    formMixin,
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
    }
  },
  data() {
    return {
      isLoadedRecords: false,
      activeAccordion: 'query-criteria',
      fieldsList,
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
    }
  }
}
</script>

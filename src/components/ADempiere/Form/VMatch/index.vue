<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-container style="height: 100% !important;">
    <el-header>
      <el-steps :active="active" finish-status="success" process-status="finish">
        <el-step
          v-for="(item, index) in step"
          :key="index"
          :title="item.name"
        />
      </el-steps>
    </el-header>
    <carousel
      :step-reference="metadata.fileName"
      :steps="step"
      :indicator="active"
      style="display: contents;height: -webkit-fill-available;"
    >
      <search-criteria
        v-if="active === 0"
        :metadata="fieldsList"
      />
      <invoices
        v-if="active === 1"
      />
      <receipt
        v-if="active === 2"
      />
    </carousel>
    <div :class="styleFooter">
      <el-button type="primary" :icon="iconStep" style="float: right;" @click="next" />
      <el-button v-show="active > 0" type="danger" icon="el-icon-close" style="float: right;margin-right: 10px;" @click="prev" />
    </div>
  </el-container>
</template>

<script>
import Carousel from '@/components/ADempiere/Carousel'
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import fieldsList from './fieldList.js'
import SearchCriteria from './components/SearchCriteria/index'
import Invoices from './components/Invoices/index'
import Receipt from './components/Receipt/index'
export default {
  name: 'VMatch',
  components: {
    Carousel,
    SearchCriteria,
    Invoices,
    Receipt
  },
  mixins: [
    formMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'V-Match',
          containerUuid: 'V-Match',
          fieldsList
        }
      }
    }
  },
  data() {
    return {
      fieldsList,
      active: 0
    }
  },
  computed: {
    styleFooter() {
      const showTitle = this.$store.getters.getIsShowTitleForm
      if (showTitle) {
        return 'show-title-footer'
      }
      return 'from-footer'
    },
    step() {
      return [
        {
          name: this.$t('views.searchCriteria'),
          description: this.$t('form.match.description.searchCriteria')
        },
        {
          name: this.$t('form.match.title.invoice'),
          description: this.$t('form.match.description.invoice')
        },
        {
          name: this.$t('form.match.title.deliveryReceipt'),
          description: this.$t('form.match.description.deliveryReceipt')
        }
      ]
    },
    businessPartnerUuid() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID_UUID'
      })
    },
    selectedInvoice() {
      return this.$store.getters.getSelectedInvoceMatch
    },
    selectedReceipts() {
      return this.$store.getters.getSelectedReceiptsMatch
    },
    iconStep() {
      const step = this.step.length - 1
      if (step === this.active) {
        return 'el-icon-s-tools'
      }
      return 'el-icon-check'
    }
  },
  watch: {
    businessPartnerUuid(value) {
      if (!this.isEmptyValue(value)) {
        this.$store.dispatch('serverInvocesList', {
          businessPartnerUuid: value,
          formUuid: this.$route.meta.uuid
        })
        this.$store.dispatch('serverReceiptsList', {
          businessPartnerUuid: value,
          formUuid: this.$route.meta.uuid
        })
      }
    }
  },
  methods: {
    next() {
      if (this.iconStep !== 'el-icon-s-tools') {
        this.active++
      } else {
        this.sendAssignment(this.businessPartnerUuid)
      }
    },
    prev() {
      this.active--
    },
    sendAssignment(businessPartnerUuid) {
      this.$store.dispatch('processAssignment', {
        businessPartnerUuid,
        receiptUuid: this.selectedReceipts,
        invoceUuid: this.selectedInvoice,
        formUuid: this.$route.meta.uuid
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .from-main {
    padding-right: 1% !important;
    padding-bottom: 0px !important;
    padding-top: 0px !important;
    padding-left: 1% !important;
    height: 90%;
  }
  .card-form {
    height: 100% !important;
    overflow: auto;
  }
  .header {
    padding-bottom: 0px;
    box-sizing: border-box;
    flex-shrink: 0;
    height: 4% !important;
    padding-left: 1%;
    padding-right: 1%;
  }
  .from-footer {
    height: 5% !important;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  .show-title-footer {
    height: 15% !important;
    box-sizing: border-box;
    flex-shrink: 0
  }
  .main {
    height: 90%;
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 0px;
    padding-right: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
}
</style>

<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <div class="wrapper" style="margin: 15px">
    <el-form
      label-position="top"
      label-width="200px"
    >
      <div class="cards-not-group">
        <div class="card">
          <filter-fields
            :container-uuid="containerUuid"
            :panel-type="panelType"
          />
          <el-card
            :shadow="shadowGroup"
            :body-style="{ padding: '10px' }"
          >
            <el-row>
              <template v-for="(fieldAttributes, subKey) in fieldsList">
                <field-definition
                  :ref="fieldAttributes.columnName"
                  :key="subKey"
                  :metadata-field="{
                    ...fieldAttributes
                  }"
                />
              </template>
            </el-row>
          </el-card>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import FieldDefinition from '@/components/ADempiere/Field'
import FilterFields from '@/components/ADempiere/FilterFields'

export default defineComponent({
  name: 'StandardPanel',

  components: {
    FieldDefinition,
    FilterFields
  },

  props: {
    containerUuid: {
      type: String,
      required: true
    },
    panelMetadata: {
      type: Object,
      default: () => {}
    }
  },

  setup(props, { root }) {
    const panelType = ref(props.panelMetadata.panelType)
    let fieldsList = []

    const generatePanel = () => {
      // order and assign groups
      if (props.panelMetadata) {
        fieldsList = props.panelMetadata.fieldsList
      }
    }

    const shadowGroup = computed(() => {
      if (root.$store.state.app.device === 'mobile') {
        return 'never'
      }
      return 'hover'
    })

    generatePanel()

    return {
      fieldsList,
      panelType,
      shadowGroup
    }
  }
})
</script>

<style scoped>
.el-card {
  width: 100% !important;
}
</style>

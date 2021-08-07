<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanchez@erpya.com www.erpya.com
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
  <el-form v-if="!isEmptyValue(metadata)" label-position="top" class="from-main">
    <el-form-item>
      <el-row>
        <el-col v-for="(field, index) in metadata" :key="index" :span="6">
          <field
            :key="field.columnName"
            :metadata-field="field"
            :v-model="field.value"
          />
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import Field from '@/components/ADempiere/Field'

export default {
  name: 'SearchCriteria',
  components: {
    Field
  },
  props: {
    metadata: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

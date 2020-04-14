<template>
  <el-form>
    <el-row
      v-for="(metadata) in metadataList"
      :key="metadata.columnName"
    >
      <field
        :metadata-field="metadata"
      />
    </el-row>
  </el-form>
</template>

<script>
import Field from '@/components/ADempiere/Field'
import { createField } from '@/utils/ADempiere/lookupFactory'
import { URL, TEXT, NUMBER, INTEGER, TEXT_LONG } from '@/utils/ADempiere/references'

export default {
  name: 'TestView',
  components: {
    Field
  },
  data() {
    return {
      metadataList: []
    }
  },
  created() {
    // URL
    this.metadataList.push(createField({
      columnName: 'URL',
      name: 'Web',
      displayType: URL.id
    }))
    // Text
    this.metadataList.push(createField({
      columnName: 'Name',
      name: 'Only Name',
      displayType: TEXT.id
    }))
    // Amount
    this.metadataList.push(createField({
      columnName: 'Amount',
      name: 'Amount for it',
      displayType: NUMBER.id
    }))
    // Integer
    this.metadataList.push(createField({
      columnName: 'SeqNo',
      name: 'Sequence for record',
      displayType: INTEGER.id
    }))
    // Text Long
    this.metadataList.push(createField({
      columnName: 'Description',
      name: 'Only Description',
      displayType: TEXT_LONG.id
    }))
    // Table direct
    // To be define
    // this.metadataList.push(createField({
    //   columnName: 'C_Country',
    //   name: 'Country',
    //   displayType: TABLE_DIR.id
    // }))
  }
}
</script>

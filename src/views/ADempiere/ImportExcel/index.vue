<template>
  <el-container
    style="height: 100% !important;position: absolute;width: 100%;"
  >
    <el-header>
      <el-steps :active="active" finish-status="success" process-status="finish">
        <el-step
          v-for="(item, index) in step"
          :key="index"
          :title="item.name"
        />
      </el-steps>
    </el-header>
    <el-main style="padding-right: 0px !important; padding-bottom: 0px !important;padding-top: 0px !important;padding-left: 0px !important;">
      <carousel
        :step-reference="'UploadExcel'"
        :steps="step"
        :indicator="active"
        style="display: contents;height: -webkit-fill-available;"
      >
        <div v-if="active === 0" class="app-container">
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
          <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
            <el-table-column v-for="item of tableHeader" :key="item" :label="item">
              <template slot-scope="scope">
                <span :style="alignTable(scope.row[item])">
                  {{ scope.row[item] }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-table v-if="active === 1" :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column
            v-for="(item, key) of tableHeader"
            :key="key"
            :prop="item"
          >
            <template slot="header" slot-scope="scope">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ scope.column.filterPlacement }} {{ displaye(item, search, key) }} <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{
                      label: 'Organizacion',
                      value: item,
                      key
                    }"
                  >
                    Organizacion
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="{
                      label: 'Codigo',
                      value: item,
                      key
                    }"
                  >
                    Codigo
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="{
                      label: 'Cantidad',
                      value: item,
                      key
                    }"
                  >
                    Cantidad
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </carousel>
    </el-main>
    <div style="width: 2%;position: fixed;right: 0;top: 50%;z-index: 2;">
      <el-button v-show="active !== (step.length - 1)" type="primary" :icon="active === 3 ? 'el-icon-check' : 'el-icon-right'" circle @click="next" />
    </div>
    <div style="position: fixed;top: 50%;z-index: 2;">
      <el-button v-show="active > 0" type="primary" icon="el-icon-back" circle @click="prev" />
    </div>
    <el-footer :class="styleFooter">
      <el-button v-show="active === (step.length - 1)" type="primary" icon="el-icon-check" style="float: right;" />
    </el-footer>
  </el-container>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import Carousel from '@/components/ADempiere/Carousel'

export default {
  name: 'UploadExcel',
  components: {
    UploadExcelComponent,
    Carousel
  },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      newHeader: [],
      active: 0,
      search: []
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
          name: 'Cargar Excel',
          icon: 'el-i.con-search',
          description: 'Arrastre o Seleccione un archivo Excel'
        },
        {
          name: 'Ordenar Encabezado',
          icon: 'el-icon-tickets',
          description: 'Seleccione el encabezado segun la informacion'
        },
        {
          name: 'Importar Excel',
          icon: 'el-icon-document',
          description: 'Verifique la informacion de la tabla antes de importar'
        }
      ]
    }
  },
  methods: {
    alignTable(row) {
      if (typeof row === 'number') {
        return 'float: right;'
      }
      return 'float: left;'
    },
    displaye(label, newLabel, key) {
      if (this.isEmptyValue(newLabel)) {
        return label
      }
      const header = newLabel.find(heard => {
        if (heard && heard.value === label && heard.key === key) {
          return heard
        }
      })
      if (header) {
        return header.label
      }
      return label
    },
    handleCommand(command) {
      this.search.push(command)
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ data, workbook, firstSheetName, worksheet, results, header }) {
      console.log({ data, workbook, firstSheetName, worksheet, results, header })
      const epale = results.filter((data, index) => {
        if (index <= 5) {
          return data
        }
      })
      this.tableData = epale
      this.tableHeader = header
    },
    next() {
      if (this.active < 2) {
        this.active++
      } else {
        this.exporRecordTable()
      }
    },
    prev() {
      this.active--
    }
  }
}
</script>
